'use client';
import { useFavoriteStore } from "@/lib/store";
import FlexLayoutCars from "./flex-layout-cars";

const FavoriteSection = () => {
    const {favoriteCars} = useFavoriteStore();

  return (
    <div className="mx-2 mb-1">
        { favoriteCars && favoriteCars.length > 0 &&
        <section className="py-6 bg-white bg-opacity-30 dark:bg-opacity-10 mt-1 backdrop-blur-lg sm:px-4 px-2">
            <div className="flex items-center justify-between w-full pb-3 border-b border-border">
                <h1
                style={{ fontFamily: "var(--font-equinox), sans-serif" }}
                className="sm:text-3xl text-xl font-black font-myfont w-full  "
                >
                    Favorites
                </h1>
            </div>
            <FlexLayoutCars cars={favoriteCars}/>
        </section>
        }
    </div>
  )
};

export default FavoriteSection;
