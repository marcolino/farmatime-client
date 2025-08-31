import { i18n } from "../i18n";
import { apiCall } from "./Network";
import config from "../config";

export class SecureStorage {
  constructor(backend = 'local', options = {}) {
    this.key = null; // CryptoKey object
    this.backend = backend;
    this.options = options;
    this.isLocalStorageAvailable = (typeof window !== 'undefined' && !!window.localStorage);
  }

  async init() {
    const response = await apiCall("get", "/auth/encryptionKey");
    if (response.status === 403) {
      throw {message: i18n.t('Encryption key not available. Please log in.'), code: response.status}; 
    }
    try {
      const { key } = response;
      this.key = await this.#importKey(key);
    } catch (error) {
      throw new Error(i18n.t('Failed to initialize SecureStorage: {{err}}', {err: error.message}));
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

  getSecureStorageKey(userId) {
    if (!this.key) throw new Error(i18n.t('SecureStorage not initialized'));
    if (!userId) throw new Error(i18n.t('Can\'t get Secure Storage Key without a user id'));
    return `${config.ui.jobs.storageKey}-${userId}`;
  }

  async encrypt(value) {
    if (!this.key) throw new Error(i18n.t('SecureStorage not initialized'));
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
    if (!this.key) throw new Error(i18n.t('SecureStorage not initialized'));
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      this.key,
      new Uint8Array(data)
    );
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  async set(key, value) {
    if (this.backend === 'local') {
      if (!this.isLocalStorageAvailable) {
        throw new Error(i18n.t('LocalStorage not available'));
      }
      const encrypted = await this.encrypt(value);
      localStorage.setItem(key, JSON.stringify(encrypted));
    // } else {
    //   if (this.backend === 'remote') {
        try {
          const userId = key.replace(config.ui.jobs.storageKey + '-', '');
          const result = await apiCall("post", "/user/updateUser", { userId, jobs: encrypted });
          console.info("RESULT:", result);
          // if (result.err) {
          //   showSnackbar(result.message, "error");
          // } else {
          //   console.log("*** updateUser result:", result);
          // }
        } catch (err) {
          throw new Error(i18n.t('Error updating user: {{err}}', {err: err.message}));
        }
      // } else {
      //   throw new Error(i18n.t('Only "local" backend is implemented.'));
      // }
    }   
  }

  async get(key) {
    if (this.backend === 'local') {
      if (!this.isLocalStorageAvailable) throw new Error(i18n.t('LocalStorage not available'));
      const item = localStorage.getItem(key);
      if (!item) return null;
      const parsed = JSON.parse(item);
      return await this.decrypt(parsed);
    } else {
      throw new Error(i18n.t('Only "local" backend is implemented.'));
    }
  }

  async remove(key) {
    if (this.backend === 'local') {
      if (!this.isLocalStorageAvailable) throw new Error('LocalStorage not available');
      localStorage.removeItem(key);
    } else {
      throw new Error(i18n.t('Only "local" backend is implemented.'));
    }
  }
};
