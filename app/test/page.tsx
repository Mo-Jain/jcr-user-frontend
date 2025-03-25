'use client';

import Moonlight_small from "@/public/night-bg/moonlight_small.svg";
import Moonlight_large from "@/public/night-bg/moonlight_large.svg";
import Moon from "@/public/night-bg/moon.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {  useEffect, useState } from "react";

const Page = () => {
  const [isdark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false)
    const stars = Array.from({ length: 50 }, (_, i) => i)
  
    useEffect(() => {
      setMounted(true)
    }, [])
    if (!mounted) return null;
  
  
  return (
    <div className="w-screen h-full min-h-screen  ">
      <div className="w-screen h-full min-h-screen bg-black z-0 fixed top-0 left-0"></div>
      {/* <Image src={Smoke} alt="smoke" className={`w-[440px] h-[440px] rotate-90  ${isdark ? "opacity-[0.1]" : "opacity-0"} fixed top-[5%] transition-top duration-300 ease-in-out left-0 `} /> */}
      <div className={`${isdark ? "opacity-100" : "opacity-0"}  transition-opacity duration-1000`}>
      {stars.map((star) => (
          <div
            key={star}
            className={`absolute rounded-full twinkle`}
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: "white",
              boxShadow: "0 0 3px rgba(255, 255, 255, 0.5)",
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        </div>
      <div className="w-96 h-96 relative scale-[2.5] z-0">
        <div className={`relative w-full h-full  z-0 ${isdark ? "" : "-mt-96"} transition-top duration-300 ease-in-out`}>
          <Moonlight_large className={`w-full h-full ${isdark ? "" : "scale-0"} transition-all duration-1000 ease-in-out absolute top-0 left-0 `} />
          <Moonlight_small className={`w-1/3 h-1/3 ${isdark ? "" : "scale-0"} transition-all duration-1000 ease-in-out absolute top-[34%] left-[34%] opacity-70 `} />
          <Image src={Moon} alt="moon" className={`w-[10%] h-[10%] absolute top-[45%]   left-[45%] opacity-70`} />
        </div>
      </div>
      <div>
      </div>
        <Button 
        onClick={() => setIsDark(!isdark)}
        className="m-20 fixed top-[50%] left-[10%] cursor-pointer z-100" 
        >
          Click
        </Button>
    </div>
  )
};

export default Page;
