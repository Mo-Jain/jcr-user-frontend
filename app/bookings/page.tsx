"use client";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IndianRupee} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import ArrowRight from "@/public/right_arrow.svg";
import CarIcon from "@/public/car-icon.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import Booking from "@/public/online-booking.svg";
import Loader from "@/components/loader";
import { useRouter } from "next/navigation";

type BookingStatus = "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | "All";

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


function getTimeUntilBooking(startTime: string, status: string) {
  if (status === "Completed") return "Booking has ended";
  if (status === "Cancelled") return "Booking has been cancelled";
  if (status === "Ongoing") return "Booking has started";
  const now = new Date();
  const start = new Date(startTime);
  const diffTime = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Booking has started";
  if (diffDays === 0) return "Booking will start Today";
  if (diffDays === 1) return "Booking will start in 1 day";
  return `Booking will start in ${diffDays} days`;
}

export interface Booking {
  id: string;
  carId: number;
  carImageUrl: string;
  carName: string;
  carPlateNumber: string;
  end: string; // ISO 8601 date string
  start: string; // ISO 8601 date string
  startTime: string;
  endTime: string;
  status: string;
  price:number;
}

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>("Upcoming");
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const res1 = await axios.get(`${BASE_URL}/api/v1/customer/booking/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setBookings(res1.data.bookings);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [setBookings]);


  const getBookingLength = (status: string) => {
    let length = 0;
    const newBookings = bookings;
    if (status === "All"){
      length = newBookings.length;
    }else if (status === "Upcoming"){
      length = newBookings.filter(booking => booking.status === "Upcoming").length;
    }else if (status === "Ongoing"){
      length = newBookings.filter(booking => booking.status === "Ongoing").length;
    }else if (status === "Completed"){
      length = newBookings.filter(booking => booking.status === "Completed").length;
    }else if (status === "Cancelled"){
      length = newBookings.filter(booking => booking.status === "Cancelled").length;
    }
    return length > 0 ? ` (${length})` : "";
  }

  useEffect(() => {
    const newfilteredBookings = bookings.filter(
      (booking) =>
        (selectedStatus === "All" || booking.status === selectedStatus),
    );

    setFilteredBookings(newfilteredBookings);
  }, [bookings,  selectedStatus]);


  return (
    <div className="min-h-screen bg-background mt-12 max-sm:mt-16 max-sm:mb-12">
   
      <main className="container mx-auto px-2 sm:px-4 py-8 pb-16 sm:pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1
            style={{ fontFamily: "var(--font-equinox)" }}
            className="text-3xl max-sm:text-xl font-black"
          >
            MY BOOKINGS
          </h1>
        </div>
        <div className=" flex justify-between scrollbar-hide">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedStatus === "All" ? "default" : "outline"}
              className={`rounded-sm ${selectedStatus === "All" ? "bg-blue-400 active:scale-95 hover:bg-blue-500 text-white dark:text-black" : "hover:bg-blue-100 bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"}`}
              onClick={() => setSelectedStatus("All")}
            >
              All{getBookingLength("All")}
            </Button>
            <Button
              variant={selectedStatus === "Upcoming" ? "default" : "outline"}
              className={
                selectedStatus === "Upcoming"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white dark:text-black rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Upcoming")}
            >
              Upcoming{getBookingLength("Upcoming")}
            </Button>
            <Button
              variant={selectedStatus === "Ongoing" ? "default" : "outline"}
              className={
                selectedStatus === "Ongoing"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white dark:text-black rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Ongoing")}
            >
              Ongoing{getBookingLength("Ongoing")}
            </Button>
            <Button
              variant={selectedStatus === "Completed" ? "default" : "outline"}
              className={
                selectedStatus === "Completed"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white dark:text-black rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Completed")}
            >
              Completed{getBookingLength("Completed")}
            </Button>
            <Button
              variant={selectedStatus === "Completed" ? "default" : "outline"}
              className={
                selectedStatus === "Cancelled"
                  ? "bg-blue-400 hover:bg-blue-500 active:scale-95 text-white dark:text-black rounded-sm"
                  : "hover:bg-blue-100 rounded-sm bg-transparent border-border dark:text-white dark:hover:bg-zinc-700 text-black"
              }
              onClick={() => setSelectedStatus("Cancelled")}
            >
              Cancelled{getBookingLength("Cancelled")}
            </Button>
          </div>
         
        </div>
        <div className="border-t overflow-hidden border-border w-full ">
        </div>
        {bookings.length > 0 ? (
          <div ref={containerRef} className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={index}
                booking={booking}
              />
            ))}
            {filteredBookings.length === 0 && (
              <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
                <Booking
                  className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[5px] fill-gray-400 `}
                />
                <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
                  No Bookings in this category
                </p>
              </div>
            )}
          </div>
        ) : (
          <div key={2}>
            {!isLoading ? (
              <div className="w-full h-full py-28 gap-2 flex flex-col justify-center items-center">
                <Booking
                  className={`sm:h-16 h-12 sm:w-16 w-12 stroke-[5px] fill-gray-400 `}
                />
                <p className="text-center text-lg sm:text-2xl text-gray-400 font-bold">
                  You don&apos;t have any trips yet
                </p>
                <div 
                onClick ={ () => router.push("/cars") }
                className="p-2 cursor-pointer active:scale-95 hover:bg-blue-400 select-none bg-blue-500 text-sm rounded-md text-white">Book Now</div>
                
              </div>
            ) : (
              <div className="w-full h-full py-28 gap-2 flex justify-center items-center">
                <Loader/>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const BookingCard = ({
  booking,
}: {
  booking: Booking;
}) => {

  return (
    <div
      style={{ marginTop: 0 }}
      className="flex gap-2 overflow-hidden mt-0 items-center w-full"
    >
     
      <Card className="w-full overflow-hidden bg-white dark:bg-background hover:shadow-md border-border transition-shadow my-2">
        <Link href={`/booking/${booking.id}`}>
          <CardContent className="p-0">
            <div className=" dark:bg-background border-b border-border flex flex-row-reverse items-center justify-between">
              <div className="flex-1 sm:p-4 py-2 px-2 h-full">
                <div className="flex items-center justify-between w-full gap-2 mb-3">
                  <div>
                    <p>
                      {booking.carName}
                    </p>
                    <p>
                      {booking.carPlateNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-4 h-4"/>
                    <p>{booking.price}</p>
                  </div>
                </div>
                <div className="flex items-center sm:gap-12 gap-2 h-full">
                  <div>
                    <p className="text-xs sm:text-sm text-blue-500">FROM</p>
                    <p className="font-semibold text-[#5B4B49] text-center text-xs sm:text-sm dark:text-gray-400">
                      {formatDateTime(booking.start)} {booking.startTime}
                    </p>
                  </div>
                  <ArrowRight className="mt-4 stroke-0 sm:w-12 w-8 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] fill-blue-400 flex-shrink-0" />
                  <div>
                    <p className="sm:text-sm text-xs text-blue-500">TO</p>
                    <p className="font-semibold text-[#5B4B49] text-center text-xs sm:text-sm dark:text-gray-400">
                      {formatDateTime(booking.end)} {booking.endTime}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-center flex flex-col items-center p-4 max-sm:p-2  border-r border-border">
                <div className="relative sm:w-24 flex items-center sm:h-20 rounded-md border border-border w-16 h-12 mb-2">
                  {booking.carImageUrl ? (
                    <Image
                      src={booking.carImageUrl}
                      alt={booking.carName}
                      fill
                      priority={true}
                      sizes={"6"}
                      className="object-cover rounded w-full"
                    />
                  ) : (
                    <CarIcon className="w-full dark:stroke-blue-200  dark:fill-blue-200 p-1 stroke-black fill-black" />
                  )}
                </div>
                
              </div>
            </div>
            <div className="p-3 max-sm:p-2 flex bg-gray-200 dark:bg-muted items-center text-green-600 dark:text-green-400 gap-2">
              <CarIcon className="w-8 h-3 stroke-green-600 dark:stroke-green-400 fill-green-600 dark:fill-green-400 stroke-[4px]" />
              <p className="text-sm max-sm:text-xs ">
                {getTimeUntilBooking(booking.start, booking.status)}
              </p>
            </div>
          </CardContent>
        </Link>
      </Card>
    </div>
  );
};
