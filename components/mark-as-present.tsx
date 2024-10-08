"use client";

import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "./ui/input";
import { useState } from "react";
import { Label } from "./ui/label";

interface MarkAsPresentProps {
  loading: boolean;
  onSubmit: (status: string, hours?: number) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AttendanceEdit: React.FC<MarkAsPresentProps> = ({ loading, onSubmit, open, setOpen }) => {
  const [hours, setHours] = useState(0);
  const [status, setStatus] = useState("present");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Employee attendance</DialogTitle>
          <DialogDescription>
            Select the status of the employee and working hours.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Absent" id="absent" />
                <Label htmlFor="absent">Absent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Present" id="present" />
                <Label htmlFor="present">Present</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Leave" id="leave" />
                <Label htmlFor="leave">Leave</Label>
              </div>
            </RadioGroup>
          </div>
          {status == "Present" && (
            <Input
              type="number"
              placeholder="Enter hours worked"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
            />
          )}
        </div>
        <DialogFooter>
          <Button disabled={loading} onClick={() => onSubmit(status, hours)}>
            Mark as Present
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceEdit;
