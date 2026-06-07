// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// Username validation (should start with a letter, not a number)
export function isValidUsername(username: string): boolean {
  // Check if username starts with a letter (not a number or special character)
  const startsWithLetterRegex = /^[a-zA-Z]/
  return username.length > 0 && startsWithLetterRegex.test(username)
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  strength: "weak" | "medium" | "strong"
  message: string
} {
  // Initialize score
  let score = 0

  // Check length
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) score += 1

  // Check for lowercase letters
  if (/[a-z]/.test(password)) score += 1

  // Check for numbers
  if (/\d/.test(password)) score += 1

  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  // Determine strength based on score
  if (score <= 2) {
    return {
      strength: "weak",
      message: "Weak: Add uppercase, numbers, and special characters",
    }
  } else if (score <= 4) {
    return {
      strength: "medium",
      message: "Medium: Good, but could be stronger",
    }
  } else {
    return {
      strength: "strong",
      message: "Strong: Excellent password!",
    }
  }
}

// Check if passwords match
export function doPasswordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword
}

// Check if user is superadmin
export function isSuperAdmin(email: string): boolean {
  return email === "admin@mindjournal.com"
}
