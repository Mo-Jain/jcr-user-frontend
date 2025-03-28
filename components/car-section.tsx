"use client";

import { CarCard } from "./car-card";
import Link from "next/link";
import {  useCarStore, useFilteredCarStore, useSearchStore, useUserStore } from "@/lib/store";
import CarIcon from "@/public/car-icon.svg";
import Delivery from "@/public/delivery.svg";
import CoinStack from "@/public/coin-stack.svg";
import ArrowRight from "@/public/right_arrow.svg";
import FlexLayoutCars from "./flex-layout-cars";
import LoadingScreen from "./loading-screen";
import Loader from "./loader";

export function CarSection() {
  const { name } = useUserStore();
  const {cars,isCarLoading} = useCarStore();
  const {isSearching} = useSearchStore();
  const {startDate,endDate,startTime,endTime} = useSearchStore();
  const {filteredCars,isLoading} = useFilteredCarStore();

  function formatDateTime(dateString: Date | null) {
    if(!dateString) return "";
    return dateString.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  if(isCarLoading ) 
    return <LoadingScreen/>;

  return (
    <div className="mx-2">
      {name ? (
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
                <Link
                  href={`/car/${car.id}`}
                  key={index}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <CarCard
                    car={car}
                    flexlayout={false}
                  />
                </Link>
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
      ) : (
        <section className="bg-white bg-opacity-30 mb-1 dark:bg-opacity-10 rounded-t-md backdrop-blur-lg sm:py-12 py-6 bg-muted">
          <div className="container mx-auto px-4">
            <h2 
            style={{ fontFamily: "var(--font-equinox), sans-serif" }}
            className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                <CarIcon className="w-28 h-12 stroke-primary fill-primary mb-4 mb-4 stroke-[6px]" />
                <h3 
                style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p 
                className="text-muted-foreground">
                  Book your desired car with just a few clicks.
                </p>
              </div>
              <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                <Delivery className="w-28 h-12 stroke-primary fill-primary mb-4 mb-4 stroke-[6px]" />
                <h3 
                style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                className="text-xl font-semibold mb-2">Home delivery</h3>
                <p className="text-muted-foreground">
                  Get you car delivered to your home.
                </p>
              </div>
              <div className="flex flex-col items-center bg-card p-6 rounded-lg shadow-md">
                <CoinStack className="w-28 h-12 fill-primary mb-4 mb-4" />
                <h3 
                style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }}
                className="text-xl font-semibold mb-2">Reduced Costs</h3>
                <p className="text-muted-foreground">
                  No middleman to increase cost, the cars are owned by us.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
