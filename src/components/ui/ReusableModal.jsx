import React, { useEffect, useState } from "react";

export const ReusableModal = ({ isOpen, onClose, children }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowModal(true), 200);
      // setShowModal(true);
    } else {
      // Add small delay to allow closing animation
      setTimeout(() => setShowModal(false), 200);
    }
  }, [isOpen]);

  if (!isOpen && !showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-5/12 p-8 relative transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-90"
        }`}
      >
        <button
          className="absolute top-2 right-4 text-gray-400 hover:text-red-600"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};
