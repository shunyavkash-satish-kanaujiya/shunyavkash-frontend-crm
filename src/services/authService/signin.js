export const registerUser = async (email, password) => {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const { message } = await response.json();
    throw new Error(message || "Failed to register");
  }

  const data = await response.json();
  return data.user || data; // adjust based on API response structure
};
