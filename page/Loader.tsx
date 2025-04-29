"use client";
import { motion } from "framer-motion";

export default function EducationLoader() {
  return (
    <>
      <style>
        {`
          @keyframes flipBook {
            0%, 100% { transform: rotateY(0deg); }
            50% { transform: rotateY(180deg); }
          }

          @keyframes flipBookReverse {
            0%, 100% { transform: rotateY(180deg); }
            50% { transform: rotateY(0deg); }
          }

          .animate-flipBook {
            animation: flipBook 2s ease-in-out infinite;
          }

          .animate-flipBookReverse {
            animation: flipBookReverse 2s ease-in-out infinite;
          }
        `}
      </style>

      <div className="flex items-center justify-center h-screen bg-white">
        <motion.div
          className="relative w-24 h-24"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        >
          <div className="absolute inset-0 bg-blue-600 rounded-lg shadow-lg animate-pulse" />
          <div className="absolute inset-1 bg-white rounded-lg border-4 border-yellow-400 rotate-12 animate-flipBook" />
          <div className="absolute inset-2 bg-blue-100 rounded-lg border-2 border-blue-300 -rotate-12 animate-flipBookReverse" />
        </motion.div>
      </div>
    </>
  );
}
