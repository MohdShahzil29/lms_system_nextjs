"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/authSlice";
import Cookies from "js-cookie";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toggleAuthMode = () => setIsLogin(!isLogin);
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await axios.post("/api/auth/signin", {
          email: formData.email,
          password: formData.password,
        });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        // Set token and user in Redux store
        dispatch(setToken(token));
        dispatch(setUser(user));
        // Set token and user in cookies
        Cookies.set("token", token, { expires: 7 });
        Cookies.set("user", JSON.stringify(user), { expires: 7 });
        toast.success("Logged in successfully 🎉");
        router.push("/");
        // console.log("Login successful:", res.data);
      } else {
        const res = await axios.post("/api/auth/signup", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Registered successfully 🎉");
        // console.log("Registration successful:", res.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong ❌");
      console.error("Auth error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-900 to-gray-900 text-white">
      <Card className="w-full max-w-md p-6 bg-black/30 backdrop-blur-md border border-white/10 shadow-lg text-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            {isLogin ? "Log In" : "Sign Up"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <Input
                  name="name"
                  onChange={handleChange}
                  value={formData.name}
                  className="bg-white/10 border-white/20 text-white placeholder-white/60"
                  type="text"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <Input
                name="email"
                onChange={handleChange}
                value={formData.email}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <Input
                name="password"
                onChange={handleChange}
                value={formData.password}
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button
              className="w-full mt-2 bg-indigo-700 hover:bg-indigo-600 text-white"
              type="submit"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>
          <p className="text-center text-sm mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-indigo-400 hover:underline"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
