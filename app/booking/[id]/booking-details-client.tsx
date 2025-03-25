'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import ArrowRight from "@/public/right_arrow.svg";
import BackArrow from "@/public/back-arrow.svg";
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
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import ActionDialog from "@/components/action-dialog";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";

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
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    const currDate = new Date();
    if (status === "Upcoming") {
      if (startDateTime >= currDate) {
        headerText = "Pickup scheduled on";
      } else {
        headerText = "Pickup was scheduled on";
      }
    } else if (status === "Ongoing") {
      if (endDateTime < currDate) {
        headerText = "Return was scheduled on";
      } else {
        headerText = "Return scheduled by";
      }
    } else if (status === "Completed") {
      headerText = "Booking ended at";
    }
    else if (status === "Cancelled") {
      if(booking.cancelledBy === "guest"){
        headerText = "Booking was cancelled by you";
      }
      else if(booking.cancelledBy === "host"){
        headerText = "Booking was cancelled by owner";
      }
    }
    return headerText;
  }


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

  return (
    <div className="pt-12">
      
      <div className="flex pt-2 items-center justify-between px-2 pb-2 border-b border-gray-300 dark:border-muted dark:text-white">
        <div
          className="mr-2 rounded-md font-bold  cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200"
          onClick={() => router.push("/bookings")}
        >
          <div className="h-10 w-9 flex border-border border justify-center items-center rounded-md ">
            <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold">Booking {bookingStatus}</h2>
          <p className="text-sm text-blue-500">Booking ID: {booking.id}</p>
        </div>
        {bookingStatus !== "Cancelled" ?
        <DropdownMenu
            open={isDropdownOpen}
            onOpenChange={setIsDropdownOpen}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 active:scale-95">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-border">
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
            </DropdownMenuContent>
          </DropdownMenu>
          :
          <div className="w-8 h-8"/>
          }
      </div>

      <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
        <div className="flex justify-between items-center">
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

      <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
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
        <div>
          <p className="text-sm text-blue-500 mb-1">Booking Status</p>
          <div>
              <p className={` `}>{bookingStatus}</p>
          </div>
        </div>
      </div>
      <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
        <h3 className="text-lg font-semibold mb-4 ">
          Price and Payment Details
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div>
            <p className="text-sm text-blue-500 mb-1">24 Hr Price</p>
              <p className="text-sm">{booking.dailyRentalPrice}</p>
          </div>
          {booking.securityDeposit && (
            <div>
              <p className="text-sm text-blue-500">Security Deposit</p>
                <span className="text-sm">{booking.securityDeposit}</span>
            </div>
          )}
        </div>
        <hr className="my-4 border-gray-200 dark:border-muted" />
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div>
            <p className="text-sm text-blue-500">Payment Amount</p>
            <span className="text-sm">{booking.totalPrice}</span>
          </div>
          <div>
            {booking.paymentMethod && (
              <div>
                <p className="text-sm text-blue-500">Payment Method</p>
                  <span className="text-sm">{booking.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-1 sm:px-4 py-4 border-b-4 border-gray-200 dark:border-muted">
        <h3 className="text-lg font-semibold mb-4 ">Some more details</h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            {booking.odometerReading && (
              <div>
                <p className="text-sm text-blue-500">Odometer Reading</p>
                  <span className="text-sm">{booking.odometerReading}</span>
              </div>
            )}
            {bookingStatus !== "Upcoming" && (
              <div>
                <p className="text-xs sm:text-sm text-blue-500">
                  Selfie with car
                </p>
                <div>{renderFileList("selfie")}</div>
                {!booking.selfieUrl && (
                  <div className="h-[20px] w-full" />
                )}
              </div>
            )}
            <div>
              <div className="flex sm:gap-1 items-center">
                <p className="text-xs sm:text-sm text-blue-500">
                  Aadhar Card and Driving License
                </p>
              </div>
              {booking.documents && (
                <div>
                  <div className="mt-2 text-sm">
                    {renderFileList("documents")}
                  </div>
                </div>
              )}
            </div>
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
            {bookingStatus !== "Upcoming" && (
              <div>
                <div className="flex sm:gap-1 items-center">
                  <p className="text-xs sm:text-sm text-blue-500">
                    Photos Before pick-up
                  </p>
                </div>
                {booking.carImages && booking.carImages.length > 0 && (
                  <div>
                    <div className="mt-2 text-sm">
                      {renderFileList("photos")}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <ActionDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          action={"Cancel"}
          handleAction={handleCancel}
        />
      </div>
    </div>
  );
}
