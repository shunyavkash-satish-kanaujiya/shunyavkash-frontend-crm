// pages/ForgotPassword.jsx
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { forgotPassword, loading, clearMessages } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearMessages();
    await forgotPassword(email);

    const { error, message } = useAuthStore.getState();

    if (error) {
      toast.error(error);
    } else if (message) {
      toast.success(message);
    } else {
      toast.error("Something went wrong. Please try again."); // fallback
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="card w-5/12 h-min bg-surface mx-auto">
        <div className="flex flex-col justify-center flex-1 w-full min-h-full px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Shunyavkash"
              src="/images/shunyavkash-logo.svg"
              className="w-auto h-10 mx-auto"
            />
          </div>

          <div className="m-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-900 text-sm/6"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                    placeholder="Enter your registered email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer transition flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link
                  to="/"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
