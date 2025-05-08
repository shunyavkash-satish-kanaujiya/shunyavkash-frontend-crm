import { useEffect, useState } from "react";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

export const PasswordValidator = ({ password }) => {
  const [validations, setValidations] = useState({
    minLength: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const [strength, setStrength] = useState("Weak");

  useEffect(() => {
    const newValidations = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setValidations(newValidations);

    const score = Object.values(newValidations).filter(Boolean).length;
    if (score <= 1) setStrength("Weak");
    else if (score === 2 || score === 3) setStrength("Medium");
    else if (score === 4) setStrength("Strong");
  }, [password]);

  const renderValidation = (isValid, text) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <CheckCircleIcon className="w-4 h-4 text-green-600" />
      ) : (
        <MinusCircleIcon className="w-4 h-4 text-gray-400" />
      )}
      <span className={isValid ? "text-green-600" : "text-gray-600"}>
        {text}
      </span>
    </div>
  );

  const getStrengthColor = () => {
    if (strength === "Weak") return "bg-red-500";
    if (strength === "Medium") return "bg-yellow-500";
    if (strength === "Strong") return "bg-green-500";
  };

  return (
    <motion.div
      className="mt-4 p-4 rounded-md bg-gray-50 border space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Password Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">
            Password Strength
          </span>
          <span
            className={`text-sm font-bold ${
              strength === "Weak"
                ? "text-red-500"
                : strength === "Medium"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {strength}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className={`h-2 rounded-full ${getStrengthColor()}`}
            style={{
              width:
                strength === "Weak"
                  ? "33%"
                  : strength === "Medium"
                  ? "66%"
                  : "100%",
            }}
          />
        </div>
      </div>

      {/* Password Rules - Animate on presence */}
      <AnimatePresence>
        {password.length > 0 && (
          <>
            {renderValidation(validations.minLength, "Minimum 8 characters")}
            {renderValidation(
              validations.hasUppercase,
              "At least one uppercase letter"
            )}
            {renderValidation(validations.hasNumber, "At least one number")}
            {renderValidation(
              validations.hasSpecialChar,
              "At least one special character"
            )}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
