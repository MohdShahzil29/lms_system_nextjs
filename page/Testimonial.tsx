"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";

export default function TestimonialSection() {
  const [current, setCurrent] = useState(0);
  const [feadBack, setFeadBack] = useState<any[]>([]);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get("/api/feadback/getFeadback");
      if (res.status === 200) {
        setFeadBack(res.data.feedback);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % feadBack.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + feadBack.length) % feadBack.length);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feadBack.length);
    }, 6000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [feadBack.length]);

  const testimonial = feadBack[current];

  return (
    <section className="max-w-4xl mx-auto mt-24 px-6">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight mb-3">
          What Our Students Say
        </h2>
        <p className="text-muted-foreground text-lg">
          Honest words from learners who’ve taken the journey.
        </p>
      </div>

      {testimonial && (
        <Card className="relative overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl transition hover:shadow-blue-500/40 duration-300">
          <CardContent className="p-10 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 text-center"
              >
                <div className="flex justify-center">
                  <Quote className="w-10 h-10 text-primary" />
                </div>
                <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl mx-auto">
                  “{testimonial.feadBackDescription}”
                </p>
                <div className="flex flex-col items-center gap-2">
                  <Image
                    src={testimonial?.userId?.photo}
                    alt={testimonial?.userId?.name || "user"}
                    width={64}
                    height={64}
                    className="rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <p className="text-lg font-semibold">
                    {testimonial?.userId?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial?.role || "Learner"}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>

          {/* Arrows */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2">
            <Button size="icon" variant="ghost" onClick={prev}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <Button size="icon" variant="ghost" onClick={next}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      )}

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {feadBack.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              current === index ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
