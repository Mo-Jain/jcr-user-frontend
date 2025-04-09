import Image from "next/image";
import { ChevronLeft, ChevronRight, IndianRupee, Star } from "lucide-react";
import { useCarStore, useFavoriteStore, useUserStore } from "@/lib/store";
import { Car } from "@/lib/types";
import { BASE_URL } from "@/lib/config";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const CARD_WIDTH = 264; // Width of each CarCard
const SCROLL_DURATION = 300; 
export function CarCard({ car,flexlayout}: {
  car:Car,
  flexlayout:boolean,
}) {
  const {favoriteCars,setFavoriteCars} = useFavoriteStore();
  const {cars,setCars} = useCarStore();
  const {name} = useUserStore();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollValue,setScrollValue] = useState(0);
  const [previewImage,setPreviewImage] = useState<string | null>(car.photos ? car.photos[scrollValue]: null);

  useEffect(() => {
    setPreviewImage(car.photos ? car.photos[scrollValue]: null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car.photos]);

  const handleFavoriteClick = async(e:React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    const carId = car.id;
    if(!car.favorite){
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
  const handleBookClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if(!name){
      router.push("/login");
      return;
    }
    router.push('/bookings/book-car/'+car.id);      
  };
  

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

  const handleScrollBarClick = (e:React.MouseEvent<HTMLDivElement, MouseEvent>,index:number) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewImage(car.photos[index]);
    setScrollValue(index);
  }

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
  return (
    <>
    <div onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
    }}>
    </div>
    <div 
    // style={{ fontFamily: "var(--font-leoscar), sans-serif" }}
    className="w-full z-0 relative z-0">
      <div className={cn("py-2 px-1  z-0 border border-border shadow-sm  bg-white dark:bg-muted rounded-md cursor-pointer",
        flexlayout && "w-[165px] sm:w-[256px]",
      )}>
        <div className="flex flex-col relative justify-between gap-1 sm:px-1 rounded-sm z-0">
          <div 
          ref={scrollRef}
          className={cn("relative border px-1 border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 rounded-lg z-0 flex-shrink-0 h-24 sm:h-48",
            flexlayout && "w-[150px] max-sm:px-1 sm:w-[238px]",
          )}>
            {previewImage &&
            <Image
              src={previewImage || "/placeholder.svg"}
              alt={car.brand + " " + car.model}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-lg h-fit max-w-full max-h-full object-contain"
            />}
              {car.photos && car.photos.length > 1 &&
              <>
              <div className="absolute bottom-0 left-0 w-full h-fit flex items-center justify-center">
                <div className="flex justify-center items-end h-fit gap-1">
                  {car.photos.map((image,index) => (
                    <div key={index+image} 
                    onClick={(e) => handleScrollBarClick(e,index)}
                    className={`${scrollValue===index ? "w-3 h-3 bg-white" : "w-2 h-2 bg-blue-400"} border-2 border-blue-400 rounded-full transition-all duration-300 ease-in-out`}/>
                  ))}
                </div>
              </div>
                <div 
                  onClick={(e) => handleScroll(e,"left")} 
                  className="absolute border border-transparent active:border-blue-400 top-0 opacity-60 hover:opacity-100 -left-1 flex items-center justify-center h-full rounded-sm">
                      <ChevronLeft
                      className="w-7 h-10 p-0 text-blue-400"/>
                  </div>
                <div 
                  onClick={(e) => handleScroll(e,"right")} 
                  className="absolute border border-transparent active:border-blue-400 top-0 opacity-60 hover:opacity-100 -right-1 flex items-center justify-center h-full rounded-sm">
                      <ChevronRight className="w-7 h-10 p-0 text-blue-400 "/>
                </div>
              </>}
              
          </div>
          <div className="w-full sm:px-2 flex flex-col justify-around items-start gap-1 text-xs sm:text-sm  min-h-[96px] sm:min-h-[100px] flex flex-col">
            <h3 className="w-full overflow-hidden text-start font-semibold whitespace-wrap">
              <span 
              style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
              className="max-w-full whitespace-wrap">{(car.brand + " " + car.model).toLocaleUpperCase()}</span>
            </h3>
            <div className="w-full">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center max-sm:mb-1">
                  <IndianRupee className="h-4 w-4 flex-shrink-0"/>
                  <span className="w-full text-center">{car.price}/day </span>
                </div>
                <div/>
                <span className="w-full text-center">{car.gear[0].toUpperCase() + car.gear.slice(1)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="w-full flex items-center">
                  <span className="">{car.seats} Seats</span>
                </div>
                <div 
                onClick = {handleBookClick}
                style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                className="text-xs sm:text-sm py-1 flex items-center justify-center text-center text-white active:scale-[0.95] bg-blue-400 rounded-full h-fit">
                  Book</div>
                <div className="w-full flex items-center justify-center">
                  <Star 
                  onClick={(e) => handleFavoriteClick(e)}
                  className={`h-4 w-4 ${car.favorite && "stroke-blue-400 fill-blue-400"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
