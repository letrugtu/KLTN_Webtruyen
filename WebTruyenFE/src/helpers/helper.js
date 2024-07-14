export function getEmailPrefix(email) {
    // Find the index of '@' symbol
    var atIndex = email.indexOf('@');
    
    // If '@' symbol is found, extract the substring before it
    if (atIndex !== -1) {
        return email.substring(0, atIndex);
    }
    
    // If '@' symbol is not found, return the original email
    return email;
}

export function checkPasswordLength(password) {
    // Check if the length of the password is greater than 8
    return password?.length >= 6;
}

export function validateEmail(email) {
    // Regular expression pattern for email validation
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email against the pattern
    return emailPattern.test(email);
}

export function formatDateString(isoDateString) {
    // Parse the ISO 8601 date string into a Date object
    const date = new Date(isoDateString);
  
    // Extract the day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    // Format the date as "dd/mm/yyyy"
    return `${day}/${month}/${year}`;
  }