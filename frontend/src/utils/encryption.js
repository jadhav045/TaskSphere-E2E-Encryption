// Web Crypto API based encryption utility

class EncryptionService {
  constructor() {
    this.keyPair = null;
    this.symmetricKey = null;
  }

  // Generate RSA key pair for user
  async generateKeyPair() {
    try {
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );
      return this.keyPair;
    } catch (error) {
      console.error('Error generating key pair:', error);
      throw error;
    }
  }

  // Export public key as string
  async exportPublicKey(publicKey = this.keyPair?.publicKey) {
    try {
      const exported = await window.crypto.subtle.exportKey('spki', publicKey);
      const exportedAsString = this.arrayBufferToBase64(exported);
      return exportedAsString;
    } catch (error) {
      console.error('Error exporting public key:', error);
      throw error;
    }
  }

  // Import public key from string
  async importPublicKey(publicKeyString) {
    try {
      const publicKeyBuffer = this.base64ToArrayBuffer(publicKeyString);
      return await window.crypto.subtle.importKey(
        'spki',
        publicKeyBuffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['encrypt']
      );
    } catch (error) {
      console.error('Error importing public key:', error);
      throw error;
    }
  }

  // Generate symmetric key for actual data encryption
  async generateSymmetricKey() {
    try {
      this.symmetricKey = await window.crypto.subtle.generateKey(
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );
      return this.symmetricKey;
    } catch (error) {
      console.error('Error generating symmetric key:', error);
      throw error;
    }
  }

  // Encrypt data using AES-GCM
  async encryptData(data, key = this.symmetricKey) {
    try {
      if (!key) {
        await this.generateSymmetricKey();
        key = this.symmetricKey;
      }

      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(JSON.stringify(data));

      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encodedData
      );

      return {
        encrypted: this.arrayBufferToBase64(encryptedData),
        iv: this.arrayBufferToBase64(iv),
      };
    } catch (error) {
      console.error('Error encrypting data:', error);
      throw error;
    }
  }

  // Decrypt data using AES-GCM
  async decryptData(encryptedData, ivString, key = this.symmetricKey) {
    try {
      const iv = this.base64ToArrayBuffer(ivString);
      const data = this.base64ToArrayBuffer(encryptedData);

      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        data
      );

      const decodedData = new TextDecoder().decode(decryptedData);
      return JSON.parse(decodedData);
    } catch (error) {
      console.error('Error decrypting data:', error);
      throw error;
    }
  }

  // Store keys in localStorage (encrypted with password in production)
  async storeKeys(password) {
    try {
      if (!this.keyPair || !this.symmetricKey) {
        throw new Error('Keys not generated');
      }

      const privateKey = await window.crypto.subtle.exportKey('pkcs8', this.keyPair.privateKey);
      const symmetricKeyRaw = await window.crypto.subtle.exportKey('raw', this.symmetricKey);
      
      localStorage.setItem('privateKey', this.arrayBufferToBase64(privateKey));
      localStorage.setItem('symmetricKey', this.arrayBufferToBase64(symmetricKeyRaw));
      
      const publicKeyString = await this.exportPublicKey();
      return publicKeyString;
    } catch (error) {
      console.error('Error storing keys:', error);
      throw error;
    }
  }

  // Restore keys from localStorage
  async restoreKeys() {
    try {
      const privateKeyString = localStorage.getItem('privateKey');
      const symmetricKeyString = localStorage.getItem('symmetricKey');

      if (!privateKeyString || !symmetricKeyString) {
        return false;
      }

      const privateKeyBuffer = this.base64ToArrayBuffer(privateKeyString);
      const symmetricKeyBuffer = this.base64ToArrayBuffer(symmetricKeyString);

      const privateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        privateKeyBuffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        true,
        ['decrypt']
      );

      this.symmetricKey = await window.crypto.subtle.importKey(
        'raw',
        symmetricKeyBuffer,
        {
          name: 'AES-GCM',
          length: 256,
        },
        true,
        ['encrypt', 'decrypt']
      );

      // We don't store public key locally as it's on server
      this.keyPair = { privateKey, publicKey: null };
      
      return true;
    } catch (error) {
      console.error('Error restoring keys:', error);
      return false;
    }
  }

  // Clear keys from memory and storage
  clearKeys() {
    this.keyPair = null;
    this.symmetricKey = null;
    localStorage.removeItem('privateKey');
    localStorage.removeItem('symmetricKey');
  }

  // Helper: ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Helper: Base64 to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export default new EncryptionService();