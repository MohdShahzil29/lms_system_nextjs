"use client";
import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const CreateCourse = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    coursePrice: "",
    courseThumbnail: "",
    courseLanguage: "English",
    studentLearning: "",
  });

  const [preview, setPreview] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          courseThumbnail: reader.result as string,
        }));
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/api/course/create",
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        }
      );
      toast.success("Course created successfully");
      console.log(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-4 border rounded-2xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold">Create New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Course Title</Label>
          <Input
            name="courseTitle"
            value={formData.courseTitle}
            onChange={handleChange}
            placeholder="e.g. React for Beginners"
          />
        </div>

        <div>
          <Label>Subtitle</Label>
          <Input
            name="subTitle"
            value={formData.subTitle}
            onChange={handleChange}
            placeholder="e.g. Learn React from scratch with projects"
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a brief course description"
          />
        </div>

        <div>
          <Label>Category</Label>
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Web Development"
          />
        </div>

        <div>
          <Label>Price ($)</Label>
          <Input
            name="coursePrice"
            type="number"
            value={formData.coursePrice}
            onChange={handleChange}
            placeholder="e.g. 49.99"
          />
        </div>

        <div>
          <Label>What will students learn?</Label>
          <Textarea
            name="studentLearning"
            value={formData.studentLearning}
            onChange={handleChange}
            placeholder="Describe what the students will learn from this course"
          />
        </div>

        <div>
          <Label>Course Language</Label>
          <select
            name="courseLanguage"
            value={formData.courseLanguage}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
            <option value="Urdu">Urdu</option>
          </select>
        </div>

        {/* <div>
          <Label>Course Duration</Label>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                name="durationWeeks"
                type="number"
                min="0"
                value={formData.durationWeeks}
                onChange={handleChange}
                placeholder="Weeks"
              />
            </div>
            <div className="flex-1">
              <Input
                name="durationDays"
                type="number"
                min="0"
                max="6"
                value={formData.durationDays}
                onChange={handleChange}
                placeholder="Days"
              />
            </div>
          </div>
        </div> */}

        <div>
          <Label>Thumbnail</Label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <ImagePlus className="w-5 h-5" />
              <span>Upload Image</span>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Thumbnail preview"
                className="w-20 h-20 rounded object-cover border"
              />
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Course
        </Button>
      </form>
    </div>
  );
};

export default CreateCourse;
