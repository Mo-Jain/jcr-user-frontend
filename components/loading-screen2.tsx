import React, { useEffect } from "react";
import Loader from "./loader";
import { useLoaderStore } from "@/lib/store";

const LoadingScreen2 = () => {
    const {isLoading}  = useLoaderStore()


    useEffect(() => {
        if(isLoading){
            document.documentElement.classList.add("no-scroll");
        }else {
            document.documentElement.classList.remove("no-scroll");
        }

        return () => {
            document.documentElement.classList.remove("no-scroll");
        };
    }, [isLoading]);

    if(!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
          <Loader/>
      </div>
  );
};

export default LoadingScreen2;
