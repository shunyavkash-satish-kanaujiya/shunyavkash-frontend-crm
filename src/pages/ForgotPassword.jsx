// pages/ForgotPassword.jsx
import { useState } from "react";
import { useAuthStore } from "../store/authStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const {
    forgotPassword,
    message,
    error,
    loading,
    clearMessages,
  } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    await forgotPassword(email);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          className="w-full border p-2 rounded"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
