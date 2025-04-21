import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const courses = [
  {
    id: 1,
    title: "Advanced JavaScript",
    instructor: "Dr. Sarah Johnson",
    progress: 75,
    image:
      "https://readdy.ai/api/search-image?query=Modern%20JavaScript%20programming%20concept%20with%20code%20on%20screen%2C%20digital%20interface%20with%20programming%20symbols%2C%20clean%20minimalist%20design%2C%20blue%20gradient%20background%2C%20professional%20tech%20atmosphere%2C%20high%20resolution&width=400&height=250&seq=1&orientation=landscape",
  },
  {
    id: 2,
    title: "UX Design Principles",
    instructor: "Prof. Michael Chen",
    progress: 45,
    image:
      "https://readdy.ai/api/search-image?query=UX%20design%20workspace%20with%20wireframes%20and%20prototypes%2C%20digital%20interface%20mockups%20on%20screen%2C%20clean%20minimalist%20design%2C%20blue%20gradient%20background%2C%20professional%20creative%20atmosphere%2C%20high%20resolution&width=400&height=250&seq=2&orientation=landscape",
  },
  {
    id: 3,
    title: "Data Science Basics",
    instructor: "Dr. Emily Rodriguez",
    progress: 30,
    image:
      "https://readdy.ai/api/search-image?query=Data%20visualization%20and%20analytics%20dashboard%2C%20colorful%20charts%20and%20graphs%2C%20digital%20interface%20with%20data%20points%2C%20clean%20minimalist%20design%2C%20blue%20gradient%20background%2C%20professional%20tech%20atmosphere%2C%20high%20resolution&width=400&height=250&seq=3&orientation=landscape",
  },
  {
    id: 4,
    title: "Mobile App Development",
    instructor: "Prof. James Wilson",
    progress: 60,
    image:
      "https://readdy.ai/api/search-image?query=Mobile%20app%20development%20concept%20with%20smartphone%20mockups%2C%20code%20interface%20and%20UI%20elements%2C%20clean%20minimalist%20design%2C%20blue%20gradient%20background%2C%20professional%20tech%20atmosphere%2C%20high%20resolution&width=400&height=250&seq=4&orientation=landscape",
  },
  {
    id: 5,
    title: "Artificial Intelligence",
    instructor: "Dr. Lisa Zhang",
    progress: 15,
    image:
      "https://readdy.ai/api/search-image?query=Artificial%20intelligence%20concept%20with%20neural%20network%20visualization%2C%20digital%20brain%20interface%2C%20clean%20minimalist%20design%2C%20blue%20gradient%20background%2C%20professional%20tech%20atmosphere%2C%20high%20resolution&width=400&height=250&seq=5&orientation=landscape",
  },
  {
    id: 6,
    title: "Blockchain Fundamentals",
    instructor: "Prof. Robert Taylor",
    progress: 5,
    image:
      "https://readdy.ai/api/search-image?query=Blockchain%20technology%20concept%20with%20connected%20blocks%20visualization%2C%20digital%20secure%20interface%2C%20clean%20minimalist%20design%2C%20blue%20gradient%20background%2C%20professional%20tech%20atmosphere%2C%20high%20resolution&width=400&height=250&seq=6&orientation=landscape",
  },
];

const CourseCard = () => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6 px-24 mt-6">
        <h2 className="text-2xl font-bold">My Courses</h2>
        <Button
          variant="outline"
          className="!rounded-button whitespace-nowrap cursor-pointer"
        >
          View All <i className="fas fa-arrow-right ml-2"></i>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-28">
        {courses.map((course) => (
          <Card
            key={course.id}
            className={`overflow-hidden hover:shadow-lg transition-shadow "bg-white" cursor-pointer`}
          >
            <div className="h-40 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover object-top transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <Badge
                  variant={
                    course.progress > 70
                      ? "success"
                      : course.progress > 30
                      ? "warning"
                      : "default"
                  }
                >
                  {course.progress}%
                </Badge>
              </div>
              <CardDescription>
                <span className="flex items-center">
                  <i className="fas fa-user-tie mr-2 text-blue-500"></i>
                  {course.instructor}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                variant="outline"
                className="w-full !rounded-button whitespace-nowrap cursor-pointer"
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
