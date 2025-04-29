"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setPurchaseCourse } from "@/redux/authSlice";
import axios from "axios";
import Loader from "@/page/Loader";
import { toast } from "sonner";

export default function PurchaseSuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (!sessionId) {
        toast.error("No session ID provided.");
        return router.replace("/");
      }
      try {
        const res = await axios.get(
          `/api/stripe/verify-session?session_id=${sessionId}`
        );
        const { courseId } = res.data;
        dispatch(setPurchaseCourse(courseId));
        toast.success("Purchase confirmed!");
        router.replace(`/ProgressPage/${courseId}`);
      } catch (err) {
        console.error(err);
        toast.error("Could not verify purchase.");
        router.replace("/");
      }
    })();
  }, [sessionId, dispatch, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  );
}
