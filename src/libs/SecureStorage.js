import { apiCall } from "./Network";

export class SecureStorage {
  constructor(backend = 'local', options = {}) {
    this.key = null; // CryptoKey object (set after init)
    this.backend = backend;
    this.options = options;
    this.isLocalStorageAvailable = typeof window !== 'undefined' && window.localStorage;
  }

  // ======================
  // Public Methods
  // ======================

  // Fetch the encryption key from the server
  async init() {
    
    try {
      const response = await apiCall("get", "/auth/encryptionKey");

      // app.get('/api/get-encryption-key', (req, res) => {
      //   const key = req.cookies.encryptionKey;
      //   res.json({ key });
      // });
      
      //const { key } = await response.json(); // Server sends { key: 'base64Key' }
      const { key } = response;
      this.key = await this.#importKey(key); // Convert to CryptoKey
      console.log("CryptoKey:", this.key);
    } catch (error) {
      console.error('Failed to initialize SecureStorage:', error);
      throw error;
    }
  }

  // Convert base64 string to CryptoKey
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

  // Encrypt key/value
  async set(key, value/*, password*/) {
    if (this.backend === 'local') {
      if (!this.isLocalStorageAvailable) throw new Error('localStorage not available');
      if (!this.key) throw new Error('SecureStorage not initialized');

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.key,
        new TextEncoder().encode(JSON.stringify(value))
      );

      localStorage.setItem(key, JSON.stringify({
        iv: Array.from(iv).toString(),
        data: Array.from(new Uint8Array(encrypted)).toString()
      }));
    } else {
      // Server side storage logic - TODO...
      apiCall("post", "/auth/storeEncryptedData", { key, value });
    }
  }

  // Decrypt value from key
  async get(key/*, password*/) {
    if (this.backend === 'local') {
      if (!this.isLocalStorageAvailable) throw new Error('localStorage not available');
      if (!this.key) throw new Error('SecureStorage not initialized');
      const item = localStorage.getItem(key);
      if (!item) return null;
      const { iv, data } = JSON.parse(item);
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(iv.split(',').map(Number))
        },
        this.key,
        new Uint8Array(data.split(',').map(Number))
      );
      return JSON.parse(new TextDecoder().decode(decrypted));
    } else {
      // Server side retrieval logic - TODO...
      const data = await apiCall("get", "/auth/loadEncryptedData", { key });
      return data;
    }
  }

  // ======================
  // Private Encryption Methods 
  // (Prefixed with `#` for true privacy in ES2022+)
  // ======================
  async #getKey(password) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('secure-salt'), // Use a fixed or stored salt
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

/*
  async #encryptData(data, password) {
    const key = await this.#getKey(password);
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(JSON.stringify(data)) // Stringify if data is an object
    );

    return {
      iv: Array.from(iv).toString(),
      data: Array.from(new Uint8Array(encrypted)).toString(),
    };
  }

  async #decryptData(encryptedData, password) {
    const key = await this.#getKey(password);
    const iv = new Uint8Array(encryptedData.iv.split(',').map(Number));
    const data = new Uint8Array(encryptedData.data.split(',').map(Number));

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return JSON.parse(new TextDecoder().decode(decrypted)); // Parse if data was stringified
  }
*/
}
