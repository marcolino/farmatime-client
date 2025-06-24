import { apiCall } from "./Network";

export class SecureStorage {
  constructor(backend = 'local', options = {}) {
    this.key = null; // CryptoKey object
    this.backend = backend;
    this.options = options;
    this.isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
  }

  async init() {
    try {
      const response = await apiCall("get", "/auth/encryptionKey");
      const { key } = response;
      this.key = await this.#importKey(key);
    } catch (error) {
      console.error('Failed to initialize SecureStorage:', error);
      throw error;
    }
  }

  async #importKey(base64Key) {
    const rawKey = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
    return crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(value) {
    if (!this.key) throw new Error('SecureStorage not initialized');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(value));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encoded
    );
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    };
  }

  async decrypt({ iv, data }) {
    if (!this.key) throw new Error('SecureStorage not initialized');
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      this.key,
      new Uint8Array(data)
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  async set(key, value) {
    if (this.backend === 'local') {
      if (!this.isLocalStorageAvailable) throw new Error('LocalStorage not available');
      const encrypted = await this.encrypt(value);
      localStorage.setItem(key, JSON.stringify(encrypted));
    } else {
      throw new Error('Only "local" backend is implemented.');
    }
  }

  async get(key) {
    if (this.backend === 'local') {
      if (!this.isLocalStorageAvailable) throw new Error('LocalStorage not available');
      const item = localStorage.getItem(key);
      if (!item) return null;
      const parsed = JSON.parse(item);
      return await this.decrypt(parsed);
    } else {
      throw new Error('Only "local" backend is implemented.');
    }
  }
}
