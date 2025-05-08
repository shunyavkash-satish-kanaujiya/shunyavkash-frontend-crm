import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { PasswordValidator } from "../components/ui/PasswordValidator.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"; // For show/hide password

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for show/hide password
  const { register, loading, error } = useAuthStore();
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await register(email, password);

      const currentError = useAuthStore.getState().error;
      const currentToken = useAuthStore.getState().token;

      if (currentError) {
        toast.error(currentError);
      } else if (currentToken) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Handle Submit Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="card w-5/12 h-min bg-surface mx-auto">
        <div className="flex flex-col justify-center flex-1 w-full min-h-full px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Shaunyavkash"
              src="/images/shunyavkash-logo.svg"
              className="w-auto h-10 mx-auto"
            />
          </div>

          <div className="m-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                {/* Email */}
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
                  />
                </div>
              </div>

              <div>
                {/* Password */}
                <label
                  htmlFor="password"
                  className="block font-medium text-gray-900 text-sm/6"
                >
                  Password
                </label>
                <div className="mt-2 flex items-center gap-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-emerald-600 sm:text-sm/6"
                  />
                  {/* Password Show/Hide Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Validator */}
                {password.length > 0 && (
                  <PasswordValidator password={password} />
                )}

                {error && <p className="text-sm text-red-500">{error}</p>}

                {/* Forgot password link */}
                <div className="text-right mt-1">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="cursor-pointer transition flex w-full justify-center rounded-md bg-emerald-500 px-3 py-2 text-md/6 font-semibold text-white shadow-xs hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 duration-200 ease-in-out"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
