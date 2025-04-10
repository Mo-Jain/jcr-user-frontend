"use client"

import { useEffect, useState } from "react"
import { differenceInDays } from "date-fns"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/datepicker"
import AddTime from "@/components/add-time"
import Price from "@/public/price-tag.svg";
import Fuel from "@/public/fuel.svg";
import Seats from "@/public/seats.svg";
import Gear from "@/public/gear.svg"
import { Car } from "@/lib/types"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import { useParams, useRouter } from "next/navigation"
import { useSearchStore } from "@/lib/store"
import { calculateCost, cn } from "@/lib/utils"
import LoadingScreen from "@/components/loading-screen"
import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input"
import BackButton from "@/public/back-button.svg";
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import LocationIcon from "@/public/location.svg"
import AddressDialog from "@/components/address/AddressDialog"
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import BookingIcon from "@/public/online-booking.svg";

export default function CarBookingPage() {
    const [car, setCar] = useState<Car | null>(null);
    const {id} = useParams();
    const {startDate,endDate,startTime,endTime} = useSearchStore();
    const [newStartDate, setNewStartDate] = useState<Date>(startDate);
    const [newEndDate, setNewEndDate] = useState<Date>(endDate ? endDate : startDate);
    const [newStartTime, setNewStartTime] = useState<string>(convertTime(startTime));
    const [newEndTime, setNewEndTime] = useState<string>(convertTime(endTime));
    const [deliveryOption, setDeliveryOption] = useState<"pickup" | "home delivery">("pickup");
    const router = useRouter();
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [isLoading,setIsLoading] = useState(false);
    const [buttonText, setButtonText] = useState<"Available" | "Not available" | "Checking..." | "Please wait">("Available");
    const [address,setAddress] = useState("");
    const officeAddress = "Anant Sky, opp. PINK CITY, nr. Andh Kalyan Kendra, Ghanshyam Nagar, Ranip, Ahmedabad, Gujarat 382480, India"
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [distance, setDistance] = useState("");
    const [distanceError, setDistanceError] = useState("");
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    // Calculate total days and amount
    const totalDays = newStartDate && newEndDate ? differenceInDays(newEndDate, newStartDate) + 1 : 0
    useEffect(() => {
        if(car){
            const cost = calculateCost(newStartDate, newEndDate, newStartTime, newEndTime, car.price);
            
            setTotalAmount(deliveryOption === "home delivery" ? cost + 1000 : cost);
        }
      }, [newStartDate, newEndDate, newStartTime, newEndTime,car?.price,deliveryOption,car]);

    useEffect(() => {
      if(distance === ""){
        setDistanceError("Please enter distance");
      }
      else if(Number(distance) > 10){
        setDistanceError("Distance should be less than 10km");
      }
      else{
        setDistanceError("");
      }
    }, [distance]);

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

      useEffect(() => {
        const fetchData = async () => {
            if(!id) return;
          try {
            const resCar = await axios.get(`${BASE_URL}/api/v1/car/${id}`, {
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setCar(resCar.data.car);
          } catch (error) {
            console.log(error);
            router.push("/car-not-found");
          }
        };
        fetchData();
      }, [id,router,setCar]);

      useEffect(() => {
        const fetchData = async () => {
            if(!id) return;
          try {
            const resCar = await axios.get(`${BASE_URL}/api/v1/customer/me`, {
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setAddress(resCar.data.customer.address);
          } catch (error) {
            console.log(error);
          }
        };
        fetchData();
        //eslint-disable-next-line react-hooks/exhaustive-deps
      }, [setAddress]);

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

      const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if(!car) return;
        if (!validateDate()) {
          toast({
            description: `End date can't be equal or before start date`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
          });
          return;
        }
        setIsLoading(true);
        setButtonText("Please wait")
        try {
          await axios.post(
            `${BASE_URL}/api/v1/customer/booking`,
            {
              startDate: newStartDate.toLocaleDateString("en-US"),
              endDate: newEndDate.toLocaleDateString("en-US"),
              startTime: newStartTime,
              endTime: newEndTime,
              allDay: false,
              carId:car.id,
              totalAmount: totalAmount,
              type: deliveryOption
            },
            {
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ` + localStorage.getItem("token"),
              },
            },
          );
          setIsLoading(false);
          toast({
            description: `Booking Requested successfully`,
            className:
              "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          });
          router.push("/bookings");
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

      useEffect(() => {
        const checkCarAvailability = async () => {
          if(!car) return;
          if(!newStartDate || !newEndDate || !newStartTime || !newEndTime) return;
          if(newStartDate.getTime() > newEndDate.getTime()) {
            setNewEndDate(newStartDate)
            return;
          }
          if(newStartDate.getTime() === newEndDate.getTime() && new Date(newStartTime).getTime() >= new Date(newEndTime).getTime()) {;
            setNewEndDate(newStartDate)
            return;
          }
          setIsLoading(true);
          setButtonText("Checking...");
          try {
            const user:string = "customer";
            const response = await axios.get(`${BASE_URL}/api/v1/car/availability/${car.id}?startDate=${newStartDate}&endDate=${newEndDate}&startTime=${newStartTime}&endTime=${newEndTime}&user=${user}`,
            {
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ` + localStorage.getItem("token"),
              },
            }
            );
            if (response.data.isAvailable) {
              setButtonText("Available");
            } else {
              setButtonText("Not available");
            }
          } catch (error) {
            console.log(error);
            toast({
              description: "Something went wrong",
              className:
                "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
              variant: "destructive",
              duration: 2000,
            });
            setNewStartDate(startDate);
            setNewStartTime(convertTime(startTime));
            setNewEndDate(endDate ? endDate : startDate);
            setNewEndTime(convertTime(endTime));
            setIsLoading(false);
            setButtonText("Available");
          }
          setIsLoading(false);
        }
        checkCarAvailability();
        //eslint-disable-next-line react-hooks/exhaustive-deps
      }, [newStartDate, newStartTime, newEndDate, newEndTime, startDate, startTime, endDate, endTime]);
    

    if(!car) return <LoadingScreen/>

  return (
    <div className="relative grid md:grid-cols-2 gap-2 md:gap-8 w-full bg-background mt-20 sm:mt-14 p-2 py-3 max-sm:px-1 max-sm:pb-14">
      {/* Car Details Card */}
          <AddressDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            address={address}
            setAddress={setAddress}
          />

          <AlertDialog open={confirmationDialogOpen} onOpenChange={setConfirmationDialogOpen}>
            <AlertDialogContent className="bg-muted border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Request Booking</AlertDialogTitle>
            </AlertDialogHeader>
              <div className="flex items-center gap-4 w-full">
                <BookingIcon
                    className={`w-12 h-12 sm:w-16 sm:h-16 stroke-[2px] fill-gray-400 stroke-gray-400`}
                  />
                <span>You have successfully requested booking, we will notify you once the owner confirms the booking.</span>
              </div>
            <AlertDialogFooter>
              <span>Thanks for using Jain Car Rentals!</span>
            </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      <div className="flex flex-col gap-2 w-full ">
        <div className="flex items-center gap-2 sm:gap-4 w-full">
          <div
            onClick={() => router.push("/")}
            className=" p-2 flex bg-transparent active:scale-95 w-fit rounded-md cursor-pointer shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card "
          >
            <BackButton className="h-6 w-6 stroke-0 fill-gray-800 dark:fill-blue-300" />
          </div>
          <h1 className="text-2xl font-bold">Book Car</h1>
        </div>
        <div className="p-2 rounded-md border bg-muted border-border">
          <h3 className="text-lg font-semibold mb-1 w-full">Our location</h3>
          <div className="flex gap-2 items-center">
            <div className="h-16 w-16 sm:w-24 sm:h-24 flex-shrink-0 rounded-sm border border-black/10 dark:border-white/15">
              <div className="w-full h-full rounded-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3514.7196542510137!2d72.57509201236613!3d23.08502771929644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e832a8a3e9c1f%3A0x580dc04c9b54a634!2sAnant%20Sky!5e0!3m2!1sen!2sin!4v1742395797610!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="w-full h-full rounded-sm"
                />
              </div>
            </div>
            <Link href={mapUrl} className="text-sm text-blue-500 dark:text-blue-400" target="_blank" rel="noopener noreferrer">
              {officeAddress}
            </Link>
          </div>
        </div>
        <Card className="h-fit w-full bg-muted border-border rounded-md">
          <CardHeader className="max-md:p-2 ">
          <div className="flex items-center gap-2 sm:gap-4 ">
              <div className="h-fit">
                <CardTitle>{car.brand + " " + car.model}</CardTitle>
                <CardDescription>Premium Sedan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 max-md:flex items-center justify-between max-md:p-2">
            <div className="rounded-md overflow-hidden max-md:w-[43%]">
              <Image
                src={car.photos[0] || "/placeholder.svg"}
                alt={car.brand + " " + car.model}
                width={400}
                height={200}
                className="w-full h-full max-h-[150px] md:max-h-[360px] object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 w-fit">
              <div className="flex items-center gap-2">
                  <Fuel className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[12px] stroke-gray-600 fill-gray-600 dark:stroke-gray-400 dark:fill-gray-400" />
                  <div>
                      <p className="text-sm font-medium">Fuel Type</p>
                      <p className="text-sm text-gray-500">{car.fuel}</p>
                  </div>
              </div>

              <div className="flex items-center gap-2">
                  <Seats className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[12px] stroke-gray-600 fill-gray-600 dark:stroke-gray-400 dark:fill-gray-400" />
                  <div>
                      <p className="text-sm font-medium">Seats</p>
                      <p className="text-sm text-gray-500">{car.seats}</p>
                  </div>
              </div>

              <div className="flex items-center gap-2">
                  <Gear className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[12px] stroke-gray-600 fill-gray-600 dark:stroke-gray-400 dark:fill-gray-400" />
                  <div>
                      <p className="text-sm font-medium">Transmission</p>
                      <p className="text-sm text-gray-500">{car.gear}</p>
                  </div>
              </div>

              <div className="flex items-center gap-2">
                  <Price className="h-6 w-6 mr-[-2px] flex-shrink-0 stroke-[12px] stroke-gray-600 fill-gray-600 dark:stroke-gray-400 dark:fill-gray-400" />
                  <div>
                      <p className="text-sm font-medium">Daily Rate</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                          <IndianRupee className="w-4 h-4"/>
                          {car.price.toFixed(0)}
                      </p>
                  </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Booking Form Card */}
      <Card className="bg-muted border-border rounded-md overflow-x-hidden flex flex-col justify-between">
        <div className="p-2 rounded-md border border-border m-2">
          <h3 className="text-lg font-semibold mb-1">Your address</h3>
          <div className="flex gap-2 items-center">
            <LocationIcon className="h-6 w-6 flex-shrink-0 stroke-[6px] stroke-gray-600 fill-gray-600 dark:stroke-gray-400 dark:fill-gray-400" />
            {address || address !== "" ?
              <span className="text-sm">
                {address}
              </span>
              :
              <div className="flex items-center justify-between w-full">
                <span className="italic text-gray-500">No address added</span>
              </div>
            }
            <div className="p-1 px-3 text-sm rounded-full bg-primary" onClick={() => setIsDialogOpen(true)}>{address || address !== "" ? "Edit" : "Add Address"}</div>

          </div>
        </div>
        <CardHeader className="p-0">
          <CardTitle></CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
          <div className="w-full relative overflow-hidden h-full">
            <div className="flex transition-transform duration-500 ease-in-out h-full">
              <div className="w-full flex-shrink-0 h-full">
                <CardContent className="w-full flex flex-col justify-between max-sm:gap-4 h-full sm:pt-16">
                {/* Date Selection */}
                  <div className="flex items-center justify-between ">
                    <div className="grid gap-4 z-0">
                      <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                          <div className="flex space-x-4">
                              <div className="">
                                <DatePicker
                                  className="max-sm:w-[120px]"
                                  date={newStartDate}
                                  setDate={setNewStartDate}
                                  dateType="start"
                                />
                              </div>
                              <div className=" mx-2 z-0">
                                <AddTime
                                  className="max-sm:px-4 px-2 w-fit "
                                  selectedTime={newStartTime}
                                  setSelectedTime={setNewStartTime}
                                />
                              </div>
                          </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="endDate">End Date</Label>
                          <div className="flex space-x-4">
                              <div className="">
                              <DatePicker
                                  className="max-sm:w-[120px]"
                                  date={newEndDate}
                                  setDate={setNewEndDate}
                                  dateType="start"
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
                      </div>
                    </div>
                    <div>
                      <p className="text-xs">Car availability:</p>
                      <span 
                      className={cn("text-sm rounded-full px-2 py-[2px] bg-green-400 dark:bg-green-500 whitespace-nowrap",
                        buttonText === "Not available" && "bg-red-400 dark:bg-red-400",
                        buttonText === "Checking..." && "bg-blue-400 dark:bg-blue-400",
                      )}
                      >{buttonText}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <RadioGroup value={deliveryOption} onValueChange={(value) => setDeliveryOption(value as "pickup" | "home delivery")} className="flex flex-col space-y-2">
                      <div>
                      <div className="flex items-start space-x-2 w-full justify-between">
                        <div>
                          <div className="flex items-center space-x-2 w-full">
                            <RadioGroupItem value="home delivery" id="home" />
                            <Label htmlFor="home" className="cursor-pointer" >
                              <span>Home Delivery </span> 
                              <p className="text-xs italic w-full">Avaliable within 10km of our location</p>
                            </Label>
                          </div>
                        </div>
                        <span className="font-bold flex items-center gap-1">
                          <IndianRupee className="w-4 h-4"/>
                          1000
                        </span>
                      </div>
                      {/* Distance */}
                      {deliveryOption ==="home delivery" &&
                      <div className="ml-4">
                        <div className="flex items-start w-full">
                          <span className="text-xs">How far are you from us(in km)</span>
                          <span className="text-[10px] text-red-500">*</span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 w-full">
                            <Input 
                              type="text" 
                              id="distance" 
                              placeholder="Enter distance"
                              className="w-1/2" 
                              value={distance} 
                              maxLength={2}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setDistance(value);
                                }
                              }} />
                              <span className="text-sm">Kms</span>
                            </div>
                            {distanceError && <p className="text-xs text-red-500">{distanceError}</p>}
                            <span className="text-xs">Note: Take help of our location mentioned at top</span>
                          </div>
                        </div>
                        }
                      </div>
                      <div className="flex items-center space-x-2 w-full justify-between">
                        <div className="flex items-center space-x-2 w-full">
                          <RadioGroupItem value="pickup" id="pick-up" />
                          <Label htmlFor="pick-up" className="cursor-pointer">
                            Pick up from our location
                          </Label>
                        </div>
                        <span className="font-bold flex items-center gap-1">
                          <IndianRupee className="w-4 h-4"/>
                          0
                        </span>
                      </div>
                    </RadioGroup>
                      
                  </div>

                  {/* Booking Summary */}
                  <div className="rounded-lg bg-gray-50 dark:bg-card p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Daily Rate:</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <IndianRupee className="w-4 h-4"/>
                        {car.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Duration:</span>
                      <span className="text-sm font-medium">{totalDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Delivery charges:</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <IndianRupee className="w-4 h-4"/>
                        {deliveryOption === "home delivery" ? 1000 : 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 mt-2">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold flex items-center gap-1">
                        <IndianRupee className="w-4 h-4"/>
                        {totalAmount.toFixed(0)}</span>
                    </div>
                  </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={buttonText !== "Available"}
                        className={`bg-blue-600 active:scale-95 dark:text-white hover:bg-opacity-80 w-full disabled:bg-opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoading ?
                          <>
                            <div className="flex items-end py-1 h-full">
                              <span className="sr-only">Loading...</span>
                              <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.4s]"></div>
                              <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.2s]"></div>
                              <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                            </div>
                          </>
                          :
                          <span>Request Booking</span>
                        }
                      </Button>
                </CardContent>
              </div>
            </div>
          </div>
      </Card>
    </div>
  )
}

