"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const CourseLecture = () => {
  const [lectures, setLectures] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  useEffect(() => {
    if (!courseId) return;
    axios
      .get(`/api/course/getCourseLectures/${courseId}`)
      .then((res) => {
        console.log(res.data);
        if (res.status === 200) {
          setLectures(res.data.lectures);
        }
      })
      .catch(console.error);
  }, [courseId]);

  const handleEdit = (lectureId: string) => {
    router.push(`/editLecture/${lectureId}`);
  };

  const handleDelete = async (lectureId: string) => {
    try {
      const res = await axios.delete(`/api/course/deleteLecture/${lectureId}`);
      if (res.status === 200) {
        setLectures(lectures.filter((lec: any) => lec.id !== lectureId));
        alert("Lecture deleted successfully!");
      }
    } catch (err) {
      console.error("Failed to delete lecture", err);
      alert("Failed to delete lecture");
    }
  };

  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Lecture Title</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lecture: any) => (
            <tr key={lecture.id}>
              <td className="border p-2">{lecture.title}</td>
              <td className="border p-2 flex gap-2">
                <Button onClick={() => handleEdit(lecture.id)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(lecture.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseLecture;
