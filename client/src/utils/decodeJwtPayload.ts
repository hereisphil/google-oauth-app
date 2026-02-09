export const decodeJWTPayload = (token: string) => {
        
    const parts = token.split(".");
  
    const payload = parts[1];
  
    if (!payload) {
      throw new Error("JWT payload missing");
    }
  
    // Convert JWT's base64 to Base64URL for use by atob
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, "=");
  
    try {
      const decoded = atob(padded);
      return JSON.parse(decoded); // Return a json object of user data
    } catch (err) {
      throw new Error("Failed to decode JWT payload", { cause: err });
    }
  };