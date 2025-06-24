import { apiCall } from "./Network";

// Simple LZ-string style compression
class SimpleCompressor {
  static compress(str) {
    const dict = {};
    const data = (str + "").split("");
    const out = [];
    let dictSize = 256;
    let phrase = data[0];
    let code = 256;

    for (let i = 1; i < data.length; i++) {
      const curr = data[i];
      const temp = phrase + curr;
      
      if (dict[temp] != null) {
        phrase = temp;
      } else {
        if (phrase.length > 1) {
          if (dict[phrase] != null) {
            out.push(dict[phrase]);
          } else {
            out.push(phrase.charCodeAt(0));
          }
        } else {
          out.push(phrase.charCodeAt(0));
        }
        
        dict[temp] = code;
        code++;
        phrase = curr;
      }
    }
    
    if (phrase.length > 1) {
      if (dict[phrase] != null) {
        out.push(dict[phrase]);
      } else {
        out.push(phrase.charCodeAt(0));
      }
    } else {
      out.push(phrase.charCodeAt(0));
    }
    
    return out;
  }

  static decompress(data) {
    const dict = {};
    let dictSize = 256;
    let result = String.fromCharCode(data[0]);
    let w = result;
    
    for (let i = 1; i < data.length; i++) {
      const k = data[i];
      let entry;
      
      if (dict[k]) {
        entry = dict[k];
      } else if (k === dictSize) {
        entry = w + w.charAt(0);
      } else {
        entry = String.fromCharCode(k);
      }
      
      result += entry;
      dict[dictSize++] = w + entry.charAt(0);
      w = entry;
    }
    
    return result;
  }
}

export class SecureStorage {
  constructor(backend = 'local', options = {}) {
    this.key = null; // CryptoKey object
    this.backend = backend;
    this.options = {
      compress: true, // Enable compression by default
      minifyJson: true, // Remove unnecessary whitespace
      ...options
    };
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

  #preprocessData(value) {
    // Convert to JSON string
    let jsonStr = this.options.minifyJson 
      ? JSON.stringify(value) 
      : JSON.stringify(value, null, 0);

    // Apply compression if enabled
    if (this.options.compress) {
      const compressed = SimpleCompressor.compress(jsonStr);
      // Only use compression if it actually reduces size
      const compressedStr = JSON.stringify(compressed);
      if (compressedStr.length < jsonStr.length) {
        return { compressed: true, data: compressedStr };
      }
    }
    
    return { compressed: false, data: jsonStr };
  }

  #postprocessData(processedData) {
    if (processedData.compressed) {
      const compressedArray = JSON.parse(processedData.data);
      const decompressed = SimpleCompressor.decompress(compressedArray);
      return JSON.parse(decompressed);
    }
    return JSON.parse(processedData.data);
  }

  async encrypt(value) {
    if (!this.key) throw new Error('SecureStorage not initialized');
    
    const processed = this.#preprocessData(value);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(processed));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.key,
      encoded
    );

    // Convert to more compact representation
    return {
      // Convert IV to base64 instead of array
      i: btoa(String.fromCharCode(...iv)),
      // Convert encrypted data to base64 instead of array
      d: btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    };
  }

  async decrypt({ i: ivBase64, d: dataBase64, iv, data }) {
    if (!this.key) throw new Error('SecureStorage not initialized');
    
    // Support both old and new formats
    const ivArray = ivBase64 
      ? Uint8Array.from(atob(ivBase64), c => c.charCodeAt(0))
      : new Uint8Array(iv);
      
    const dataArray = dataBase64
      ? Uint8Array.from(atob(dataBase64), c => c.charCodeAt(0))
      : new Uint8Array(data);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      this.key,
      dataArray
    );
    
    const processedData = JSON.parse(new TextDecoder().decode(decrypted));
    return this.#postprocessData(processedData);
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
