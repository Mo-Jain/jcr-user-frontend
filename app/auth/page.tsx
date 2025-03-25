"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import { BASE_URL } from "@/lib/config";
import {  useLoginStore, useUserStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import Initiate from "@/components/initiate";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { name,setName } = useUserStore();
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [contact,setContact] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {isSignUp,setIsSignUp} = useLoginStore();
  const [shouldInitiate, setShouldInitiate] = useState(false);

  useEffect(()=>{
    if(name){
      router.push('/');
    }
  },[name,router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try{
      let res;
      if(isSignUp){
        if(!firstName || !lastName || !contact || !password){
          toast({
            title: "Please fill all the fields"
          })
          return;
        }
        res = await axios.post(`${BASE_URL}/api/v1/customer/signup`, {
          name: firstName.trim() + " " + lastName.trim(),
          contact: contact.trim(),
          password: password.trim(),
        },
        {
          headers: {
            "Content-type": "application/json",
          },
        });
        toast({
          title: "Signup successful"
        })
      }else{
        if(!username || !password){
          toast({
            title: "Invalid username or password"
          })
          return;
        }
        res = await axios.post(`${BASE_URL}/api/v1/customer/signin`, 
          {
            username: username,
            password: password,
          },
          {
            headers: {
              "Content-type": "application/json",
            },
          });
          toast({
            title: "Login successful"
          })
      }
      localStorage.setItem("token", res.data.token);
      toast({
        title: "Login successful"
      })
      setName(res.data.name);
      router.push('/');
      setShouldInitiate(true);
    }
    catch(error){
      toast({
        title: "Something went wrong"
      })
      console.error("error",error)
    }
  };

  if(shouldInitiate) return <Initiate/>;

  return (
    <div className="h-screen bg-white/30 dark:bg-black/30 backdrop-blur-lg flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-muted">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl select-none font-bold">{isSignUp ? "Sign Up" : "Login"}</CardTitle>
          </div>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isSignUp ? 
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your mobile number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                </div>
              </>
            :
            <>
              <div className="flex items-center gap-2">
                <div className="space-y-2">
                  <Label htmlFor="firstname">First Name</Label>
                    <Input
                      id="firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter last name"
                      required
                    />
                  </div>
              </div>
              <div className="space-y-2">
                    <Label htmlFor="contact">Mobile no.</Label>
                    <Input
                      id="contact"
                      type="text"
                      value={contact}
                      onChange={(e) => {
                        // Ensuring only numeric values are accepted
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) { // Regex to allow only numbers
                          setContact(value);
                        }
                      }}
                      placeholder="Enter your mobile number"
                      maxLength={10}
                      required
                    />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
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
                    <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
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
                  </div>
                </div>
            </>}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full text-white active:scale-95">
              {isLoading ? (
                    <>
                      <span>Please wait</span>
                      <div className="flex items-end py-1 h-full">
                        <span className="sr-only">Loading...</span>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                      </div>
                  </>
                ) : (
                  <span>{isSignUp ? "Sign Up" : "Login"}</span>
                )}
            </Button>
            {isSignUp ?
             <p className="">Already have an account?  
              <span onClick={()=> setIsSignUp(false)} className="text-blue-500 cursor-pointer"> Login</span></p>
              :
            <p>New Here? 
              <span onClick={()=> setIsSignUp(true)} className="text-blue-500 cursor-pointer"> Create new account</span>
            </p>}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
