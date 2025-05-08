import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { PasswordValidator } from "../components/ui/PasswordValidator.jsx";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { isPasswordValid } from "../utils/isPasswordValid.js";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const { resetPassword, loading, error, message, clearMessages } =
    useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      toast.error("Password does not meet the validation criteria.");
      return;
    }

    clearMessages();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    await resetPassword(token, password);

    const { error, message } = useAuthStore.getState();

    if (error) {
      toast.error(error);
    } else if (message) {
      toast.success(message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      toast.error("Something went wrong. Please try again.");
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
                  htmlFor="password"
                  className="block font-medium text-gray-900 text-sm/6"
                >
                  New Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={passwordVisible ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {passwordVisible ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {/* Password Validator */}
                {password.length > 0 && (
                  <PasswordValidator password={password} />
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block font-medium text-gray-900 text-sm/6"
                >
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={confirmPasswordVisible ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                    className="absolute right-3 top-2.5 text-gray-500"
                  >
                    {confirmPasswordVisible ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {(localError || error || message) && (
                <div className="mt-2">
                  {localError && (
                    <p className="text-red-600 text-sm">{localError}</p>
                  )}
                  {error && <p className="text-red-600 text-sm">{error}</p>}
                  {message && (
                    <p className="text-green-600 text-sm">{message}</p>
                  )}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer transition flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm/6 font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
