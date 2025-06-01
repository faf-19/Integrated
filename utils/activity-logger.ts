// Activity logger utility

export interface ActivityLogEntry {
  id?: string
  type: "upload" | "share" | "view" | "download" | "delete"
  fileName: string
  user: string
  sharedWith?: string
  sharedBy?: string
  timestamp: string
  status: "success" | "failed"
  blockchainTx: string
}

export function recordActivity(activity: ActivityLogEntry): void {
  try {
    // Generate ID if not provided
    if (!activity.id) {
      activity.id = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Get existing activities
    const existingActivities = JSON.parse(localStorage.getItem("userActivities") || "[]")

    // Add new activity at the beginning
    existingActivities.unshift(activity)

    // Store back to localStorage
    localStorage.setItem("userActivities", JSON.stringify(existingActivities))

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event("storage"))

    console.log(`Activity recorded: ${activity.type} - ${activity.fileName}`)
  } catch (error) {
    console.error("Failed to record activity:", error)
  }
}

export function clearActivities(): void {
  localStorage.removeItem("userActivities")
  window.dispatchEvent(new Event("storage"))
}
