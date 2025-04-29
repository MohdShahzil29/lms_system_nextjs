import CourseCard from "@/page/CourseCard";
import Footer from "@/page/Footer";
import HeroBanner from "@/page/HeroBanner";
import Navbar from "@/page/Navbar";
import TestimonialSection from "@/page/Testimonial";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      <HeroBanner />
      <CourseCard />
      <TestimonialSection />
      {/* <Footer /> */}
    </div>
  );
}
