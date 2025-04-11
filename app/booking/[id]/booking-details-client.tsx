'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowRight from "@/public/right_arrow.svg";
import BackButton from "@/public/back-button.svg";
import CarIcon from "@/public/car-icon.svg";
import Cancel from "@/public/cancel.svg";
import { Booking } from "./page";
import { RenderFileList } from "./render-file-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown,  Copy, Download, IndianRupee, MoreVertical, Mail, PrinterIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ActionDialog from "@/components/action-dialog";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogTitle,DialogFooter, DialogHeader, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Loader from "@/components/loader";
import PaymentButton from "@/components/razorpay-button";
import { calculateCost, cn } from "@/lib/utils";
import UPI from "@/public/upi-bhim.svg";
import CreditCard from "@/public/credit-card.svg";
import Loader2 from "@/components/loader2";
import NetBanking from "@/public/netbanking.svg";
import MailDialog from "@/components/mail-dialog";
import { useDownloadPDF } from "@/hooks/useDownload";

interface BookingDetailsClientProps {
  booking: Booking;
}

function formatDateTime(date: Date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BookingDetailsClient({ booking }: BookingDetailsClientProps) {
  const router = useRouter();
  const [isDropdownOpen,setIsDropdownOpen] = useState(false);
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const [bookingStatus,setBookingStatus] = useState<string>(booking.status);
  const [isOTPDialogOpen,setIsOTPDialogOpen] = useState(false);
  const [otp,setOtp] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const [advancePayment,setAdvancePayment] = useState(booking.advancePayment || 0);
  const [paymentMethod,setPaymentMethod] = useState<string>(booking.paymentMethod || "");
  const [isPayment,setIsPayment] = useState(false);
  const [copied, setCopied] = useState(false)
  const phoneNumber = "+91 79995 51582"
  const emailAddress = "jcrahmedabad@gmail.com";
  const [isOTPLoading,setOTPLoading] = useState(false);
  const [openMailDialog, setOpenMailDialog] = useState(false);
  const { downloadPDF } = useDownloadPDF();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast({
      title: "Phone number copied!",
      duration:1000
    })
    setTimeout(() => setCopied(false), 2000)
  }

   function getHeader(
    status: string,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
  ) {
    let headerText = "";
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    const type = booking.type[0].toUpperCase() + booking.type.slice(1);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    const currDate = new Date();
    if (status === "Upcoming") {
      if (startDateTime >= currDate) {
        headerText = type + " scheduled on";
      } else {
        headerText = type + " was scheduled on";
      }
    } else if (status === "Ongoing") {
      if (endDateTime < currDate) {
        headerText = "Return was scheduled on";
      } else {
        headerText = "Return scheduled by";
      }
    } else if (status === "Completed") {
      headerText = "Trip ended at";
    }
    else if (status === "Cancelled") {
      if(booking.cancelledBy === "guest"){
        headerText = "Trip was cancelled by you";
      }
      else if(booking.cancelledBy === "host"){
        headerText = "Trip was cancelled by owner";
      }
    } else if (status === "Requested") {
      headerText = "Booking requested by";
    }
    return headerText;
  }

  useEffect(() => {
    if(isLoading){
      document.documentElement.classList.add("no-scroll");
    }else {
      document.documentElement.classList.remove("no-scroll");
    }

    return () => {
      document.documentElement.classList.remove("no-scroll");
    };
    }, [isLoading]);


  const getDocumentList = (type: "documents" | "photos" | "selfie") => {
    let documentList: {
      id: number;
      name: string;
      url: string;
      type: string;
    }[] = [];

    if (type === "documents") {
      documentList = booking.documents ? booking.documents : [];
    } else if (type === "photos") {
      documentList = booking.carImages
        ? booking.carImages.map((image) => {
            return {
              id: image.id,
              name: image.name,
              url: image.url,
              type: "image/jpeg",
            };
          })
        : [];
    } else {
      documentList = booking.selfieUrl
        ? [
            {
              id: 1,
              name: "Car Selfie",
              url: booking.selfieUrl,
              type: "image/jpeg",
            },
          ]
        : [];
    }

    return documentList;
  };

  const handleCancel = async() => {
    try{
      await axios.put(`${BASE_URL}/api/v1/customer/booking-cancel/${booking.id}`,{},{
        headers: {
          authorization: `Bearer ` + localStorage.getItem("token"),
        }
      });
      setBookingStatus("Cancelled");
      toast({
        description: `Booking Successfully cancelled`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        duration: 2000,
      });
    }
    catch(error){
      console.log(error);
    }
  };

 
  const totalAmount = calculateCost(booking.start,booking.end,booking.startTime,booking.endTime,booking.dailyRentalPrice);
  const charge = booking?.totalPrice && (paymentMethod === "card" || paymentMethod === "netbanking") ? booking?.totalPrice*0.02 : 0;
  const amountRemaining = booking.totalPrice ? (booking.totalPrice - (advancePayment || 0)) : 0;
  
  const isSomeDetails = booking.odometerReading || booking.endodometerReading
  || (booking.documents && booking.documents.length >0) || booking.selfieUrl || (booking.carImages && booking.carImages.length > 0);

  const onPayment = (method:string) => {
    setAdvancePayment(booking.totalPrice || 0);
    setPaymentMethod(method);
  }

  const renderFileList = (type: "documents" | "photos" | "selfie") => {
    return (
      <div className="mt-2 text-sm">
        <RenderFileList
          documents={getDocumentList(type)}
          type={type}
          bookingId={booking.id}
        />
      </div>
    );
  };

  const exportPDF = async () => {
    setIsLoading(true);
    await downloadPDF('printable-section', 'booking.pdf');
    setIsLoading(false);
  }

  const handleVerify = async() => {
    setOTPLoading(true);
    try{
      const res = await axios.get(`${BASE_URL}/api/v1/customer/check-otp/${booking.id}?otp=${otp}`,
      {
        headers: {
          authorization: `Bearer ` + localStorage.getItem("token"),
        }
      });
      if(res.data.isCorrect){
        toast({
          description: `OTP Successfully verified`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          duration: 2000,
        });
        setIsLoading(true);
        setIsOTPDialogOpen(false);
        router.push(`/booking/start/form/${booking.id}?otp=${otp}`);
      }else {
        toast({
          description: `OTP is incorrect`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          duration: 2000,
        });
      }
    }
    catch(error){
      console.log(error);
      setOTPLoading(false);
    }
    setOTPLoading(false);
  };

  return (
    <div>
      {isLoading &&
      <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
          <Loader/>
      </div>
      }
    <div id="printable-section" className="pt-[75px] print:text-black pdf-mode:text-black sm:pt-12 print:pt-2 pdf-mode:pt-0 relative z-0">
      <MailDialog mail={booking.customerMail} open={openMailDialog} setOpen={setOpenMailDialog} booking={booking}/>
      <div className="no-print:fixed pdf-mode:relative top-[75px] sm:top-12 pdf-mode:top-0 w-full left-0 flex pt-3 print:pt-2 pdf-mode:pt-0 bg-background pdf-mode:bg-transparent z-10 items-center justify-between print:justify-center pdf-mode:justify-center px-2 pb-2 border-b border-gray-300 dark:border-muted dark:text-white"> 
        <div
          className="mr-2 rounded-md no-print pdf-mode:hidden font-bold  cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200"
          onClick={() => router.push("/bookings")}
        >
          <div className="h-10 w-9 flex border-border border justify-center items-center rounded-md ">
            <BackButton className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold pdf-mode:text-black print:text-black">Booking {bookingStatus}</h2>
          <p className="text-sm text-blue-500">Booking ID: {booking.id}</p>
        </div>
        {bookingStatus !== "Cancelled" ?
        <DropdownMenu
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
            modal={false}
            
          >
            <DropdownMenuTrigger asChild className="no-print pdf-mode:hidden">
              <Button variant="ghost" className="h-8 w-8 p-0 active:scale-95">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border no-print">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  setIsDialogOpen(true);
                  setIsDropdownOpen(false);
                }}
              >
                <Cancel className="mr-2 h-4 w-4 stroke-1 stroke-black dark:stroke-white dark:fill-white" />
                <span>Cancel</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenMailDialog(true)}
              >
                <Mail className="mr-2 h-4 w-4 " />
                <span>Mail Booking Details</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => window.print()}
              >
                <PrinterIcon className="mr-2 h-4 w-4 " />
                <span>Print PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={exportPDF}
              >
                <Download className="mr-2 h-4 w-4 stroke-1 stroke-black dark:stroke-white fill-black dark:fill-white" />
                <span>Export PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          :
          <div className="w-8 h-8 no-print"/>
          }
      </div>
      <div className="w-full h-[70px] no-print pdf-mode:hidden"/>

        <div className="w-full flex py-2 justify-center no-print">
          {((booking?.totalPrice || 0) - advancePayment) > 0 && bookingStatus !== "Requested"  && bookingStatus !== "Completed"  &&
          <div className=" flex flex-col items-center justify-center w-full">
            <Button 
            onClick={() => {
              setIsPayment(!isPayment);
            }}
            className="p-2 cursor-pointer rounded-sm text-sm text-white active:scale-95 bg-primary hover:bg-opacity-10">
              Proceed with payment
              <ChevronDown className={`w-4 transition-all duration-300 ease-in-out h-4 ${isPayment ? "rotate-180" : ""}`}/>
            </Button> 
            <div className={cn("w-full h-fit max-w-[360px] h-fit  overflow-hidden p-2 sm:px-4 flex justify-between mx-auto ",
            )}>
              <PaymentButton selectedMethod="upi" totalAmount={(booking?.totalPrice || 0) - advancePayment} onSuccess={onPayment} bookingId={booking.id} setIsLoading={setIsLoading}>
                <div
                className={cn("p-2 overflow-hidden  flex flex-col gap-2 w-[105px] rounded-sm bg-gray-300 dark:bg-card items-center border-border transition-all duration-300 ease-in-out",
                  !isPayment ? 'h-0 p-0' : 'h-[110px]'
                )}>
                  <UPI className = "w-12 h-12 fill-none flex-shrink-0 stroke-[10px] stroke-foreground"/>
                  <p className="text-sm mb-3">UPI</p>
                </div>
              </PaymentButton>
              <PaymentButton selectedMethod="card" totalAmount={((booking?.totalPrice || 0) + (booking?.totalPrice || 0)*0.02) - advancePayment} onSuccess={onPayment} bookingId={booking.id} setIsLoading={setIsLoading}>
                <div 
                className={cn("p-2 overflow-hidden flex flex-col gap-2 w-[105px] rounded-sm bg-gray-300 dark:bg-card items-center border-border transition-all duration-300 ease-in-out",
                  !isPayment ? 'h-0 p-0' : 'h-[110px]'
                )}>
                  <CreditCard className = "w-12 h-12 flex-shrink-0 fill-foreground"/>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm ">Card</p>
                    <span className="text-[10px] -mt-2">{"(Extra 2% fee)"}</span>
                  </div>
                </div>
              </PaymentButton>
              <PaymentButton selectedMethod="netbanking" totalAmount={((booking?.totalPrice || 0) + (booking?.totalPrice || 0)*0.02) - advancePayment} onSuccess={onPayment} bookingId={booking.id} setIsLoading={setIsLoading}>
                <div 
                className={cn("p-2 overflow-hidden flex flex-col gap-2 w-[105px] rounded-sm bg-gray-300 dark:bg-card items-center border-border transition-all duration-300 ease-in-out",
                  !isPayment ? 'h-0 p-0' : 'h-[110px]'
                )}>
                  <NetBanking className = {cn("w-12 h-12 flex-shrink-0 fill-foreground")}/>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm ">Net banking</p>
                    <span className="text-[10px] -mt-2">{"(Extra 2% fee)"}</span>
                  </div>
                </div>
              </PaymentButton>
            </div>
        </div>}
        </div>
      <div className=" relative px-1 sm:px-4 py-4 border-b-4 pdf-mode:py-2 border-gray-200 dark:border-muted">
        <div className="  flex justify-between items-center">
          <div className="absolute top-[10%] text-sm left-0 rounded-e-lg bg-blue-400 border-border p-1 px-2">
            {booking.type}
          </div>  
          <div>
            <p className="text-sm text-blue-500">
              {getHeader(
                bookingStatus,
                booking.start,
                booking.startTime,
                booking.end,
                booking.endTime,
              )}
            </p>
            <p className="font-semibold max-sm:text-sm">
              {formatDateTime(
                bookingStatus === "Upcoming" ? new Date(booking.start) : new Date(booking.end),
              )}
            </p>
          </div>
          <div className="text-right flex flex-col items-end w-fit">
            <div className="relative flex items-center sm:h-24 sm:w-36 rounded-md border border-border h-20 w-32 mb-2">
              {booking.carImageUrl !== "" ? (
                <Image
                  src={booking.carImageUrl}
                  alt={booking.carName}
                  fill
                  sizes="6"
                  priority={true}
                  className="object-cover rounded w-full"
                />
              ) : (
                <CarIcon className="w-full dark:stroke-blue-200 p-1  dark:fill-blue-200 stroke-black fill-black" />
              )}
            </div>
            <p className="text-sm font-semibold text-[#4B4237] max-sm:max-w-[180px] dark:text-gray-400">
              {booking.carName}
            </p>
            <p className="text-xs text-blue-500">{booking.carPlateNumber}</p>
          </div>
        </div>
      </div>

      <div className="px-1 sm:px-4 py-4 border-b-4 pdf-mode:py-2 border-gray-200 dark:border-muted">
        <h3 className="text-lg font-semibold mb-4 ">Booking Details</h3>
        <div className="flex items-center justify-center gap-8 max-sm:gap-2 mb-4">
          <div className="w-full flex flex-col items-end">
          <div className="w-fit">
            <p className="text-sm text-blue-500">From</p>
              <p className="font-semibold max-sm:text-sm">
                {formatDateTime(new Date(booking.start))} {booking.startTime.slice(0,5)}
              </p>
          </div>
          </div>
          <div className="w-full flex justify-center">
            <ArrowRight className="mt-4 w-12 stroke-0 fill-blue-400 flex-shrink-0" />
          </div>
          <div className="w-full">
            <p className="text-sm text-blue-500">To</p>
              <p className="font-semibold max-sm:text-sm">
                {formatDateTime(new Date(booking.end))} {booking.endTime.slice(0,5)}
              </p>
          </div>
        </div>
        <hr className="my-4 border-gray-200 dark:border-muted" />
        <div className="grid grid-cols-2 items-center sm:gap-6">
          <div>
            <p className="text-sm text-blue-500 mb-1">Booked by</p>
                <p className="font-semibold">{booking.customerName}</p>
                <p className="text-sm">{booking.customerContact}</p>
          </div>
          <div>
            {booking.customerAddress && (
              <div>
                <p className="text-sm text-blue-500">Address</p>
                  <span className="text-sm whitespace-wrap max-w-[120px]">
                    {booking.customerAddress}
                  </span>
              </div>
            )}
          </div>
        </div>
        <hr className="my-4 border-gray-200 dark:border-muted" />
        <div className="grid grid-cols-2 items-center sm:gap-6">
          <div>
            <p className="text-sm text-blue-500 mb-1">Payment Method</p>
            <div>
                <p className={` `}>{paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-1 sm:px-4 py-4 border-b-4 pdf-mode:py-2 border-gray-200 dark:border-muted">
        <h3 className="text-lg font-semibold mb-4 pdf-mode:mb-0">
          Price and Payment Details
        </h3>
        <div className="rounded-lg bg-transparent py-4 px-2 space-y-2 w-full max-w-[500px] mx-auto">
            <div className="flex justify-between">
              <span className="text-sm">Daily Rate:</span>
              <span className="text-sm font-medium flex items-center pdf-mode:items-center gap-1 pdf-mode:gap-0">
                <span className="pdf-mode:mt-4">
                  <IndianRupee className="w-4 h-4  "/>
                </span>
                {booking.dailyRentalPrice.toFixed(2)}
              </span>
            </div>
            {booking.totalPrice &&
            <div className="flex justify-between">
              <span className="text-sm">Duration:</span>
              <span className="text-sm font-medium">{(totalAmount/booking.dailyRentalPrice).toFixed(2)} days</span>
            </div>}
            <div className="flex justify-between">
              <span className="text-sm">Delivery charges:</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <span className="pdf-mode:mt-4">
                  <span className="pdf-mode:mt-4">
                  <IndianRupee className="w-4 h-4  "/>
                </span>
                </span>
                {(booking.type === "home delivery" ? 1000 : 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Merchant fees:</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <span className="pdf-mode:mt-4">
                  <IndianRupee className="w-4 h-4  "/>
                </span>
                {charge.toFixed(2)}
              </span>
            </div>
            {booking.totalPrice &&
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold flex items-center gap-1">
                <span className="pdf-mode:mt-4">
                  <IndianRupee className="w-4 h-4  "/>
                </span>
                {booking.totalPrice.toFixed(2)}</span>
            </div>}
            
            <div className="flex justify-between">
              <span className="text-sm">Amount paid:</span>
              <span className="text-sm font-medium flex items-center gap-1">
                <span className="pdf-mode:mt-4">
                  <IndianRupee className="w-4 h-4  "/>
                </span>
                {(advancePayment).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-medium">Amount remaining:</span>
              {amountRemaining > 0 ?
              <span className=" font-bold flex items-center gap-1">
                <span className="pdf-mode:mt-4">
                  <IndianRupee className="w-4 h-4  "/>
                </span>
                  {amountRemaining.toFixed(2)}
              </span>
              :
              <span className=" font-bold flex items-center gap-1">
                Fully Paid
              </span>
              }
            </div>
          </div>
        <div className="flex items-center gap-3">
            <span className="text-sm">Security deposit:</span>
            {booking.securityDeposit ?
                <span className="text-sm font-medium flex items-center gap-1">
                  <span className="pdf-mode:mt-4">
                  <IndianRupee className="w-4 h-4  "/>
                </span>
                  {booking.securityDeposit}
                </span>
                :
                <span className="text-sm italic font-medium flex items-center gap-1">
                    No security deposit
                </span>}
            </div>
      </div>
      <div className="px-1 sm:px-4 py-4 border-b-4 pdf-mode:py-2 border-gray-200 dark:border-muted">
        <h3 className="text-lg font-semibold mb-4 ">Owner Details</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-6">
          <div className="space-y-4">
              <div>
                <p className="text-sm text-blue-500">Owner Name</p>
                  <span className="text-sm">Naveen Jain</span>
              </div>
              <div>
                <p className="text-sm text-blue-500">Phone</p>
                <div className="flex items-center">
                  <span className="text-sm">{phoneNumber}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(phoneNumber)}
                    className="h-8 px-2 no-print pdf-mode:hidden"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
          </div>
          <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <a href={`mailto:${emailAddress}`} className="text-primary text-xs sm:text-sm hover:underline">
                  {emailAddress}
                </a>
              </div>
          </div>
        </div>
      </div>
      {isSomeDetails &&
      <div className={cn("px-1 sm:px-4 py-4 border-b-4 pdf-mode:py-2 border-gray-200 dark:border-muted",
        !isSomeDetails ? "print:hidden pdf-mode:hidden" : "",
        isSomeDetails && booking.documents && booking.documents.length > 0 ? "print:hidden pdf-mode:hidden" : "",
        isSomeDetails && booking.selfieUrl ? "print:hidden pdf-mode:hidden" : "",
        isSomeDetails && booking.carImages && booking.carImages.length > 0 ? "print:hidden pdf-mode:hidden" : ""
      )}>
        <h3 className="text-lg font-semibold mb-4 ">Some more details</h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            {booking.odometerReading && (
              <div>
                <p className="text-sm text-blue-500">Odometer Reading</p>
                  <span className="text-sm">{booking.odometerReading}</span>
              </div>
            )}
            {bookingStatus !== "Upcoming" && booking.selfieUrl && (
              <div className="no-print pdf-mode:hidden">
                <p className="text-xs sm:text-sm text-blue-500">
                  Selfie with car
                </p>
                <div>{renderFileList("selfie")}</div>
              </div>
            )}
            {booking.documents && booking.documents?.length > 0 && (
            <div className="no-print pdf-mode:hidden">
              <div className="flex sm:gap-1 items-center">
                <p className="text-xs sm:text-sm text-blue-500">
                  Aadhar Card and Driving License
                </p>
              </div>
              
                <div>
                  <div className="mt-2 text-sm">
                    {renderFileList("documents")}
                  </div>
                </div>
            </div>)}
          </div>
          <div className="space-y-4">
            {booking.endodometerReading && (
              <div>
                <p className="text-sm text-blue-500">End Odometer Reading</p>
                  <span className="text-sm">{booking.endodometerReading}</span>
              </div>
            )}
            {booking.odometerReading &&
              Number(booking.endodometerReading) > Number(booking.odometerReading) && (
                <div>
                  <p className="text-sm text-blue-500">Kilometer travelled</p>
                  <span className="text-sm">
                    {Number(booking.endodometerReading) - Number(booking.odometerReading)}
                  </span>
                </div>
              )}
            {booking.notes && (
              <div>
                <p className="text-sm text-blue-500">Notes if any</p>
                  <span className="text-sm">{booking.notes}</span>
              </div>
            )}
            {bookingStatus !== "Upcoming" && booking.carImages && booking.carImages.length >0 && (
              <div className="no-print pdf-mode:hidden">
                <div className="flex sm:gap-1 items-center">
                  <p className="text-xs sm:text-sm text-blue-500">
                    Photos Before pick-up
                  </p>
                </div>
                  <div>
                    <div className="mt-2 text-sm">
                      {renderFileList("photos")}
                    </div>
                  </div>
              </div>
            )}
          </div>
        </div>
        
      </div>
      }
        {bookingStatus === "Upcoming" ? (
        <div className="w-full no-print pdf-mode:hidden fixed bg-background border-t border-border z-10 bottom-0 left-0 flex justify-center p-2 flex items-center gap-2">
            <div className="flex sm:hidden items-center flex-col w-1/3">
              <span className="text-primary italic text-[8px] whitespace-nowrap">Amount Remaining</span>
              {amountRemaining > 0 ?
              <span className="text-sm font-bold text-md">{amountRemaining.toFixed(2)}</span>:
              <span className="text-sm italic text-md">Fully Paid</span>
              }
            </div>
            <Button
              className="px-4 py-4 sm:min-w-[400px] max-sm:w-full active:scale-95 bg-blue-600 text-white  shadow-lg"
              onClick={() => {
                setIsOTPDialogOpen(true);
                
              }}
            >
              <span className="">Start Booking</span>
            </Button>
        </div>
        ):
        <div className="w-full h-[50px] no-print"/>
        }
        <ActionDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          action={"Cancel"}
          handleAction={handleCancel}
        />
      <div className="relative z-50">
        <Dialog open={isOTPDialogOpen} onOpenChange={setIsOTPDialogOpen}>
          <DialogOverlay className=" no-print backdrop-blur-lg"/>
              <DialogContent className="max-w-[325px] max-sm:rounded-sm  bg-muted border-border">
                <DialogHeader>
                  <DialogTitle className="text-center mb-2">Enter OTP</DialogTitle>
                  <DialogDescription >
                  Ask owner for OTP
                  </DialogDescription>
                  <div className="text-grey-500 mt-1 flex justify-center">
                    <Input
                      type="text"
                      id="otp"
                      className="w-2/3 border-input max-sm:text-xs  focus:border-blue-400 focus-visible:ring-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setOtp(value);
                        }
                      }}
                    />
                  </div>
                </DialogHeader>
                <DialogFooter className="flex flex-row w-full gap-2 items-center">
                   <Button
                    variant={"outline"}
                      className="w-full active:scale-95 bg-transparent  hover:bg-black/10 dark:hover:bg-white/10 shadow-lg"
                      onClick={() => {
                        setIsDialogOpen(false);
                      }}
                    >
                      Cancel
                  </Button>
                  {!isOTPLoading ?
                  <Button
                    className="w-full active:scale-95 bg-primary text-white hover:bg-opacity-70 shadow-lg"
                    onClick={handleVerify}
                  >
                    Verify
                  </Button>
                  :
                  <Button
                  className="w-full active:scale-95 bg-primary text-white bg-opacity-50 shadow-lg"
                    >
                      <Loader2/>
                  </Button>
                  }
                  
                </DialogFooter>
              </DialogContent>
          </Dialog>
      </div>
    </div>
    </div>
  );
}
