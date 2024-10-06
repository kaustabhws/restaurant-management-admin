import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { Send } from "lucide-react";

interface CustomerDetailsSubmitProps {
  loading: boolean;
  contact: string;
  setContact: React.Dispatch<React.SetStateAction<string>>;
  contactMethod: string;
  setContactMethod: React.Dispatch<React.SetStateAction<string>>;
  submitOrder: () => void;
}

const CustomerDetailsSubmit: React.FC<CustomerDetailsSubmitProps> = ({
  loading,
  contact,
  setContact,
  contactMethod,
  setContactMethod,
  submitOrder,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">
          Submit order
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact-method" className="text-right">
              Contact via
            </Label>
            <Select
              onValueChange={(value) => setContactMethod(value)}
              defaultValue={contactMethod}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact-input" className="text-right">
              {contactMethod === "phone" ? "Phone" : "Email"}
            </Label>
            <Input
              id="contact-input"
              className="col-span-3"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={
                contactMethod === "phone"
                  ? "Enter your phone number"
                  : "Enter your email address"
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            disabled={loading}
            onClick={() => submitOrder()}
            className="w-max"
          >
            Confirm Order
          </Button>
          <Button disabled={loading} variant="destructive" onClick={() => submitOrder()}>
            Submit without contact
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsSubmit;
