'use client';
import Link from "next/link";
import { CarCard } from "./car-card";
import {ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Car } from "@/lib/types";

const CARD_WIDTH = 264; // Width of each CarCard
const SCROLL_DURATION = 300; // Duration of the scroll animation in ms

const FlexLayoutCars = ({cars}:{cars:Car[]}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    useEffect(() => {
        updateScrollButtons();
    }, [cars]);

    const updateScrollButtons = () => {
        if (!scrollRef.current) return;
        setCanScrollLeft(scrollRef.current.scrollLeft > 0);
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
            } else {
                updateScrollButtons();
            }
        };

        requestAnimationFrame(animateScroll);
    };

    const handleScroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const newScrollPosition =
            direction === "left"
                ? scrollRef.current.scrollLeft - CARD_WIDTH
                : scrollRef.current.scrollLeft + CARD_WIDTH;

        smoothScroll(newScrollPosition);
    };

  return (
    <div className="mx-2">
        <div className="relative">
            <div
                ref={scrollRef}
                onScroll={updateScrollButtons}
                className="flex items-center flex-nowrap gap-2 sm:gap-3 py-3 overflow-x-scroll scrollbar-hide"
                >
                {cars.map((car,index) =>{
                    return (
                    <Link
                    href={`/car/${car.id}`}
                    key={index}
                    className="transform transition-all duration-300 hover:scale-105"
                    >
                    <CarCard
                        car={car}
                        flexlayout={true}
                    />
                    </Link>
                )})}
                {canScrollLeft &&
                    <div 
                    onClick={() => handleScroll("left")} 
                    className="absolute border border-transparent active:border-blue-400 top-[6%] sm:top-[4%] opacity-60 hover:opacity-100 left-0 p-2 sm:p-3 flex items-center justify-center h-[88%] sm:h-[92%] rounded-sm">
                        <ChevronLeft
                        className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"/>
                    </div>
                }
                <div 
                onClick={() => handleScroll("right")} 
                className="absolute border border-transparent active:border-blue-400 top-[6%] sm:top-[4%] opacity-60 hover:opacity-100 right-0 p-2 sm:p-3 flex items-center justify-center h-[88%] sm:h-[92%] rounded-sm">
                    <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 "/>
                </div>
            </div>
        </div>
    </div>
  )
};

export default FlexLayoutCars;
