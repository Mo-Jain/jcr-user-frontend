'use client';
import { CarCard } from "@/components/car-card";
import LoaderOverlay from "@/components/loader-overlay";
import { BASE_URL } from "@/lib/config";
import { Car } from "@/lib/types";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res1 = await axios.get(`${BASE_URL}/api/v1/customer/car/all`, {
                    headers: {
                      authorization: `Bearer ` + localStorage.getItem("token"),
                    },
                });
                setCars(res1.data.cars);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    return (
    <div className="w-full min-h-screen pt-24 sm:pt-16 pb-16 sm:pb-0 h-full bg-background px-4">
        {isLoading && <LoaderOverlay />}
        <h1
            style={{ fontFamily: "var(--font-equinox), sans-serif" }}
            className="sm:text-3xl text-xl font-black font-myfont pb-4 mb-4 w-full border-b border-border"
        >
            CARS
        </h1>
        <div
            key={cars.length}
            className="grid z-0 grid-cols-2 mt-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
            >
            {cars.map((car) => (
                <div key={car.id} 
                onClick={() => setIsLoading(true)}
                >
                    <Link
                    href={`/car/${car.id}`}
                    key={car.id}
                    className="transform transition-all z-0 duration-300 hover:scale-105"
                    >
                    <CarCard
                        car={car}
                        flexlayout={false}
                    />
                    </Link>
                </div>
            ))}
        </div>
    </div>
  )
};

export default Page;
