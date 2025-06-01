// Advanced crypto utilities with public/private key support
export class AdvancedFileCrypto {
  // Generate a new key pair for a user
  static async generateKeyPair(): Promise<{ publicKey: string; privateKey: string; keyId: string }> {
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
      )

      // Export keys
      const publicKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey)
      const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)

      // Convert to base64
      const publicKey = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)))
      const privateKey = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)))

      // Generate unique key ID
      const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return { publicKey, privateKey, keyId }
    } catch (error) {
      console.error("Key generation failed:", error)
      throw new Error("Failed to generate key pair")
    }
  }

  // Convert base64 string to ArrayBuffer
  static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }

  // Convert ArrayBuffer to base64 string
  static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // Import public key from base64
  static async importPublicKey(publicKeyBase64: string): Promise<CryptoKey> {
    try {
      const publicKeyBuffer = this.base64ToArrayBuffer(publicKeyBase64)
      return await crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["encrypt"],
      )
    } catch (error) {
      console.error("Public key import failed:", error)
      throw new Error("Invalid public key format")
    }
  }

  // Import private key from base64
  static async importPrivateKey(privateKeyBase64: string): Promise<CryptoKey> {
    try {
      const privateKeyBuffer = this.base64ToArrayBuffer(privateKeyBase64)
      return await crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer,
        {
          name: "RSA-OAEP",
          hash: "SHA-256",
        },
        false,
        ["decrypt"],
      )
    } catch (error) {
      console.error("Private key import failed:", error)
      throw new Error("Invalid private key format")
    }
  }

  // Encrypt file with hybrid encryption (RSA + AES)
  static async encryptFileHybrid(
    file: File,
    recipientPublicKey: string,
  ): Promise<{
    encryptedData: string
    encryptedAESKey: string
    iv: string
  }> {
    try {
      console.log("Starting hybrid encryption...")

      // Step 1: Generate AES key for file encryption
      console.log("Generating AES key...")
      const aesKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])

      // Step 2: Generate IV for AES encryption
      console.log("Generating IV...")
      const iv = crypto.getRandomValues(new Uint8Array(12))

      // Step 3: Encrypt file with AES
      console.log("Encrypting file with AES...")
      const fileBuffer = await file.arrayBuffer()
      const encryptedFileBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, aesKey, fileBuffer)

      // Step 4: Export AES key to raw format
      console.log("Exporting AES key...")
      const aesKeyBuffer = await crypto.subtle.exportKey("raw", aesKey)

      // Step 5: Import recipient's public key
      console.log("Importing public key...")
      const publicKey = await this.importPublicKey(recipientPublicKey)

      // Step 6: Encrypt AES key with recipient's public key
      console.log("Encrypting AES key with RSA...")
      const encryptedAESKeyBuffer = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, aesKeyBuffer)

      // Step 7: Convert everything to base64
      console.log("Converting to base64...")
      const result = {
        encryptedData: this.arrayBufferToBase64(encryptedFileBuffer),
        encryptedAESKey: this.arrayBufferToBase64(encryptedAESKeyBuffer),
        iv: this.arrayBufferToBase64(iv.buffer),
      }

      console.log("Hybrid encryption completed successfully")
      return result
    } catch (error) {
      console.error("Hybrid encryption failed:", error)
      throw new Error(`Failed to encrypt file: ${error.message}`)
    }
  }

  // Decrypt file with private key
  static async decryptFileHybrid(
    encryptedData: string,
    encryptedAESKey: string,
    iv: string,
    privateKey: string,
    originalName: string,
    mimeType: string,
  ): Promise<File> {
    try {
      console.log("Starting hybrid decryption...")

      // Step 1: Import private key
      console.log("Importing private key...")
      const cryptoPrivateKey = await this.importPrivateKey(privateKey)

      // Step 2: Decrypt AES key with private key
      console.log("Decrypting AES key...")
      const encryptedAESKeyBuffer = this.base64ToArrayBuffer(encryptedAESKey)
      const aesKeyBuffer = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, cryptoPrivateKey, encryptedAESKeyBuffer)

      // Step 3: Import AES key
      console.log("Importing AES key...")
      const aesKey = await crypto.subtle.importKey("raw", aesKeyBuffer, { name: "AES-GCM" }, false, ["decrypt"])

      // Step 4: Decrypt file data
      console.log("Decrypting file data...")
      const encryptedFileBuffer = this.base64ToArrayBuffer(encryptedData)
      const ivBuffer = this.base64ToArrayBuffer(iv)

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
        aesKey,
        encryptedFileBuffer,
      )

      // Step 5: Create File object
      console.log("Creating file object...")
      const decryptedFile = new File([decryptedBuffer], originalName, { type: mimeType })

      console.log("Hybrid decryption completed successfully")
      return decryptedFile
    } catch (error) {
      console.error("Hybrid decryption failed:", error)
      throw new Error(`Failed to decrypt file: ${error.message}`)
    }
  }

  // Encrypt private key with password
  static async encryptPrivateKey(
    privateKey: string,
    password: string,
  ): Promise<{
    encryptedPrivateKey: string
    salt: string
    iv: string
  }> {
    try {
      console.log("Encrypting private key...")

      const encoder = new TextEncoder()
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))

      // Derive key from password
      const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
        "deriveKey",
      ])

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"],
      )

      // Encrypt private key
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        derivedKey,
        encoder.encode(privateKey),
      )

      return {
        encryptedPrivateKey: this.arrayBufferToBase64(encryptedBuffer),
        salt: this.arrayBufferToBase64(salt.buffer),
        iv: this.arrayBufferToBase64(iv.buffer),
      }
    } catch (error) {
      console.error("Private key encryption failed:", error)
      throw new Error("Failed to encrypt private key")
    }
  }

  // Decrypt private key with password
  static async decryptPrivateKey(
    encryptedPrivateKey: string,
    password: string,
    salt: string,
    iv: string,
  ): Promise<string> {
    try {
      console.log("Decrypting private key...")

      const encoder = new TextEncoder()
      const decoder = new TextDecoder()

      // Convert from base64
      const saltBuffer = this.base64ToArrayBuffer(salt)
      const ivBuffer = this.base64ToArrayBuffer(iv)
      const encryptedBuffer = this.base64ToArrayBuffer(encryptedPrivateKey)

      // Derive key from password
      const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, [
        "deriveKey",
      ])

      const derivedKey = await crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: new Uint8Array(saltBuffer),
          iterations: 100000,
          hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"],
      )

      // Decrypt private key
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(ivBuffer) },
        derivedKey,
        encryptedBuffer,
      )

      return decoder.decode(decryptedBuffer)
    } catch (error) {
      console.error("Private key decryption failed:", error)
      throw new Error("Invalid password or corrupted private key")
    }
  }
}
