"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Button } from "@/components/ui/button";

const ViewAll = () => {
  const [post, setPost] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCourses = post.filter((course) =>
    course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-violet-950 via-indigo-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4 mt-10">Explore All Courses</h1>
          <p className="text-lg mb-8">Find the perfect course for you</p>
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="mt-16 px-4 md:px-10 lg:px-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
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
                    <CardTitle className="text-lg">
                      {course.courseTitle}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    <span className="flex items-center">
                      <i className="fas fa-user-tie mr-2 text-blue-500">
                        Tutor :
                      </i>
                      {course.creator.name}
                    </span>
                  </CardDescription>
                </CardHeader>

                {/* Card Footer */}
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    <i className="fas fa-play mr-2"></i> Continue
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No courses found for "{searchTerm}"</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAll;
