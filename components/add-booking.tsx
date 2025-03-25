"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Price from "@/public/price-tag.svg";
import { DatePicker } from "./ui/datepicker";
import AddTime from "./add-time";
import CarFrontIcon from "@/public/car-front.svg";
import Calendar from "@/public/date-and-time.svg";
import Rupee from "@/public/rupee-symbol.svg";
import Booking from "@/public/online-booking.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import { toast } from "@/hooks/use-toast";
import { Car } from "@/lib/types";
import { useSearchStore } from "@/lib/store";

interface FormErrors {
  [key: string]: string;
}

export function calculateCost(
  startDate: Date,
  endDate: Date,
  startTime: string,
  endTime: string,
  pricePer24Hours: number,
) {
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  startDateTime.setHours(startHour, startMinute, 0, 0);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  const timeDifference = endDateTime.getTime() - startDateTime.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60);
  const cost = (hoursDifference / 24) * pricePer24Hours;

  return Math.floor(cost);
}
function convertTime(time:string){
  const [hour, minute] = time.split(" ")[0].split(':').map(Number);
  const period = time.split(" ")[1];
  if(period === "PM") {
      return `${hour+12}:${minute}`
  }
  else{
      if (hour < 10 ) return `0${hour}:${minute}`
      return `${hour}:${minute}`
  }
}
export function AddBookingDialog({
  isOpen,
  setIsOpen,
  car
}: {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  car: Car,
}) {
  const {startDate,endDate,startTime,endTime} = useSearchStore();
  const [newStartDate, setNewStartDate] = useState<Date>(startDate);
  const [newEndDate, setNewEndDate] = useState<Date>(endDate ? endDate : startDate);
  const [newStartTime, setNewStartTime] = useState<string>(convertTime(startTime));
  const [newEndTime, setNewEndTime] = useState<string>(convertTime(endTime));
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cost = calculateCost(newStartDate, newEndDate, newStartTime, newEndTime, car.price);
    setTotalAmount(cost);
  }, [newStartDate, newEndDate, newStartTime, newEndTime,car.price]);

  useEffect(()=> {
    setNewStartDate(startDate);
    setNewEndDate(endDate ? endDate : startDate);
    setNewStartTime(convertTime(startTime));
    setNewEndTime(convertTime(endTime));
  },[startDate,endDate,startTime,endTime])

  const validateDate = () => {
    if (newStartDate < newEndDate) return true;

    const startDateTime = new Date(newStartDate);
    const endDateTime = new Date(newEndDate);

    const [startHour, startMinute] = newStartTime.split(":").map(Number);
    const [endHour, endMinute] = newEndTime.split(":").map(Number);

    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    return startDateTime < endDateTime;
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (totalAmount === 0) newErrors.totalAmount = "Total Amount can't be zero";
    if (!newStartDate) newErrors.startDate = "This field is mandatory";
    if (!newEndDate) newErrors.endDate = "This field is mandatory";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateDate()) {
      toast({
        description: `End date can't be equal or before start date`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      setErrors((prev) => ({
        ...prev,
        endDate: "End date can't be equal or before start date",
      }));
      return;
    }
    if (!validateForm()) {
      toast({
        description: `Please fill all mandatory fields`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/v1/customer/booking`,
        {
          startDate: newStartDate.toLocaleDateString("en-US"),
          endDate: newEndDate.toLocaleDateString("en-US"),
          startTime: newStartTime,
          endTime: newEndTime,
          allDay: false,
          carId:car.id,
          totalAmount: totalAmount,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        },
      );
      setIsOpen(false);
      setIsLoading(false);
      toast({
        description: `Booking Successfully created`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        description: `Booking failed to create`,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleDateChange = (type: string) => {
    if (type === "start") {
      setErrors((prev) => ({ ...prev, startDate: "" }));
    } else if (type === "end") {
      setErrors((prev) => ({ ...prev, endDate: "" }));
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] max-sm:p-2 max-sm:py-4 bg-white dark:bg-muted dark:border-zinc-700 md:max-w-[500px] h-[82vh] sm:top-[55%] sm:h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 mt-30 text-blue-700 dark:text-blue-600">
              <Booking className="w-6 h-6 flex-shrink-0 stroke-[6px] stroke-blue-600 fill-blue-600" />
              Add Booking
            </DialogTitle>
          </DialogHeader>
          <form  className="space-y-4">
            <div className="flex items-center gap-4">
              <CarFrontIcon className="w-6 h-4 dark:stroke-blue-200 dark:fill-blue-200 stroke-[6px] stroke-black fill-black flex-shrink-0" />
              <Label htmlFor="car" className="w-1/3">
                Selected car
              </Label>
              <p>{car.brand + " " + car.model}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 flex-shrink-0 fill-black dark:fill-white stroke-black dark:stroke-white stroke-[1px]" />
                <Label className="w-1/3">Date and time</Label>
              </div>
              <div className="flex items-center gap-2 ml-9">
                <Label htmlFor="fromDate" className="w-1/6">
                  From
                </Label>
                <div>
                  <div className="flex space-x-4">
                    <div className="">
                      <DatePicker
                        className="max-sm:w-[120px]"
                        date={newStartDate}
                        setDate={setNewStartDate}
                        handleDateChange={handleDateChange}
                        dateType="start"
                      />
                    </div>
                    <div className=" mx-2">
                      <AddTime
                        className="max-sm:px-4 px-2 w-fit"
                        selectedTime={newStartTime}
                        setSelectedTime={setNewStartTime}
                      />
                    </div>
                  </div>
                  
                </div>
              </div>
              <div className="flex items-center gap-2 ml-9">
                <Label htmlFor="toDate" className="w-1/6">
                  To
                </Label>
                <div>
                  <div className="flex space-x-4">
                    <div className="">
                      <DatePicker
                        className="max-sm:w-[120px]"
                        date={newEndDate}
                        setDate={setNewEndDate}
                        handleDateChange={handleDateChange}
                        dateType="end"
                      />
                    </div>
                    <div className=" mx-2">
                      <AddTime
                        className="max-sm:px-4 px-2 w-fit"
                        selectedTime={newEndTime}
                        setSelectedTime={setNewEndTime}
                      />
                    </div>
                  </div>
                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Price className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[12px] stroke-black fill-black dark:stroke-white dark:fill-white" />
              <Label htmlFor="price" className="w-1/3">
                Price
              </Label>
              <p>{car.price}/day </p>
            </div>

            <div className="flex items-center gap-4">
              <Rupee className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[2px] stroke-black fill-black dark:stroke-white dark:fill-white" />
              <Label htmlFor="totalAmount" className="w-1/3">
                Total amount
              </Label>
              <p>{totalAmount}</p>
              {errors.totalAmount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.totalAmount}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`bg-blue-600 active:scale-95 dark:text-white hover:bg-opacity-80 w-full ${isLoading && "cursor-not-allowed opacity-50"}`}
              >
                {isLoading ? (
                  <>
                    <span>Please wait</span>
                    <div className="flex items-end py-1 h-full">
                      <span className="sr-only">Loading...</span>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                    </div>
                  </>
                ) : (
                  <span>Book Now</span>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                }}
                className="border active:scale-95 bg-transparent hover:bg-gray-300 dark:hover:bg-zinc-600 border-input w-full w-full"
              >
                Cancel
              </Button> 
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
