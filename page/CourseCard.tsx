"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import axios from "axios";

const CourseCard = () => {
  const [post, setPost] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const handleApiCall = async () => {
      try {
        const res = await axios.get("/api/course/getPublishedCourse");
        if (res.status === 200) {
          setPost(res.data.data);
        } else {
          console.log("Error fetching data from API");
        }
      } catch (error) {
        console.log(error);
      }
    };
    handleApiCall();
  }, []);

  return (
    <div className="mb-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 px-4 md:px-10 lg:px-24 mt-6 gap-4">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button
          variant="outline"
          className="!rounded-button whitespace-nowrap cursor-pointer self-start sm:self-auto"
          onClick={() => router.push("/viewAll")}
        >
          View All <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10 lg:px-24">
        {post.slice(0, 6).map((course) => (
          <Card
            key={course._id}
            className="overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer"
          >
            {/* Course Image */}
            <div className="h-40 overflow-hidden">
              <img
                src={course.courseThumbnail}
                alt={course.courseTitle}
                className="w-full h-full object-cover object-top transition-transform hover:scale-105"
              />
            </div>

            {/* Card Header */}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{course.courseTitle}</CardTitle>
              </div>
              <CardDescription>
                <span className="flex items-center">
                  <i className="fas fa-user-tie mr-2 text-blue-500">Tutor :</i>
                  {course.creator.name}
                </span>
              </CardDescription>
            </CardHeader>

            {/* Card Footer */}
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() => router.push(`/details/${course._id}`)}
              >
                <i className="fas fa-play mr-2"></i> Continue
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseCard;
