'use client';

// import Moonlight_small from "@/public/night-bg/moonlight_small.svg";
// import Moonlight_large from "@/public/night-bg/moonlight_large.svg";
// import Moon from "@/public/night-bg/moon.png";
// import Image from "next/image";
// import { Button } from "@/components/ui/button";
import {  useEffect, useState } from "react";
import SkeletonPreLoader from "@/components/skeleton-loader";

const Page = () => {
  // const [isdark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false)
    // const stars = Array.from({ length: 50 }, (_, i) => i)
  
    useEffect(() => {
      setMounted(true)
    }, [])
    if (!mounted) return null;
  
  
  return (
    <div className="h-full min-h-screen  ">
      <SkeletonPreLoader/>
    </div>
  )
};

export default Page;
