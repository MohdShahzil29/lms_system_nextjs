"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Feedback = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [feadBackDescription, setFeadBackDescription] = useState("");
  const [role, setRole] = useState("");

  // Fetch user details
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
    fetchUserDetails();
  }, []);

  // Handle feedback submission
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.post(
        "/api/feadback/create",
        {
          userId: user?._id,
          feadBackDescription,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Feedback submitted successfully!");
        setFeadBackDescription("");
        setRole("");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("There was an error submitting your feedback.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-[11.5rem] mb-36">
      <h2 className="text-2xl font-semibold mb-4">Submit Feedback</h2>

      {/* Feedback Form */}
      <div className="space-y-4 mt-9">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Name"
          placeholder="Your name"
          disabled
        />

        <Textarea
          value={feadBackDescription}
          onChange={(e) => setFeadBackDescription(e.target.value)}
          label="Feedback Description"
          placeholder="Describe your feedback"
          rows={4}
        />
        <Input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          label="Your Role"
          placeholder="Your role in the organization"
        />
      </div>

      <div className="mt-4">
        <Button onClick={handleSubmit} className="w-full">
          Submit Feedback
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
