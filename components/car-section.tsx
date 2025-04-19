"use client";

import { CarCard } from "./car-card";
import Link from "next/link";
import {  useCarStore, useFilteredCarStore, useSearchStore, useUserStore } from "@/lib/store";
import ArrowRight from "@/public/right_arrow.svg";
import FlexLayoutCars from "./flex-layout-cars";
import LoadingScreen from "./loading-screen";
import Loader from "./loader";
import { useEffect, useState } from "react";

export function CarSection() {
  const { name } = useUserStore();
  const {cars,isCarLoading} = useCarStore();
  const {isSearching} = useSearchStore();
  const {startDate,endDate,startTime,endTime} = useSearchStore();
  const {filteredCars,isLoading} = useFilteredCarStore();
  const [isPageLoading,setIsPageLoading] = useState(false);

  function formatDateTime(dateString: Date | null) {
    if(!dateString) return "";
    return dateString.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  useEffect(() => {
      if(isPageLoading){
        document.documentElement.classList.add("no-scroll");
      }else {
        document.documentElement.classList.remove("no-scroll");
      }

  
      return () => {
        document.documentElement.classList.remove("no-scroll");
      };
      }, [isPageLoading]);

  if(isCarLoading ) 
    return <LoadingScreen/>;

  return (
    <div className="mx-2">
      {isPageLoading &&
      <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-[100]">
          <Loader/>
      </div>
      }
      
        <div >
          {isSearching &&
          <section className="py-6 mb-1 bg-white bg-opacity-30 dark:bg-opacity-10 rounded-t-md backdrop-blur-lg sm:px-4 px-2">
            <div className="flex flex-col w-full pb-3 sm:gap-4 border-b border-border">
              <h1
                style={{ fontFamily: "var(--font-equinox), sans-serif" }}
                className="sm:text-3xl text-xl font-black font-myfont w-fit whitespace-nowrap "
              >
                Avaliable Cars
              </h1>
              <div className="flex items-center gap-2 ">
                <div className="">
                  <p className="font-semibold sm:whitespace-nowrap text-center text-xs sm:text-sm">
                    {formatDateTime(startDate)} {startTime}
                  </p>
                </div>
                <ArrowRight className="stroke-0 sm:w-12 w-8 filter drop-shadow-[2px_2px_rgba(0,0,0,0.1)] fill-blue-400 flex-shrink-0" />
                <div className="">
                  <p className="font-semibold sm:whitespace-nowrap text-center text-xs sm:text-sm">
                    {formatDateTime(endDate)} {endTime}
                  </p>
                </div>
              </div>
            </div>
            {!isLoading ?
            <div
              key={cars.length}
              className="grid grid-cols-2 mt-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
            >
              {filteredCars.map((car,index) => (
                <div key={index} onClick={() => setIsPageLoading(true)}>
                  <Link
                      href={`/car/${car.id}`}
                      
                      className="transform transition-all duration-300 hover:scale-105"
                    >
                      <CarCard
                        car={car}
                        flexlayout={false}
                      />
                  </Link>
                </div>
              ))}
            </div>
            :
            <div className="flex justify-center items-center w-full min-h-[185px] sm:min-h-[300px]">
              <Loader/>
            </div>
            }
          </section>
          }
          <section className={`py-6 bg-white bg-opacity-30 dark:bg-opacity-10 ${!isSearching && "rounded-t-md"} backdrop-blur-lg sm:px-4 px-2`}>
            <h1
              style={{ fontFamily: "var(--font-equinox), sans-serif" }}
              className="sm:text-3xl text-xl font-black font-myfont w-full pb-4 border-b border-border whitespace-nowrap "
            >
              Cars
            </h1>
            <FlexLayoutCars cars={cars}/>
          </section>
        </div>
    </div>
  );
}
