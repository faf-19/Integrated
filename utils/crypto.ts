// Crypto utilities for file encryption/decryption
export class FileCrypto {
  // Generate a random encryption key
  static generateKey(): string {
    const array = new Uint8Array(32) // 256 bits
    crypto.getRandomValues(array)
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Convert hex string to Uint8Array
  static hexToUint8Array(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = Number.parseInt(hex.substr(i, 2), 16)
    }
    return bytes
  }

  // Convert Uint8Array to hex string
  static uint8ArrayToHex(array: Uint8Array): string {
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
  }

  // Encrypt file data
  static async encryptFile(file: File, key: string): Promise<{ encryptedData: string; iv: string }> {
    try {
      // Convert file to ArrayBuffer
      const fileBuffer = await file.arrayBuffer()

      // Generate random IV (Initialization Vector)
      const iv = crypto.getRandomValues(new Uint8Array(16))

      // Import the key
      const cryptoKey = await crypto.subtle.importKey("raw", this.hexToUint8Array(key), { name: "AES-GCM" }, false, [
        "encrypt",
      ])

      // Encrypt the file
      const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, cryptoKey, fileBuffer)

      // Convert to base64 for storage
      const encryptedArray = new Uint8Array(encryptedBuffer)
      const encryptedData = btoa(String.fromCharCode(...encryptedArray))

      return {
        encryptedData,
        iv: this.uint8ArrayToHex(iv),
      }
    } catch (error) {
      console.error("Encryption failed:", error)
      throw new Error("Failed to encrypt file")
    }
  }

  // Decrypt file data
  static async decryptFile(
    encryptedData: string,
    key: string,
    iv: string,
    originalName: string,
    mimeType: string,
  ): Promise<File> {
    try {
      // Convert base64 back to ArrayBuffer
      const encryptedBytes = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0))

      // Import the key
      const cryptoKey = await crypto.subtle.importKey("raw", this.hexToUint8Array(key), { name: "AES-GCM" }, false, [
        "decrypt",
      ])

      // Decrypt the file
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: this.hexToUint8Array(iv) },
        cryptoKey,
        encryptedBytes,
      )

      // Create a new File object from the decrypted data
      const decryptedFile = new File([decryptedBuffer], originalName, { type: mimeType })

      return decryptedFile
    } catch (error) {
      console.error("Decryption failed:", error)
      throw new Error("Failed to decrypt file - invalid key or corrupted data")
    }
  }

  // Create download link for decrypted file
  static createDownloadLink(file: File): string {
    return URL.createObjectURL(file)
  }
}
