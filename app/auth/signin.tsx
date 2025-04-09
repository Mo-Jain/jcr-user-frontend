"use client";

import {  useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import {  useLoginStore } from "@/lib/store";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import {  Eye, EyeOff } from "lucide-react"
import { InputFieldOutline } from "@/components/input-field";


export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState("");
  const {setIsSignUp} = useLoginStore();
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState<"username" | "password" | "new-password">("username")

  const handlerCredentials = async () => {
    setError("");
    try {
        if(step === "username"){
            if(!username){
                setError("Please enter a username")
                return;
            }
            setIsLoading(true);
            const res = await axios.post(`${BASE_URL}/api/v1/customer/checkMail`, 
                {
                    username: username,
                },
                {
                    headers: {
                        "Content-type": "application/json",
                    },
                });
            if(res.data.isPassword){
                setStep("password");
            }
            else {
                setStep("new-password");
            }
        }else{
            if(!username){
                setError("Please enter a username")
                setStep("username");
                return;
            }
            if(!password){
                setError("Please enter a password")
                return;
            }
            if(step === "new-password"){
                if(!confirmPassword || password !== confirmPassword){
                    setError("Passwords do not match")
                    return;
                }
            }
            setIsLoading(true);
            const res = await signIn("credentials", {
                username:username,
                password:password,
                redirect: false,
            });
            if (res?.error) {
                setError(res?.error);
            }
        }
        setIsLoading(false);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            setError(error.response?.data.message)
        }else {
            console.error("error",error)
            setError("something went wrong")
        }
        toast({
            title: "Something went wrong",
            variant:'destructive'
            });
    }
  };


  return (
        <div>
            <CardContent style={{fontFamily:" sans-serif"}}
            className="space-y-2 pb-4">
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div className="w-full relative overflow-hidden">
                    {/* {step !== "username" && 
                        <div className="text-blue-500 text-sm flex gap-2 items-center cursor-pointer" 
                            onClick={()=>setStep("username")}>
                            <ArrowLeft className="w-4 h-4"/>
                            Change User name 
                        </div>
                    }
                    {step === "username" && 
                        <>
                            <div className="text-blue-500 text-sm mb-2 flex gap-2 items-center cursor-pointer" 
                                onClick={()=>setStep("password")}>
                                Change Password
                                <ArrowRight className="w-4 h-4"/>
                            </div>
                            <div className="text-blue-500 text-sm flex gap-2 items-center cursor-pointer" 
                                onClick={()=>setStep("new-password")}>
                                Change New  Password
                                <ArrowRight className="w-4 h-4"/>
                            </div>
                        </>
                    } */}
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                    transform: step === "username" ? "translateX(0)" : "translateX(-100%)",
                    }}
                >
                    
                    <div className="space-y-1 mb-4 w-full flex-shrink-0">
                        <InputFieldOutline
                            input={username}
                            setInput={setUsername}
                            label="Mobile Number/Email"
                            type="text"
                            bgColor="muted"
                        />
                    </div>
                    <div className="space-y-1 w-full flex-shrink-0">
                        {step === "new-password" ? (
                            <div className="space-y-4">
                                <PasswordInput password={password} setPassword={setPassword} label="New Password"/>
                                <PasswordInput password={confirmPassword} setPassword={setConfirmPassword} label="Confirm Password"/>
                            </div>
                        ) : (
                            <PasswordInput password={password} setPassword={setPassword} label="Enter Password"/>
                        )}
                    </div>
                </div>
            </div>
            </CardContent>
            <CardFooter style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }} className="flex flex-col space-y-1 pb-0 px-6">
            <Button 
             className="w-full text-white active:scale-95 mb-2"
             onClick={handlerCredentials}
             >
                {isLoading ? (
                    <>
                        <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.4s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.2s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY"></div>
                        </div>
                    </>
                ) : (
                    <>
                        {step === "username" ? 
                            <span>Next</span>
                            :
                            <span>Login</span>
                        }
                    </>
                )}
            </Button>
            <div className="text-sm ">
                <p>
                    <span style={{fontFamily:"var(--font-bigjohn),sans-serif"}}>New Here?</span>
                    <span onClick={()=> setIsSignUp(true)} className="text-blue-500 cursor-pointer"> Create new account</span>
                </p>
            </div>
            </CardFooter>
        </div>
  );
}


const PasswordInput = ({password,setPassword,label,required}: {
    password:string,
    setPassword:React.Dispatch<React.SetStateAction<string>>,
    label:string,
    required?:boolean
    }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div style={{fontFamily:"inter"}} className="relative">
            <InputFieldOutline
            input={password}
            setInput={setPassword}
            label={label}
            type={showPassword ? "text" : "password"}
            required = {required}
            bgColor="muted"
            className="text-sm"
            />
            <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            >
            {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
                <Eye className="h-4 w-4 text-gray-500" />
            )}
            <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
            </span>
            </Button>
        </div>
    )
}



