"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PurchaseCourse = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const [buyCourse, setBuyCourse] = useState();
  console.log("Buy Course", buyCourse);
  const fetchUserBuyCourse = async () => {
    try {
      const res = await axios.get(
        `/api/course/getUserBuyCourse?userId=${user.id}`
      );
      setBuyCourse(res.data.purchases);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserBuyCourse();
  }, [user]);

  return (
    <div className="mt-11">
      <h1 className="text-center mt-12 text-3xl">Your Purchase Course</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10 lg:px-24 mt-10">
        {buyCourse?.map((course: any) => (
          <Card
            key={course._id}
            className="overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer"
          >
            {/* Course Image */}
            <div className="h-40 overflow-hidden">
              <img
                src={course.courseId.courseThumbnail}
                alt={course.courseId.courseTitle}
                className="w-full h-full object-cover object-top transition-transform hover:scale-105"
              />
            </div>

            {/* Card Header */}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {course.courseId.courseTitle}
                </CardTitle>
              </div>
            </CardHeader>

            {/* Card Footer */}
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full !rounded-button whitespace-nowrap cursor-pointer"
                onClick={() => router.push(`/details/${course.courseId._id}`)}
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

export default PurchaseCourse;
