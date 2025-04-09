"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {  useLoginStore, useServerStore } from "@/lib/store";
import {  useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Initiate from "@/components/initiate";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import SignUp from "./signup";
import SignIn from "./signin";

export default function AuthContent() {
  const router = useRouter();
  const {isSignUp} = useLoginStore();
  const [shouldInitiate, setShouldInitiate] = useState(false);
  const {setIsServerLoading,setIsInitiateComplete} = useServerStore();
  const {data:session,status} = useSession();
 
  useEffect(()=>{
    if(status === "authenticated"){
      router.replace('/');
    }
  },[status,router])

  const handleSignInWithGoogle = async () => {
    try {
      await signIn("google", { 
        prompt: "select_account",
        redirect: false,
      });
    } catch (error) {
      console.error("Google Sign-In Error", error);
      toast({
        title: "Something went wrong",
        variant:'destructive'
      });
    }
  };

  useEffect(() => {
    const authorize = async () => {
      if (status !== "authenticated") return; 
      toast({
        title: "Login successful",
      });
      setIsServerLoading(true);
      setIsInitiateComplete(true);
      localStorage.setItem("token", session.user.access_token);
      setShouldInitiate(true);

      router.replace("/");
    }
    authorize();
  }, [status,router,session?.user.access_token,setIsServerLoading,setIsInitiateComplete,setShouldInitiate]);

  if(shouldInitiate) return <Initiate/>;

  return (
    <div className="h-screen bg-white/30 dark:bg-black/30 backdrop-blur-lg flex items-center justify-center sm:p-4">
      <Card className="w-full max-w-md border-border bg-muted max-sm:mt-2">
        <CardHeader className="space-y-1 py-3">
          <div className="flex justify-between items-center">
            <CardTitle 
            style={{ fontFamily: "var(--font-xova), sans-serif" }} 
            className="text-2xl select-none font-bold">{isSignUp ? "Sign Up" : "Login"}</CardTitle>
          </div>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        {isSignUp ? 
        <SignUp/>
        :
        <SignIn/>
        }
        <div  className=" px-6 py-2 pb-4 gap-2">
          <div className="flex items-center mb-2 px-1 gap-1 text-gray-300 dark:text-gray-500 text-xs">
            <hr className="w-full border-gray-300 dark:border-gray-500"/>
            <span>OR</span>
            <hr className="w-full border-gray-300 dark:border-gray-500"/>
          </div>
          <Button 
          style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }} 
          className="w-full text-gray-600 dark:text-white active:scale-95 bg-white dark:bg-background"
          onClick={handleSignInWithGoogle}
          >
            <div className="rounded-full w-6 h-6 p-1 flex mr-1 ">
              <Image 
              src="/google.png" 
              alt="google" 
              width={20} 
              height={20} 
              className="w-4 h-4"
              />
            </div>
                <span>Continue with Google</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}



