"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const HeroBanner = () => {
  return (
    <section className="relative w-full h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-gray-900 text-white flex items-center justify-center overflow-hidden px-4">
      {/* Decorative Blurred Background Element */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-600 opacity-30 rounded-full blur-[150px] z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-500 opacity-30 rounded-full blur-[150px] z-0" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl text-center space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Empower Your Learning
          <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ml-2">
            LMS
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Interactive, intuitive, and intelligent — your all-in-one solution to
          master new skills and track progress like never before.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 cursor-pointer"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Explore Courses
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-gray-400 text-white bg-blue-800 hover:bg-gray-800 hover:text-white cursor-pointer"
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;
