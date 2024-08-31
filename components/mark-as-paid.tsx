import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Check } from "lucide-react";

interface MarkAsPaidProps {
  paymentMode: string;
  setPaymentMode: any;
  loading: boolean;
  submitPaid: (isPaid: boolean, payMode: string) => void;
  ghost?: boolean;
}

const MarkAsPaid: React.FC<MarkAsPaidProps> = ({
  paymentMode,
  setPaymentMode,
  loading,
  submitPaid,
  ghost,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {ghost ? (
          <div
          role="menuitem"
          className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted"
          tabIndex={-1}
          data-orientation="vertical"
          data-radix-collection-item=""
        >
          <Check className="mr-2 h-4 w-4" />
          Mark as paid
        </div>
        
        ) : (
          <Button>Mark as Paid</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Payment Mode</DialogTitle>
          <DialogDescription>
            Select the payment mode for this bill.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup value={paymentMode} onValueChange={setPaymentMode}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Cash" id="Cash" />
              <Label htmlFor="Cash">Cash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Card" id="Card" />
              <Label htmlFor="Card">Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="UPI" id="UPI" />
              <Label htmlFor="UPI">UPI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Split(cash & upi)" id="split" />
              <Label htmlFor="split">Split(Cash & UPI)</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            disabled={loading}
            onClick={() => submitPaid(true, paymentMode)}
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAsPaid;
