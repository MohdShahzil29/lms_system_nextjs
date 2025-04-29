"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/page/Loader";
import { toast } from "sonner";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AddLecture = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("courseId");

  const [courseTitle, setCourseTitle] = useState("");
  const [lectureTitle, setLectureTitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLecture, setEditLecture] = useState<any>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedPreview, setEditedPreview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`/api/course/getCourseById/${id}`);
        if (res.status === 200) {
          setCourseTitle(res.data.courseTitle);
          setCourseId(res.data._id);
          await fetchLectures(res.data._id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourseDetails();
  }, [id]);

  const fetchLectures = async (realCourseId: string) => {
    try {
      const res = await axios.get(
        `/api/course/getCourseLecture/${realCourseId}`
      );
      if (res.status === 200) {
        setLectures(res.data.courseLecture.lectures);
      }
    } catch (error) {
      console.error("Failed to fetch lectures", error);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setVideoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setVideoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lectureTitle || !videoFile || !courseId) {
      return alert("All fields are required!");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("courseId", courseId);
      formData.append("lectureTitle", lectureTitle);
      formData.append("isPreviewFree", String(isPreviewFree));

      const res = await axios.post("/api/course/createLecture", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Lecture added successfully!");
        setLectureTitle("");
        setVideoFile(null);
        setVideoPreview(null);
        setIsPreviewFree(false);
        await fetchLectures(courseId);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add lecture");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLecture = async () => {
    if (!editLecture) return;

    try {
      const formData = new FormData();
      formData.append("lectureId", editLecture._id);
      formData.append("lectureTitle", editedTitle);
      formData.append("isPreviewFree", String(editedPreview));
      if (videoFile) {
        formData.append("video", videoFile);
      }

      const res = await axios.put("/api/course/editLecture", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        toast.success("Lecture updated successfully!");
        setIsEditModalOpen(false);
        setEditLecture(null);
        setVideoFile(null);
        setVideoPreview(null);
        await fetchLectures(courseId!);
      }
    } catch (error) {
      toast.error("Failed to update lecture");
      console.error(error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl mx-auto mt-36 p-6 border shadow-lg rounded-2xl">
      <h2 className="text-2xl font-semibold mb-4">
        Add Lecture to: <span className="text-blue-600">{courseTitle}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Lecture Title"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
        />

        <div>
          <Label htmlFor="video">Video Upload</Label>
          <Input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
          />
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="w-full mt-2 rounded-md"
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="preview"
            checked={isPreviewFree}
            onCheckedChange={setIsPreviewFree}
          />
          <Label htmlFor="preview">Free Preview</Label>
        </div>

        <Button type="submit" className="w-full">
          Add Lecture
        </Button>
      </form>

      {lectures.length > 0 && (
        <div className="mt-10 space-y-4">
          <h3 className="text-xl font-semibold">Lectures</h3>
          {lectures.map((lecture: any) => (
            <div
              key={lecture._id}
              className="border p-4 rounded-xl shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <h4 className="font-medium">{lecture.lectureTitle}</h4>
                {lecture.isPreviewFree && (
                  <span className="text-sm text-green-600">Free Preview</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditLecture(lecture);
                    setEditedTitle(lecture.lectureTitle);
                    setEditedPreview(lecture.isPreviewFree);
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lecture</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Lecture Title"
            />

            <div className="flex items-center gap-2">
              <Switch
                id="editPreview"
                checked={editedPreview}
                onCheckedChange={setEditedPreview}
              />
              <Label htmlFor="editPreview">Free Preview</Label>
            </div>

            {/* Current Video */}
            {editLecture?.videUrl && (
              <div>
                <Label>Current Video</Label>
                <video
                  src={editLecture.videUrl}
                  controls
                  className="w-full mt-2 rounded-md"
                />
              </div>
            )}

            {/* Upload New Video */}
            <div>
              <Label htmlFor="editVideo">Upload New Video</Label>
              <Input
                id="editVideo"
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setVideoFile(file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () =>
                      setVideoPreview(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="w-full mt-2 rounded-md"
                />
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button onClick={handleEditLecture}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddLecture;
