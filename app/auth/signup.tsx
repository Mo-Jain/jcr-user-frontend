"use client";

import {useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import {  useLoginStore } from "@/lib/store";
import { signIn } from "next-auth/react";
import { InputFieldOutline } from "@/components/input-field"
import { cn } from "@/lib/utils"
import { AlertCircle, Eye, EyeOff } from "lucide-react"

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [contact,setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState("");
  const [email,setEmail] = useState("");
  const {setIsSignUp} = useLoginStore();

  const signInWithProvider = async (provider: "google" | "credentials") => {
    try {
        const res = await signIn(provider, {
            username:email,
            password:password,
            redirect: false,
            callbackUrl: window.location.origin
        });
        if (res?.error) {
            setError(res.error);
            console.error("Sign-Up Failed", res.error);
            setIsLoading(false);
            return;
        }
        setIsLoading(false);
    } catch (error) {
      console.error(error);
      setError("something went wrong")
      setIsLoading(false);
    }
  };

  const handlerCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if(!firstName || !lastName || !contact || !password || !email){
      setError("Please fill all the fields")
      return;
    }
    if(!confirmPassword || password !== confirmPassword){
      setError("Passwords do not match")
      return;
    }
    if(!isValidEmail(email)){
      return;
    }
    try {
        setIsLoading(true);
        await axios.post(`${BASE_URL}/api/v1/customer/signup`, {
          name: firstName.trim() + " " + lastName.trim(),
          contact: contact.trim(),
          password: password.trim(),
          email: email,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        });
        
    } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
            setError(error.response?.data.message)
        }else {
            console.error("error",error)
            setError("something went wrong")
        }
        return;
    }
    await signInWithProvider("credentials");
  };


  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  return (
        <form onSubmit={handlerCredentials}>
          <CardContent style={{fontFamily:" sans-serif"}}
          className="space-y-2 pb-4">
          {error && <p className="text-red-500 text-xs">{error}</p>}
            <SignUpContent
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              contact={contact}
              setContact={setContact}
              isValidEmail={isValidEmail}
              />
          </CardContent>
          <CardFooter style={{ fontFamily: "var(--font-bigjohnbold), sans-serif" }} className="flex flex-col space-y-1 pb-0 px-6">
            <Button type="submit" className="w-full text-white active:scale-95 mb-2">
              {isLoading ? (
                    <>
                      <span>Please wait</span>
                      <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.4s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY [animation-delay:-0.2s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounceY"></div>
                      </div>
                  </>
                ) : (
                  <>
                    <span>Sign Up</span>
                  </>
                )}
            </Button>
            <div className="text-sm ">
              <p className="">
                <span style={{fontFamily:"var(--font-bigjohn),sans-serif"}}>Already have an account?  </span>
                <span onClick={()=> setIsSignUp(false)} className="text-blue-500 cursor-pointer"> Login</span>
            </p>
            </div>
          </CardFooter>
        </form>
  );
}


const SignUpContent = (
    {
      firstName,
      setFirstName,
      lastName,
      setLastName,
      email,
      setEmail,
      password,
      setPassword,
      confirmPassword,
      setConfirmPassword,
      showPassword,
      setShowPassword,
      contact,
      setContact,
      isValidEmail
    } 
    :{
      firstName:string,
      setFirstName:React.Dispatch<React.SetStateAction<string>>,
      lastName:string,
      setLastName:React.Dispatch<React.SetStateAction<string>>,
      email:string,
      setEmail:React.Dispatch<React.SetStateAction<string>>,
      password:string,
      setPassword:React.Dispatch<React.SetStateAction<string>>,
      confirmPassword:string,
      setConfirmPassword:React.Dispatch<React.SetStateAction<string>>,
      showPassword:boolean,
      setShowPassword:React.Dispatch<React.SetStateAction<boolean>>,
      contact:string,
      setContact:React.Dispatch<React.SetStateAction<string>>,  
      isValidEmail:(email:string)=>boolean
    }
  ) => {
    return (
      <>
          <div className="flex items-center gap-2">
            <div className="space-y-1">
                <InputFieldOutline
                    input={firstName}
                    setInput={setFirstName}
                    label="First name"
                    type="text"
                    bgColor="muted"
                    required
                />
              </div>
              <div className="space-y-1">
                <InputFieldOutline
                    input={lastName}
                    setInput={setLastName}
                    label="Last name"
                    type="text"
                    bgColor="muted"
                    required
                />
              </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="space-y-1 w-2/3">
                  <InputFieldOutline
                        input={email}
                        setInput={setEmail}
                        label="Email address"
                        type="text"
                        bgColor="muted"
                        required
                        className={cn("text-sm",
                            email && !isValidEmail(email) ? "focus-visible:border-destructive border-destructive ring-destructive/20" : ""
                          )}
                    />
                  {email && !isValidEmail(email) && (
                    <div className="flex items-center gap-1.5 text-xs text-destructive mt-1.5">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span className="mt-1">Please enter a valid email address</span>
                    </div>
                  )}
            </div>
            <div className="space-y-1 w-1/3">
                <InputFieldOutline
                    input={contact}
                    label="Mobile number"
                    type="text"
                    bgColor="muted"
                    required
                    maxLength={10}
                    onChange={(value) => {
                        // Ensuring only numeric values are accepted
                        if (/^\d*$/.test(value)) { // Regex to allow only numbers
                            setContact(value);
                        }
                        }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div style={{fontFamily:"inter"}} className="relative">
                  <InputFieldOutline
                    input={password}
                    setInput={setPassword}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    required
                    bgColor="muted"
                    className="text-sm"
                    />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1 h-full px-3 py-2 hover:bg-transparent"
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
                <div style={{fontFamily:"inter"}} className="relative">
                    <InputFieldOutline
                        input={confirmPassword}
                        setInput={setConfirmPassword}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        required
                        bgColor="muted"
                        className="text-sm"
                        />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1 h-full px-3 py-2 hover:bg-transparent"
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
              </div>
            </div>
        </>
    )
  }



