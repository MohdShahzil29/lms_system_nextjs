"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ReactPlayer from "react-player";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ProgressPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [lectureList, setLectureList] = useState<any[]>([]);
  const [lectureById, setLectureById] = useState<any>(null);
  const [currentLecture, setCurrentLecture] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [lectureProgress, setLectureProgress] = useState<any[]>([]);

  const { id } = useParams();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;
  const purchases = useSelector((state: RootState) => state.auth.purchases);

  const hasAccess = purchases?.some((purchase) => purchase.courseId === id);

  const fetchCourseProgress = async () => {
    try {
      const res = await axios.get(
        `/api/progess/getCourseProgess?courseId=${id}&userId=${userId}`
      );

      const progressData = res.data;

      // Store the fetched progress data
      setLectureProgress(progressData?.lectureProgress || []);
    } catch (error) {
      console.error("Failed to fetch course progress:", error);
    }
  };

  const fetchLectureList = async () => {
    try {
      const res = await axios.get(`/api/course/getCourseLecture/${id}`);
      const lectures = res.data.courseLecture.lectures;
      setLectureList(lectures);
      setCompleted(new Array(lectures.length).fill(false)); // Initializing the completed array

      if (lectures.length > 0) {
        fetchLectureById(lectures[0]._id);
      }

      // After fetching lectures, fetch progress
      await fetchCourseProgress();
    } catch (error) {
      console.error("Failed to fetch lecture list:", error);
    }
  };

  const fetchLectureById = async (lectureId: string) => {
    try {
      const res = await axios.get(`/api/course/getLectureById/${lectureId}`);
      setLectureById(res.data);
    } catch (error) {
      console.error("Failed to fetch lecture by ID:", error);
    }
  };

  const handleCheckboxChange = async (index: number) => {
    const updated = [...completed];
    const lectureId = lectureList[index]._id;
    updated[index] = !updated[index]; // Toggle completion status
    setCompleted(updated);

    try {
      // Call the PUT API to update the progress
      await axios.put("/api/progess/updateCourseProgess", {
        userId,
        courseId: id,
        lectureId,
        viewed: updated[index], // Pass the updated status
      });
    } catch (error) {
      console.error("Failed to update course progress:", error);
    }
  };

  useEffect(() => {
    fetchLectureList();
  }, [id]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Update the completed state when lectureList and lectureProgress are updated
    if (lectureList.length > 0) {
      const updatedCompleted = lectureList.map((lecture) => {
        const foundLecture = lectureProgress.find(
          (l: any) => l.lectureId === lecture._id
        );
        return foundLecture?.viewed || false;
      });
      setCompleted(updatedCompleted);
    }
  }, [lectureList, lectureProgress]); // Re-run when lectureList or lectureProgress changes

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
    } else if (!hasAccess) {
      router.push("/"); // Or your course details page
    }
  }, [user, hasAccess, router]);

  if (!isMounted) return null;

  const progressPercent =
    (completed.filter(Boolean).length / lectureList.length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-24 space-y-10">
      <h1 className="text-4xl font-bold">📚 Course Progress</h1>

      <div className="space-y-2">
        <Progress value={progressPercent} />
        <p className="text-muted-foreground">{progressPercent}% completed</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lecture List */}
        <Card className="lg:col-span-1 p-6 space-y-4">
          <h2 className="text-2xl font-semibold mb-2">Lectures</h2>
          <div className="space-y-3">
            {lectureList.map((lecture, index) => (
              <div
                key={lecture._id}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition hover:bg-muted ${
                  currentLecture === index ? "bg-muted" : ""
                }`}
                onClick={() => {
                  setCurrentLecture(index);
                  fetchLectureById(lecture._id);
                }}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={completed[index]}
                    onCheckedChange={() => handleCheckboxChange(index)}
                  />
                  <span className="font-medium">{lecture.lectureTitle}</span>
                </div>
                <Video className="w-5 h-5 text-primary" />
              </div>
            ))}
          </div>
        </Card>

        {/* Video Player */}
        <Card className="lg:col-span-2 overflow-hidden p-6">
          <h2 className="text-2xl font-semibold mb-4">Now Watching</h2>
          <div className="aspect-video rounded-xl overflow-hidden">
            {lectureById && (
              <ReactPlayer
                url={lectureById.videUrl}
                controls
                width="100%"
                height="100%"
                className="rounded-xl"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
