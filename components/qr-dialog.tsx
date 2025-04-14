import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "./ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import UpiQrCode from "./upi-qr-code";

const QrDialog = ({open,setOpen,price}:
    {
        open:boolean,
        setOpen:React.Dispatch<React.SetStateAction<boolean>>,
        price:number,
    }) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-border max-sm:h-[80%] py-auto ">
            <DialogHeader className="w-full">
                <DialogTitle className="font-bold">
                    Scan and Pay
                </DialogTitle>
                <DialogDescription>
                    Scan below QR code to pay INR {price} 
                </DialogDescription>
                <div className="flex flex-col justify-center items-center w-full">
                  <UpiQrCode upiId="9724669431@kotak811" name="Naveen Jain" amount={price}/>
                </div>
                <span className="text-sm">Make sure to send screenshot of payment to owner for confirmation</span>
            </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QrDialog;
