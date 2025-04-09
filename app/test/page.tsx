"use client";

import React from "react";
import { Button } from "@/components/ui/button";


const PaymentQRButton = () => {
  
  return (
    <div className="flex flex-col gap-4 justify-center bg-background items-center w-full min-h-screen">
      <Button  className="text-white bg-primary">
        Pay with UPI QR
      </Button>
    </div>
  );
};

export default PaymentQRButton;
