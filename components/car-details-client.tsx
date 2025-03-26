"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, IndianRupee, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useEffect, useRef, useState } from "react";
import BackArrow from "@/public/back-arrow.svg";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import LoadingScreen from "./loading-screen";
import { toast } from "@/hooks/use-toast";
import { useCarStore, useFavoriteStore } from "@/lib/store";
import { Car } from "@/lib/types";
import { AddBookingDialog } from "./add-booking";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils";

const CARD_WIDTH = 264; // Width of each CarCard
const SCROLL_DURATION = 300; 

export function CarDetailsClient({ carId }: { carId: number }) {
  const [car, setCar] = useState<Car | null>(null);
  const router = useRouter();
  const [isFavorite,setIsFavorite] = useState(false);
  const {favoriteCars,setFavoriteCars} = useFavoriteStore();
  const {cars,setCars} = useCarStore();
  const [isBookingOpen,setIsBookingOpen] = useState(false);
  const [isPreviewOpen,setIsPreviewOpen] = useState(false);
  const [scrollValue,setScrollValue] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [previewImage,setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCar = await axios.get(`${BASE_URL}/api/v1/car/${carId}`, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCar(resCar.data.car);
        setPreviewImage(resCar.data.car.photos[scrollValue]);
        setIsFavorite(resCar.data.car.favorite);
      } catch (error) {
        console.log(error);
        router.push("/car-not-found");
      }
    };
    fetchData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId,router]);

  if (!car) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  const smoothScroll = (targetScroll: number) => {
      if (!scrollRef.current) return;

      const start = scrollRef.current.scrollLeft;
      const startTime = performance.now();

      const animateScroll = (currentTime: number) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / SCROLL_DURATION, 1); // Ensure progress is between 0 and 1
          const easeInOutQuad = progress < 0.5 
              ? 2 * progress * progress 
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          scrollRef.current!.scrollLeft = start + (targetScroll - start) * easeInOutQuad;

          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
      };

      requestAnimationFrame(animateScroll);
  };

  const handleScroll = (e:React.MouseEvent<HTMLDivElement, MouseEvent>,direction: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();
    if (!scrollRef.current) return;
      let newScrollPosition;
      if(direction === "left"){
        newScrollPosition = scrollRef.current.scrollLeft - CARD_WIDTH
        if(scrollValue !== 0) {
          setPreviewImage(car.photos[scrollValue-1]);
          setScrollValue(scrollValue - 1);
        }
      }else {
        newScrollPosition = scrollRef.current.scrollLeft + CARD_WIDTH;
        if(scrollValue !== car.photos.length-1) {
          setPreviewImage(car.photos[scrollValue+1]);
          setScrollValue(scrollValue + 1);
        }
      }
      smoothScroll(newScrollPosition);
  };

  const handleFavoriteClick = async(e:React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const carId = car.id;
    if(!isFavorite){
      setIsFavorite(true);
      if(!favoriteCars.find(car => car.id === carId)){
        setFavoriteCars([...favoriteCars,{...car,favorite:true}]);
      }
      setCars(cars.map(car => car.id === carId ? {...car,favorite:true} : car));
      try{
        await axios.post(
          `${BASE_URL}/api/v1/customer/favorite-car/${carId}`,
          {
              
          },
          {
              headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
              },
          },
          );
      }
      catch(error){
        console.log(error);
        toast({description:"Something went wrong",variant:"destructive",duration:2000});
        setFavoriteCars(favoriteCars.filter(car => car.id !== carId));
      }
    }
    else{
      setIsFavorite(false);
      setCars(cars.map(car => car.id === carId ? {...car,favorite:false} : car));
      setFavoriteCars(favoriteCars.filter(car => car.id !== carId));
      try{
        await axios.delete(`${BASE_URL}/api/v1/customer/favorite-car/${carId}`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
      }
      catch(error){
        console.log(error);
        toast({description:"Something went wrong",variant:"destructive"});
        setFavoriteCars(favoriteCars);
      }
    }
  };

  return (
    <div>
      <AddBookingDialog 
              car={car} 
              isOpen={isBookingOpen} 
              setIsOpen={setIsBookingOpen}
              />
      <div className="flex items-center mt-20 sm:mt-12 justify-between border-b border-gray-300 dark:border-zinc-700">
        <div
          className="mr-2 rounded-md font-bold  cursor-pointer hover:bg-gray-200 dark:hover:bg-muted"
          onClick={() => router.back()}
        >
          <div className="h-12 w-12 flex justify-center items-center rounded-full  ">
            <div className="h-9 w-9 p-1 rounded-full">
              <BackArrow className="h-7 w-7 stroke-0 fill-gray-800 dark:fill-blue-300" />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg text-center font-semibold">{car?.brand} {car?.model}</h2>
          <p className="text-xs text-center">Car ID: {car?.id}</p>
        </div>
        <div className="text-center px-2">
          <Star className={`w-6 h-6 sm:w-8 cursor-pointer sm:h-8 ${isFavorite && "fill-blue-400 stroke-blue-400"}`} 
          onClick={handleFavoriteClick}/>
        </div>
      </div>
      <div>
        <div className="flex flex-col sm:flex-row gap-2 sm:border-b sm:items-center border-border h-full">
          <div className=" flex flex-col sm:border-r border-border px-1 justify-center sm:py-2 items-center w-full min-h-full">
            <div className="relative w-full max-sm:px-2">
              <div 
              onClick={() => {
                setIsPreviewOpen(true);
              }}
              className="h-[240px] sm:h-[280px] cursor-pointer sm:mx-2 grid grid-cols-3 p-1 gap-1 border-2 border-black/20 dark:border-white/30 rounded-md ">
                <Image
                  src={car.photos[0] || "/placeholder.svg"}
                  alt={`${car.brand} ${car.model}`}
                  width={2000}
                  height={1000}
                  className={cn("col-span-2 rounded-md h-full max-w-full max-h-full max-sm:min-h-[230px] object-cover",
                    car.photos.length < 2 && "col-span-3"
                  )}
                />
                {car.photos.length >= 2 && 
                <div className="w-full h-full flex flex-col gap-1">
                  {car.photos[1] &&
                  <div className="w-full h-full">
                      <Image
                        src={car.photos[1] || "/placeholder.svg"}
                        alt={`${car.brand} ${car.model}`}
                        width={2000}
                        height={1000}
                        className="h-full w-full object-cover"
                      />
                  </div>
                      }
                  {car.photos[2] &&
                  <div className="w-full relative h-full ">
                      <Image
                        src={car.photos[2] || "/placeholder.svg"}
                        alt={`${car.brand} ${car.model}`}
                        width={2000}
                        height={1000}
                        className="h-full w-full object-cover"
                      />
                      <div className="w-full absolute text-white inset-0 h-full bg-black/10 hover:bg-black/20 flex items-center justify-center">
                        <span>+{car.photos.length - 2} more</span>
                      </div>
                  </div>
                      }
                </div>
                }
              </div>
            </div>
          </div>
          <div className="w-full h-full">
            <div className="h-full">
              <section className="flex flex-col justify-between px-2 py-2 sm:py-4 pb-0 h-full max-sm:border-t border-gray-200 dark:border-zinc-700 ">
                <h2 className="text-lg font-semibold mb-4 ">Car Details</h2>
                <div className="h-full flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <p className="text-sm text-blue-500 mb-1">Brand</p>
                      <span className="font-medium">{car.brand}</span>
                      <p className="text-sm text-blue-500 mb-1">Model</p>
                      <span className="font-medium">{car.model}</span>
                      <div>
                        <p className="text-sm text-blue-500 mb-1">24hr Price</p>
                          <span className="font-medium flex items-center text-sm">
                            <IndianRupee className="w-4 h-4" /> {car.price}
                          </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-sm text-blue-500 mb-1">Fuel</p>
                      <span className="font-medium">{car.fuel[0].toUpperCase() + car.fuel.slice(1)}</span>
                      <p className="text-sm text-blue-500 mb-1">Seats</p>
                      <span className="font-medium">{car.seats}</span>
                      <p className="text-sm text-blue-500 mb-1">Tranmission</p>
                      <span className="font-medium">{car.gear[0].toUpperCase() + car.gear.slice(1)}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-4 w-full sm:w-1/2">
          <Button 
          onClick={() => setIsBookingOpen(true)}
          className="w-full ">Book Now</Button>
        </div>
      </div>
      <AlertDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <AlertDialogContent className="max-w-3xl border-border max-sm:py-2 max-sm:px-0 z-[999]">
        <AlertDialogHeader>
          <AlertDialogTitle>Photos Preview</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <div 
          ref= {scrollRef}
          className="relative flex justify-center">
            {car?.photos && previewImage && (
          <>
            <Image
                src={previewImage || "/placeholder.svg"}
                alt={`${car.brand} ${car.model}`}
                width={2000}
                height={1000}
                className=" max-h-[85vh] sm:max-h-[60vh] w-full object-cover sm:w-[70%]"
              />
              <div className="absolute bottom-0 left-0 w-full h-fit flex items-center justify-center">
                <div className="flex justify-center items-end h-fit gap-1">
                  {car.photos.map((image,index) => (
                    <div key={index+image} 
                    onClick={() => {
                      setPreviewImage(car.photos[index]);
                      setScrollValue(index)
                    }}
                    className={`${scrollValue===index ? "w-4 h-4 bg-white" : "w-3 h-3 bg-blue-400"} cursor-pointer border-2 border-blue-400 rounded-full transition-all duration-300 ease-in-out`}/>
                  ))}
                </div>
              </div>
              <div 
                onClick={(e) => handleScroll(e,"left")} 
                className="absolute border border-transparent active:scale-[0.95] top-0 opacity-60 hover:opacity-100 -left-3 flex items-center justify-center h-full rounded-sm">
                    <ChevronLeft
                    className="w-12 h-12 p-0 text-blue-400"/>
                </div>
              <div 
                onClick={(e) => handleScroll(e,"right")} 
                className="absolute border border-transparent active:scale-[0.95] top-0 opacity-60 hover:opacity-100 -right-3 flex items-center justify-center h-full rounded-sm">
                    <ChevronRight className="w-12 h-12 p-0 text-blue-400 "/>
              </div>
          </>
          )}
        </div>
        <AlertDialogFooter className="flex flex-row justify-center w-full">
          <AlertDialogAction className="select-none max-sm:w-1/2">Close</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
