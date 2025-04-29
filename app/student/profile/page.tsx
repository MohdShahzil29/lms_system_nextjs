"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import Loader from "@/page/Loader";
import PurchaseCourse from "@/page/PurchaseCourse";
const StudentProfile = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = res.data.user;
      setUser(userData);
      setName(userData.name || "");
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchUserDetails();
  }, []);

  if (!isMounted || !user) return <Loader />;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      if (photo) {
        formData.append("photo", photo);
      }

      const token = localStorage.getItem("token");
      const response = await axios.post("/api/auth/updateProfile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Profile updated!");
      setOpen(false);
      window.location.reload();
    } catch (error: any) {
      console.error("Update failed", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-4 space-y-4 border rounded-2xl shadow-md mt-36">
        <div className="flex items-center gap-4">
          {user.photo ? (
            <Image
              src={user.photo}
              alt="Profile"
              width={64}
              height={64}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
              {user.name?.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <PurchaseCourse />
    </>
  );
};

export default StudentProfile;
