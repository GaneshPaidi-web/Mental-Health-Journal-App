export function initializeSuperAdmin() {
  try {
    // Get existing users
    const users = JSON.parse(localStorage.getItem("users") || "[]")

    // Check if superadmin already exists
    const adminExists = users.some((user: any) => user.email === "admin@mindjournal.com")

    if (!adminExists) {
      // Create superadmin account
      const superAdmin = {
        id: "admin-" + Date.now().toString(),
        name: "Admin",
        email: "admin@mindjournal.com",
        password: "Admin@123", // In a real app, this would be hashed
        role: "superadmin",
        createdAt: new Date().toISOString(),
      }

      users.push(superAdmin)
      localStorage.setItem("users", JSON.stringify(users))

      console.log("Superadmin account created")
    }
  } catch (error) {
    console.error("Error initializing superadmin:", error)
  }
}
