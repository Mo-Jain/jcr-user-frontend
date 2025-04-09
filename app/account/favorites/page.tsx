'use client';

import Link from "next/link";
import { useFavoriteStore } from "@/lib/store";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import BackButton from "@/public/back-button.svg";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

const FavoriteSection = () => {
    const {favoriteCars} = useFavoriteStore();
    const router = useRouter();
  return (
    <div className="">
        <section className="py-6 pt-24 sm:pt-20 min-h-screen h-full bg-background sm:px-4 px-2 flex flex-col">
            <div className="flex items-center justify-between w-full pb-3 border-b border-border">
                <div className="flex items-center">
                    <Button
                        onClick={() => router.push("/account")}
                        className=" flex mx-4 bg-transparent active:scale-95 w-fit rounded-md cursor-pointer shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card "
                        >
                        <BackButton className="h-6 w-6 stroke-0 fill-gray-800 dark:fill-blue-300" />
                    </Button>
                    <h1
                    style={{ fontFamily: "var(--font-equinox), sans-serif" }}
                    className="sm:text-3xl text-xl font-black font-myfont w-full  "
                    >
                        Favorites
                    </h1>
                </div>
            </div>
            
            <div className="relative mt-2 h-full">
                { favoriteCars && favoriteCars.length > 0 ?
                <div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
                    >
                    {favoriteCars.map((car,index) =>{
                        return (
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
                    )})}
                </div>
                :
                <div className="w-full pt-20 h-full flex flex-col items-center justify-center gap-2 text-center">
                    <Star className="w-20 h-20 text-gray-500 dark:text-gray-400 " />
                    <p className="text-lg text-gray-600 dark:text-gray-400 select-none">
                        No favorite cars added yet
                    </p>
                </div>
                }
            </div>
        </section>
    </div>
  )
};

export default FavoriteSection;
