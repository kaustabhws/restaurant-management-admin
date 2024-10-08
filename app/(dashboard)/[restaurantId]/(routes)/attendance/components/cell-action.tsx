"use client";

import { EmployeeAttendanceColumn } from "./columns";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import AttendanceEdit from "@/components/mark-as-present";

interface CellActionProps {
  data: EmployeeAttendanceColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onSubmit = async (status: string, hours?: number) => {
    try {
      setLoading(true);
      await axios.post(`/api/${params.restaurantId}/attendance/${data.id}`, {
        status,
        hours,
      });
      toast.success("Attendance updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update attendance");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AttendanceEdit
        loading={loading}
        onSubmit={onSubmit}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
};
