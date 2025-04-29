"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EducationLoader from "@/page/Loader";

interface Purchase {
  _id: string;
  amount: number;
  paymentId: string;
  courseId: {
    _id: string;
    courseTitle: string;
    coursePrice: number;
  };
  userId: {
    name: string;
    email: string;
  };
}

const CourseOrder = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get("/api/course/getBuyCourseList");
        if (response.data.success) {
          setPurchases(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching purchases", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <div>
        <EducationLoader />
      </div>
    );
  }

  return (
    <div className="p-4 mt-20 h-screen">
      <h2 className="text-2xl font-bold mb-4">Purchased Courses</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Course Title</TableHead>
            <TableHead>Course Price</TableHead>
            <TableHead>Student Name</TableHead>
            <TableHead>Student Email</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Payment ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchases.map((purchase) => (
            <TableRow key={purchase._id}>
              <TableCell>{purchase.courseId.courseTitle}</TableCell>
              <TableCell>${purchase.courseId.coursePrice}</TableCell>
              <TableCell>{purchase.userId.name}</TableCell>
              <TableCell>{purchase.userId.email}</TableCell>
              <TableCell>${purchase.amount}</TableCell>
              <TableCell>{purchase.paymentId.slice(0, 10)}...</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseOrder;
