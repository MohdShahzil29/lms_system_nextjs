"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarDays, Clock, BookOpen, User, Star } from "lucide-react";
import Image from "next/image";
import CourseImage from "@/assets/2.jpg";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Loader from "@/page/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CourseDetailsPage() {
  // const [tab, setTab] = useState("week1");
  const { id } = useParams();
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const user = useSelector((state: RootState) => state.auth.user);
  const purchases = useSelector((state: RootState) => state.auth.purchases);

  const router = useRouter();
  // console.log(course);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/course/getCourseById/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch course details");
      }
      const data = await res.json();
      setCourse(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mt-20">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-b-3xl overflow-hidden">
        {course.courseThumbnail ? (
          <Image
            src={course.courseThumbnail}
            alt="Course banner"
            layout="fill"
            objectFit="cover"
            className="brightness-75"
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            {/* Fallback content or image */}
            <span className="text-white">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-10 text-white bg-gradient-to-t from-black/70 to-transparent">
          <motion.h1
            className="text-5xl font-bold"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Introduction to Web Development */}
            {course?.courseTitle}
          </motion.h1>
          <motion.p
            className="text-lg mt-2"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Build websites from scratch using HTML, CSS, and JavaScript. */}
            {course?.subTitle}
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-6 py-12">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Course Description */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-4">About This Course</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {/* This hands-on course teaches you the basics of HTML, CSS, and
              JavaScript through real projects and challenges. You'll go from
              zero to hero with the core skills needed to build modern websites. */}
              {course.description}
            </p>
          </motion.section>

          {/* What You'll Learn */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-semibold mb-4">What You'll Learn</h2>
            <ul className="space-y-3 text-muted-foreground text-lg">
              {course.studentLearning &&
                course.studentLearning
                  .split(",")
                  .map((item, index) => <li key={index}>✅ {item.trim()}</li>)}
            </ul>
          </motion.section>

          {/* Tabbed Syllabus */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          ></motion.section>
        </div>

        {/* Right Column - Sticky Info Card */}
        <div className="space-y-6 sticky top-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-6 space-y-4 shadow-xl border-2 border-primary">
              <h3 className="text-xl font-semibold mb-2">Course Info</h3>
              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <User className="text-primary" />
                  <span>Instructor: {course?.creator?.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-primary" />
                  <span>Total Lecture: {course.lectures?.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-primary" />
                  <span>Category: {course.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <BookOpen className="text-primary" />
                  <span>Language: {course.courseLanguage}</span>
                </div>
              </div>
              {user ? (
                <>
                  <Button
                    className="w-full mt-4 text-lg py-6 cursor-pointer"
                    onClick={async () => {
                      if (!user?.id) {
                        return toast.error(
                          "You need to be logged in to enroll."
                        );
                      }

                      try {
                        const res = await axios.post(
                          "/api/stripe/checkout-session",
                          {
                            userId: user.id,
                            courseId: course?._id,
                          }
                        );

                        if (res.data.url) {
                          window.location.href = res.data.url;
                        } else {
                          toast.error("Unable to initiate payment session.");
                        }
                      } catch (err) {
                        console.error("Payment error:", err);
                        toast.error(
                          "Something went wrong while processing payment."
                        );
                      }
                    }}
                  >
                    🚀 Enroll Now
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className="w-full mt-4 text-lg py-6 cursor-pointer"
                    onClick={() => router.push("/auth")}
                  >
                    Login Now
                  </Button>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
