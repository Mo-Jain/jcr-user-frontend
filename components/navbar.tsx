"use client";

import Logo1 from "@/public/logo.svg";
import LogoText from "@/public/logo_text.svg";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { useCallback, useEffect, useState } from "react";
import { useLoginStore, useUserStore } from "@/lib/store";
import Redirect from "./redirect";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

export function NavBar() {
  const [selectedTab, setSelectedTab] = useState("home");
  const pathname = usePathname();
  const router = useRouter();
  const { name, imageUrl } = useUserStore();
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const {setIsSignUp} = useLoginStore();
  const gethortName = useCallback(() => {
    if (!name) return;
    const nameArray = name.trim().split(" ");
    let shortName = "";
    if (nameArray.length > 0) {
      shortName = nameArray[0][0] + nameArray[nameArray.length - 1][0];
    } else {
      shortName = nameArray[0][0];
    }
    return shortName.toLocaleUpperCase();
  },[name]);
  const [shortName, setShortName] = useState(gethortName());

  useEffect(() => {
    setShortName(gethortName());
  }, [setShortName,gethortName]);

  useEffect(() => {
    if (pathname.startsWith("/booking")) {
      setSelectedTab("bookings");
    } else if (pathname.startsWith("/account")) {
      setSelectedTab("account");
    } else if (pathname.startsWith("/cars")) {
      setSelectedTab("cars");
    } else if (pathname === "/") {
      setSelectedTab("home");
    }
  }, [pathname]);

  const handleClick = () => {
    if (!isSmallScreen) {
      router.push("/");
    }
  };

  return (
    <div className="relative">
      <Redirect />
      <nav className="fixed w-full max-sm:pt-[30px] border-border top-0 left-0 z-[99] py-1 flex items-center rounded-none cursor-normal bg-white/30 dark:bg-white/10 backdrop-blur-lg justify-between px-4">
        <div className="flex w-full transition-all duration-300">
          <div
            onClick={handleClick}
            className={`flex-grow w-fit cursor-pointer rounded-none flex sm:ml-4 items-center justify-start`}
          >
            <div className="flex items-start">
              <Logo1 className="h-[40px] sm:h-[50px] fill-[#039BE5] stroke-[1px]" />
            </div>
            <LogoText className="ml-[-10px] sm:ml-[-5px] dark:stroke-white w-10 sm:w-14 h-7" />
          </div>
          <div
            className={`sm:w-full ${name ? "ml-10" : ""} flex justify-center items-center`}
          >
            <ThemeToggle />
          </div>
        </div>
        {!name ? (
          <div className="py-2 flex items-center gap-2">
            <div
            style={{fontFamily:'sans-serif'}}
              className="w-full font-bold select-none text-zinc-700 dark:text-gray-200 cursor-pointer hover:text-blue-700 hover:dark:text-blue-700"
              onClick={() =>{
                setIsSignUp(true);
                router.push("/auth")
              }}
            >
              Signup
            </div>
            <div
            style={{fontFamily:'sans-serif'}}
              className="w-full font-bold select-none text-zinc-700 dark:text-gray-200 cursor-pointer hover:text-blue-700 hover:dark:text-blue-700"
              onClick={() => {
                setIsSignUp(false);
                router.push("/auth")
              }}
            >
              Login
            </div>
          </div>
        ) : (
          <div 
          style={{ fontFamily: "var(--font-xova), sans-serif" }}
          className="w-18 space-x-2  flex text-right ">
            <div className="flex items-center text-zinc-700 dark:text-gray-200 max-sm:hidden space-x-2 justify-around">
              <div
                className={`px-2 hover:text-blue-700 dark:hover:text-blue-500 ${selectedTab == "home" ? "text-blue-700 border-b-blue-700 dark:text-blue-500 dark:border-b-blue-500" : ""} border-transparent transition-all border duration-300 border-y-4 p-1 cursor-pointer font-bold`}
                onClick={() => router.push("/")}
              >
                Home
              </div>
              <div
                className={`px-2 hover:text-blue-700 dark:hover:text-blue-500 ${selectedTab == "bookings" ? "text-blue-700 border-b-blue-700 dark:text-blue-500 dark:border-b-blue-500" : ""} border-transparent transition-all border duration-300 border-y-4 p-1 cursor-pointer font-bold`}
                onClick={() => router.push("/bookings")}
              >
                Trips
              </div>
              <div
                className={`px-2 hover:text-blue-700 dark:hover:text-blue-500 ${selectedTab == "cars" ? "text-blue-700 border-b-blue-700 dark:text-blue-500 dark:border-b-blue-500" : ""} border-transparent transition-all border duration-300 border-y-4 p-1 cursor-pointer font-bold`}
                onClick={() => router.push("/cars")}
              >
                Cars
              </div>
              
            </div>
            <div
              className={`flex flex-col items-center px-2 hover:text-blue-700 dark:hover:text-blue-500 max-sm:hidden ${selectedTab == "account" ? "text-blue-700 border-b-blue-700 dark:text-blue-500 dark:border-b-blue-500" : ""} border-transparent transition-all border duration-300 border-y-4 p-1 cursor-pointer font-bold`}
              onClick={() => router.push("/account")}
            >
              {imageUrl ? (
                <div
                  className={`h-fit w-fit ${selectedTab == "account" ? " border-primary" : "border-transparent"} border-2  rounded-full hover:border-primary`}
                >
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="max-h-8 min-w-8 object-cover rounded-full"
                  />
                </div>
              ) : (
                <span
                  className={`h-8 w-8 ${selectedTab == "account" ? " border-primary text-primary" : "border-zinc-700 dark:border-white text-zinc-700 dark:text-white"} border-2  rounded-full hover:border-primary hover:dark:text-primary hover:dark:border-primary hover:text-primary  flex justify-center items-center `}
                >
                  {shortName}
                </span>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
