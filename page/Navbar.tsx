"use client";
import React, { useEffect, useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  // console.log("User image", user?.photo);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-white shadow-md text-gray-900"
            : "bg-transparent text-blue-600 backdrop-blur-sm"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-6 w-6" />
            <span>LMS</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="/" className="hover:text-purple-500 transition">
              Home
            </a>
            {user?.role === "instructor" ? (
              <a
                href="/instructor/createCourse"
                className="hover:text-purple-500 transition"
              >
                Create Course
              </a>
            ) : (
              <a href="#" className="hover:text-purple-500 transition">
                Feadback
              </a>
            )}
            {user?.role === "instructor" ? (
              <a
                href="/instructor/totalOrder"
                className="hover:text-purple-500 transition"
              >
                Course Order
              </a>
            ) : (
              <a href="#" className="hover:text-purple-500 transition">
                About
              </a>
            )}

            <a href="#" className="hover:text-purple-500 transition">
              Contact
            </a>
          </div>

          {/* Desktop Actions */}
          {user ? (
            user?.role === "instructor" ? (
              <div className="hidden md:flex gap-2 ">
                <Button
                  variant={scrolled ? "outline" : "secondary"}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => router.push("/instructor/dashboard")}
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex gap-2 ">
                <Button
                  variant={scrolled ? "outline" : "secondary"}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => router.push("/student/profile")}
                >
                  Profile
                </Button>
                <Button
                  variant={scrolled ? "outline" : "secondary"}
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => dispatch(logout())}
                >
                  Logout
                </Button>
              </div>
            )
          ) : (
            <div className="hidden md:flex gap-2 ">
              <Button
                variant={scrolled ? "outline" : "secondary"}
                size="sm"
                className="cursor-pointer"
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            {menuOpen ? (
              <X
                className="h-6 w-6 cursor-pointer"
                onClick={() => setMenuOpen(false)}
              />
            ) : (
              <Menu
                className="h-6 w-6 cursor-pointer"
                onClick={() => setMenuOpen(true)}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div
          className={clsx(
            "md:hidden fixed top-16 left-0 w-full z-40 px-6 py-4 bg-white text-gray-900 shadow-md space-y-4 transition-all duration-300",
            scrolled ? "pt-6" : "pt-6"
          )}
        >
          <a
            href="#"
            className="block text-base font-medium hover:text-purple-600 transition"
          >
            Home
          </a>
          <a
            href="#"
            className="block text-base font-medium hover:text-purple-600 transition"
          >
            Courses
          </a>
          <a
            href="#"
            className="block text-base font-medium hover:text-purple-600 transition"
          >
            About
          </a>
          <a
            href="#"
            className="block text-base font-medium hover:text-purple-600 transition"
          >
            Contact
          </a>

          <div className="pt-4 flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/auth")}
            >
              Login
            </Button>
            {/* <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              Signup
            </Button> */}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
