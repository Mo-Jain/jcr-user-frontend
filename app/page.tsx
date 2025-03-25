'use client';

import Link from "next/link";
import { CarSection } from "@/components/car-section";
import { TopSection } from "@/components/top-section";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import FavoriteSection from "@/components/favorite";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { MdClose } from "react-icons/md";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/lib/config";

const smoothScrollTo = (targetY: number, duration: number = 300) => {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1); // Keep progress between 0 and 1
    window.scrollTo(0, startY + difference * progress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};


export default function Home() {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const fadeStart = 0;  // Start fading from the top
  const fadeEnd = isSmallScreen ? 110 : 130; // Fully invisible at 300px scroll
  const snapThreshold = (fadeEnd - fadeStart) / 2; // Halfway point
  const router = useRouter();

  const { kycStatus, kycStatusFlag,setKycStatusFlag } = useUserStore();
  const [opacity, setOpacity] = useState(1);
  let timeout: NodeJS.Timeout | null = null;

  function getKycMessage () {
    if(kycStatus === "pending") return "To have smooth booking experience";
    return "Congrats! Your KYC has been verified";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setKycStatusFlag(false);
    }, 30000); // 10 seconds
  
    return () => clearTimeout(timer); // Cleanup to avoid memory leaks
  }, [setKycStatusFlag]);

  const handleClose = async() => {
    setKycStatusFlag(false);
    if(kycStatus === "verified"){
      await axios.put(`${BASE_URL}/api/v1/customer/kyc-approve-flag`, 
        {
              
        },
        {
          headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
          },
      });
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let newOpacity = 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart);
      newOpacity = Math.max(newOpacity, 0); // Ensure it doesn't go below 0
      const duration = 200 * (fadeEnd - scrollY) / (fadeEnd - fadeStart);
      setOpacity(newOpacity);

      // Clear any previous timeout to prevent unnecessary snapping
      if (timeout) clearTimeout(timeout);
      //eslint-disable-next-line react-hooks/exhaustive-deps
      timeout = setTimeout(() => {
        if (scrollY > fadeStart + snapThreshold && scrollY < fadeEnd) {
          smoothScrollTo(fadeEnd, Math.floor(duration));
        } 
      }, 300); // Wait 100ms to detect if scrolling stops
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen relative my-0 z-0 bg-transparent max-sm:mb-10">
      <main>
        <div className="fixed top-[85px] sm:top-14 left-0 z-50 w-full ">
          {kycStatus !== "under review" && kycStatusFlag &&
            <div className="w-full relative bg-green-400 p-2 gap-2 bg-opacity-30 backdrop-blur-lg  w-full flex items-center justify-center">
              <span className="text-xs sm:text-sm">{getKycMessage()}
                </span>
              {kycStatus !== "verified" &&
                <Button 
                onClick={() => router.push("/account/my-account")}
                className="text-white py-0 text-xs max-sm:mr-6">Complete KYC Now</Button>
              }
              <div 
              onClick={handleClose}
              className="h-full absolute top-0 right-0 p-2 flex items-center justify-center">
                <MdClose className="h-4 w-4 cursor-pointer" />
              </div>
            </div>}
        </div>
        <div 
        className="relative z-10 transition-opacity duration-300 ease-in-out">
          <TopSection opacity={opacity} />
        </div>
        <div className="relative z-0">
          <CarSection />
        </div>
        <div className="relative z-0">
          <FavoriteSection/>
        </div>
      </main>
      <div className="bg-white  bg-opacity-40 dark:bg-opacity-20 backdrop-blur-lg flex flex-col items-center px-4 text-muted-foreground py-4">
        <div className=" text-center">
          <p>&copy; 2025 Jain Car Rentals. All rights reserved.</p>
        </div>
        <div className="flex justify-around w-full mt-2 items-center gap-2">
          <Link
            href="/terms-and-conditions"
            target="_blank"
            className="text-center text-sm cursor-pointer text-black dark:text-white"
          >
            <p>Terms and Conditions</p>
          </Link>
          <Link
            href="/contact-us"
            target="_blank"
            className="text-center text-sm cursor-pointer text-black dark:text-white"
          >
            <p>Contact us</p>
          </Link>
        </div>
        <div
        className="text-end text-xs self-end cursor-pointer text-gray-400 dark:text-gray-500"
        >
          <p>
            Desgined and developed
          </p>
          <p>
            Mohit Jain
          </p>
        </div>
        
      </div>
    </div>
  );
}
