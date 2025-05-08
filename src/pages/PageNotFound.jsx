import React, { useEffect, useState } from "react";
import {
  ExclamationTriangleIcon,
  UserGroupIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { TABS } from "../constants/activeTab";
import { useNavigate } from "react-router-dom";

const backgroundDotsCount = 30;

const PageNotFound = ({ setActiveTab }) => {
  const [dotPositions, setDotPositions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const positions = Array.from({ length: backgroundDotsCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      scale: 0.5 + Math.random() * 3,
      size: 6 + Math.random() * 10, // Size between 6px - 14px
    }));
    setDotPositions(positions);
  }, []);

  const handleReturnToDashboard = () => {
    console.log("Button clicked");
    if (setActiveTab) {
      // If rendered within Dashboard, use setActiveTab
      console.log("Using setActiveTab");
      setActiveTab(TABS.DASHBOARD);
    } else {
      // If standalone, navigate to dashboard route
      console.log("Using navigate"); 
      navigate("/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-indigo-100 p-6">
      {/* Dots Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {dotPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-950 opacity-100 blur-sm"
            style={{
              width: `${pos.size}px`,
              height: `${pos.size}px`,
            }}
            initial={{
              x: pos.x,
              y: pos.y,
              scale: pos.scale,
              opacity: 0,
            }}
            animate={{
              x: [pos.x, pos.x + (Math.random() * 100 - 50)],
              y: [pos.y, pos.y + (Math.random() * 100 - 50)],
              opacity: [0.5, 0.3, 0.5],
              scale: [pos.scale, pos.scale * 1.2, pos.scale],
            }}
            transition={{
              duration: 1 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center z-10 relative"
      >
        <div className="text-[8rem] font-extrabold text-indigo-700 tracking-tight drop-shadow-md">
          404
        </div>
        <p className="text-2xl font-semibold text-gray-700 mt-4">
          Uh-oh! You took a wrong turn inside the CRM.
        </p>
        <p className="text-md text-gray-500 mt-2 mb-8">
          Let's get you back on track to what matters most.
        </p>

        {/* Button with direct click handler */}
        <button
          onClick={handleReturnToDashboard}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full shadow-md transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>
      </motion.div>

      {/* Floating Icons */}
      <motion.div
        className="flex gap-12 mt-24 text-indigo-400 z-10 relative"
        initial={{ y: 0 }}
        animate={{ y: [0, 15, 0] }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 6,
          ease: "easeInOut",
        }}
      >
        <UserGroupIcon className="w-16 h-16 opacity-70" />
        <BriefcaseIcon className="w-16 h-16 opacity-70" />
        <ExclamationTriangleIcon className="w-16 h-16 opacity-70" />
      </motion.div>
    </div>
  );
};

export default PageNotFound;
