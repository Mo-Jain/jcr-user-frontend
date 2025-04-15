"use client";

import React from "react";
import { Button } from "@/components/ui/button";


const PaymentQRButton = () => {
  // const upiUrl = `upi://pay?pa=yourbusiness@yesbank&pn=YourBusiness&am=100&cu=INR&tn=Booking ID #123`;

  return (
    <div className="flex flex-col gap-4 justify-center bg-background items-center w-full min-h-screen">
      <Button  className="text-white bg-primary">
        Pay with UPI QR
      </Button>
      {/* <QRCodeCanvas value={upiUrl} /> */}
      
    </div>
  );
};

export default PaymentQRButton;
