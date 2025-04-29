"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus } from "lucide-react";
import Loader from "@/page/Loader";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [courses, setCourses] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const fetchUserCourse = async () => {
    try {
      const res = await axios.get("/api/course/getCreatorCourse", {
        params: { creatorId: user?.id },
      });
      if (res.data.success) {
        setCourses(res.data.data);
      } else {
        console.error("Failed to fetch courses:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (user) fetchUserCourse();
    setIsMounted(true);
  }, [user]);

  const handleEditChange = (field: string, value: string | number) => {
    setSelectedCourse((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
        handleEditChange("courseThumbnail", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "/api/course/editCourse",
        {
          courseId: selectedCourse._id,
          courseTitle: selectedCourse.courseTitle,
          description: selectedCourse.description,
          category: selectedCourse.category,
          coursePrice: selectedCourse.coursePrice,
          courseThumbnail: selectedCourse.courseThumbnail,
          studentLearning: selectedCourse.studentLearning,
          courseLanguage: selectedCourse.courseLanguage,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.id}`,
          },
        }
      );

      if (res.status === 200) {
        alert("Course updated successfully");
        fetchUserCourse();
        setEditOpen(false);
        setThumbnailPreview(null);
        setThumbnailFile(null);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (!user || !isMounted) {
    return <Loader />;
  }

  return (
    <div className="mt-36 px-6 mb-36">
      <h1 className="text-2xl font-semibold mb-6">Your Courses</h1>
      <div className="space-y-4">
        {courses.map((course: any) => (
          <div
            key={course._id}
            className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
          >
            <span className="font-medium">{course.courseTitle}</span>
            <div className="space-x-2">
              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedCourse(course);
                      setThumbnailPreview(course.courseThumbnail);
                      setEditOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Course</DialogTitle>
                  </DialogHeader>
                  {selectedCourse && (
                    <form className="space-y-3" onSubmit={handleEditSubmit}>
                      <Input
                        placeholder="Course Title"
                        value={selectedCourse.courseTitle}
                        onChange={(e) =>
                          handleEditChange("courseTitle", e.target.value)
                        }
                      />
                      <Textarea
                        placeholder="Description"
                        value={selectedCourse.description}
                        onChange={(e) =>
                          handleEditChange("description", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Category"
                        value={selectedCourse.category}
                        onChange={(e) =>
                          handleEditChange("category", e.target.value)
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={selectedCourse.coursePrice}
                        onChange={(e) =>
                          handleEditChange(
                            "coursePrice",
                            Number(e.target.value)
                          )
                        }
                      />
                      <div>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                        />
                        {thumbnailPreview && (
                          <img
                            src={thumbnailPreview}
                            alt="Thumbnail Preview"
                            className="w-full h-40 object-cover mt-2 rounded-md"
                          />
                        )}
                      </div>
                      <Textarea
                        placeholder="What students will learn"
                        value={selectedCourse.studentLearning}
                        onChange={(e) =>
                          handleEditChange("studentLearning", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Course Language"
                        value={selectedCourse.courseLanguage}
                        onChange={(e) =>
                          handleEditChange("courseLanguage", e.target.value)
                        }
                      />
                      <Button type="submit" className="w-full cursor-pointer">
                        Save Changes
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  router.push(`/instructor/addLecture?courseId=${course._id}`)
                }
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lecture
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
