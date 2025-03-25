"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import KYCIcon from "@/public/kyc.svg";
import UserIcon from "@/public/user.svg";
import Policy from "@/public/policy.svg";
import Shield from "@/public/shield1.svg";
import ContactUs from "@/public/contact-us.svg";
import { useUserStore } from "@/lib/store";
import { Star } from "lucide-react";


export default function Profile() {
  const router = useRouter();
  const { name, imageUrl, setName, setImageUrl,setUserId,kycStatus } = useUserStore();


  const handleLogout = () => {
    localStorage.setItem("token", "");
    setName("");
    setImageUrl("");
    setUserId(-1);
    router.push("/");
  };

  return (
    <div className="min-h-screen h-full pt-16 bg-background">
      <main className="container mx-auto px-4 py-8 pb-16 sm:pb-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {imageUrl ? (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
              )}
            </div>
          </div>

          {name !== "" ? (
            <>
              <div className="flex items-center">
                <h2 className="text-2xl font-bold text-gray-600 dark:text-white ">
                  {name}
                </h2>
              </div>
              <Button
                variant="outline"
                className="hover:bg-gray-200 active:scale-95 border-border dark:hover:bg-zinc-700 bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Button
                className="w-full bg-blue-600 active:scale-95 text-white border-border"
                onClick={() => router.push("/auth")}
              >
                Login
              </Button>
            </div>
          )}
        </div>
        <div>
          {name !== "" && (
            <Card className="overflow-hidden bg-muted my-4 mt-6 dark:border-border hover:shadow-md transition-shadow ">
              <CardContent className="p-1 text-gray-600 dark:text-gray-400">
                <div
                  className="flex items-center justify-between p-2 py-4 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200"
                  onClick={() => router.push("/account/profile-and-security")}
                >
                  <div className="flex items-center">
                    <Shield className="w-7 h-7 fill-gray-600 stroke-gray-600 dark:fill-white dark:stroke-white " />
                    <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                      Profile and security
                    </span>
                  </div>
                  <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
                </div> 
                <div
                  className="flex items-center justify-between p-2 py-4 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200"
                  onClick={() => router.push("/account/my-account")}
                >
                  <div className="flex relative items-center">
                    <KYCIcon className="w-7 h-7 stroke-[12px] fill-gray-600 stroke-gray-600 dark:fill-white dark:stroke-white " />
                    <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                      My KYC
                    </span>
                    {kycStatus === "pending" &&
                    <div className="absolute right-0 top-1 w-[6px] h-[6px] bg-green-400 rounded-full "/>
                    }
                  </div>
                  <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
                </div>
                <div
                  className="flex items-center justify-between p-2 py-4 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200"
                  onClick={() => router.push("/account/favorites")}
                >
                  <div className="flex items-center">
                    <Star className="w-6 h-6 stroke-gray-600 dark:stroke-white " />
                    <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                      Favorites
                    </span>
                  </div>
                  <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
                </div>
                
              </CardContent>
            </Card>
          )}
          <Card className="overflow-hidden bg-muted my-2 mt-6 dark:border-border hover:shadow-md transition-shadow ">
            <CardContent className="p-1 text-gray-600 dark:text-gray-400">
              <div
                  className="flex items-center justify-between p-2 py-4 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200"
                  onClick={() => router.push("/terms-and-conditions")}
                >
                  <div className="flex items-center">
                    <Policy className="w-7 h-7 stroke-[5px] fill-gray-600 stroke-gray-600 dark:fill-white dark:stroke-white " />
                    <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                      Policy
                    </span>
                  </div>
                <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
              </div>
              <div
                  className="flex items-center justify-between p-2 py-4 cursor-pointer rounded-md dark:hover:bg-zinc-700 hover:bg-gray-200"
                  onClick={() => router.push("/contact-us")}
                >
                  <div className="flex items-center">
                    <ContactUs className="w-7 h-7 fill-gray-600 dark:fill-white " />
                    <span className="mx-2 max-sm:text-sm dark:text-white select-none">
                      Contact Us
                    </span>
                  </div>
                <div className="border-t-2 border-r-2 rotate-45 sm:mr-4 mr-2 w-2 h-2 border-gray-600 dark:border-gray-400"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
