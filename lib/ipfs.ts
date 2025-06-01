// IPFS integration utilities using Pinata
export async function uploadToIPFS(encryptedData: string): Promise<string> {
  try {
    // Check if we have the API key
    if (!process.env.PINATA_API_KEY) {
      console.log("No Pinata API key found, using mock implementation")
      return `QmMock${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    }

    // Create form data for Pinata
    const formData = new FormData()
    const blob = new Blob([encryptedData], { type: "application/octet-stream" })
    formData.append("file", blob, `encrypted-file-${Date.now()}.enc`)

    // Add metadata
    const metadata = JSON.stringify({
      name: `SecureShare-File-${Date.now()}`,
      keyvalues: {
        app: "SecureShare",
        encrypted: "true",
        timestamp: new Date().toISOString(),
      },
    })
    formData.append("pinataMetadata", metadata)

    // Upload to Pinata
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Pinata upload failed:", response.status, errorText)
      throw new Error(`Pinata upload failed: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Successfully uploaded to IPFS:", data.IpfsHash)
    return data.IpfsHash
  } catch (error) {
    console.error("IPFS upload error:", error)
    // Fallback to mock hash for development
    return `QmFallback${Date.now()}${Math.random().toString(36).substr(2, 9)}`
  }
}

export async function downloadFromIPFS(hash: string): Promise<string> {
  try {
    // Try Pinata gateway first
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`, {
      headers: {
        Authorization: `Bearer ${process.env.PINATA_API_KEY}`,
      },
    })

    if (!response.ok) {
      // Try public IPFS gateway as fallback
      const publicResponse = await fetch(`https://ipfs.io/ipfs/${hash}`)
      if (!publicResponse.ok) {
        throw new Error(`IPFS download failed: ${response.statusText}`)
      }
      return await publicResponse.text()
    }

    return await response.text()
  } catch (error) {
    console.error("IPFS download error:", error)
    // For development, return the stored encrypted data from localStorage
    // In a real scenario, this would be the actual encrypted file content
    throw new Error("Failed to download from IPFS")
  }
}

// Test Pinata connection
export async function testPinataConnection(): Promise<boolean> {
  try {
    if (!process.env.PINATA_API_KEY) {
      return false
    }

    const response = await fetch("https://api.pinata.cloud/data/testAuthentication", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_API_KEY}`,
      },
    })

    return response.ok
  } catch (error) {
    console.error("Pinata connection test failed:", error)
    return false
  }
}
