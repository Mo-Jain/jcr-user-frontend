"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, KeyRound, Check, X, Edit } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { BASE_URL } from "@/lib/config"
import { useSession } from "next-auth/react"
import { uploadToDrive, uploadToDriveWTParent } from "@/app/actions/upload"
import axios from "axios"
import { useUserStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import BackButton from "@/public/back-button.svg";
import Loader from "@/components/loader"
import Image from "next/image"
import UserIcon from "@/public/user.svg";

interface User {
    name: string;
    imageUrl: string;
    contact: string;
    password: string;
    folderId: string | null;
    email: string;
  }

export default function SecurityPage() {
  const [user, setUser] = useState<User>()
  const [newName, setNewName] = useState<string>("")
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { data: session, update } = useSession();
  const [passwordLength, setPasswordLength] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(false)
  const { setName, setImageUrl } = useUserStore();
  const [isUserLoading,setIsUserLoading] = useState(false);
  const [contact,setContact] = useState<string>("");
  const router = useRouter();
  const [isPassword, setIsPassword] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsUserLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/customer/me`, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.customer);
        setNewName(res.data.name);
        setProfileImage(res.data.imageUrl)
        setIsPassword(res.data.isPassword);
        console.log("res.data.imageUrl",res.data.imageUrl)
        if(res.data.customer.contact && res.data.customer.contact !== ""){
          setContact(res.data.customer.contact);
        }
      } catch (error) {
        console.log(error);
      }
      setIsUserLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() =>{
    console.log("profileImage",profileImage)
  },[profileImage])


  const handleNameSave = async () => {
    if (!newName) return;
    try {
      setNewName(newName.trim());
      await axios.put(
        `${BASE_URL}/api/v1/customer/me`,
        {
          name: newName.trim(),
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setName(newName.trim());
      toast({
        description: `Name Successfully updated`,
        duration:2000,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
      });
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed to update name`,
        duration:2000,
        className:
          "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        variant: "destructive",
      });
    }
  }
  const handleContactSave = async () => {
    if (!contact || contact === "") return;  
    try {
      await axios.put(
        `${BASE_URL}/api/v1/customer/me`,
        {
          contact: contact,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast({
        description: `Contact Successfully updated`,
        duration:2000,
      });
    } catch (error) {
      console.log(error);
      toast({
        description: `Failed to update contact`,
        duration:2000,
        variant: "destructive",
      });
    }
  }

  const handlePasswordChange = async() => {
    if (!oldPassword && isPassword) {
      toast({
        title: "Error",
        description: "Please enter your current password.",
        variant: "destructive",
      })
      return
    }

    if (!passwordLength) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    if (!passwordMatch) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      })
      return
    }

    try{
      await axios.put(
        `${BASE_URL}/api/v1/customer/me/update-password`,
        {
          currPassword: isPassword ? oldPassword : undefined,
          newPassword: newPassword,
        },
        {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      toast({
        description: "Your password has been updated successfully.",
      })
    }catch(error){
      if (axios.isAxiosError(error)) {
        // Extract error details from the response
        console.error(" Sign-In Failed:", error.response?.data.message || "Unknown error");
        const message = error.response?.data.message || "Something went wrong";
        toast({
          description: message,
          duration: 2000,
        });
      } else {
        console.error(" Sign-In Failed:Something went wrong", error);
        throw new Error("Something went wrong");
      }
    }

    // In a real app, you would verify the old password and update with the new one
    

    // Reset password fields
    setOldPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setShowPasswordFields(false)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Implement picture edit functionality here
    if(!user) return;
    const file = e.target.files?.[0];
    setIsUploading(true);
    if (file) {
        if (!file.type.startsWith("image/")) {
        toast({
            description: `Please select an image file`,
            className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
        });
        setIsUploading(false);
        return;
        }

        const maxSize = 6 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
        toast({
            description: `File size should not exceed 5MB`,
            className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
        });
        setIsUploading(false);

        return;
        }

        try {
        const currentDate = new Date();
        const unixTimestamp = Math.floor(currentDate.getTime() / 1000);

        let resImage;
        if(user.folderId){
            resImage = await uploadToDrive(
            file,
            user.folderId
            );
        }
        else{
            resImage = await uploadToDriveWTParent(
            file,
            "profile",
            user.name + " " + unixTimestamp,
            );
        }

        if (resImage.error || !resImage.url) {
            setIsUploading(false);
            return;
        }
        const res = await axios.put(
            `${BASE_URL}/api/v1/customer/me`,
            {
            imageUrl: resImage.url,
            profileFolderId: resImage.folderId,
            },
            {
            headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            },
        );
        setIsUploading(false);
        setImageUrl(res.data.imageUrl);
        if(session){
            await update({
            ...session,
            user: {
                ...session.user,
                image: res.data.imageUrl
            }
            });
        }
        toast({
            description: `Profile picture Successfully updated`,
            duration:2000,
            className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
        });
        } catch (error) {
        console.log(error);
        setIsUploading(false);
        toast({
            description: `Failed to upload profile picture`,
            className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
            variant: "destructive",
            duration: 2000,
        });
        }
    }
  }

  // Check password requirements
  const validatePassword = (password: string) => {
    setPasswordLength(password.length >= 8)
    setPasswordMatch(password === confirmPassword)
  }

  const validateConfirmPassword = (confirmPwd: string) => {
    setPasswordMatch(newPassword === confirmPwd)
  }

  if(!user) return null;

  return (
    <div className="min-h-screen mt-16 sm:mt-12 h-full bg-white dark:bg-background mb-12 sm:mb-0 ">
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          onClick={() => router.push("/account")}
          className=" mt-2 flex ml-1 bg-transparent active:scale-95 w-fit rounded-md cursor-pointer shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card "
        >
          <BackButton className="h-6 w-6 stroke-0 fill-gray-800 dark:fill-blue-300" />
        </Button>
        <h1 
        style={{fontFamily: "var(--font-xova)"}}
        className="text-2xl sm:text-3xl py-4 font-bold text-center text-gray-600 dark:text-white">
          Account setting
        </h1>
        <div className="w-4 h-4"/>
      </div>
      {isUserLoading ?
        <div className="h-full py-28 w-full flex items-center justify-center">
          <Loader/>
        </div>
        :
      <div className="space-y-6">
        <Card className="border-border bg-muted">
          <CardHeader>
            <CardTitle className="text-xl">Profile Information</CardTitle>
            <CardDescription>Update your account&apos;s profile information and email address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="relative">
                <div className="relative z-2 w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-transparent shadow-lg">
                  {profileImage ?
                      <Image
                        src={profileImage || "/placeholder.svg"}
                        alt={user?.name || "name"}
                        fill
                        className="object-cover rounded-full"
                      />
                      :
                      <UserIcon className="w-28 h-28 stroke-[12px] stroke-blue-600 fill-blue-600" />
                  }
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <div className="relative">
                    <Button
                      size="sm"
                      className="rounded-full h-8 w-8 p-0"
                      onClick={() => document.getElementById("profile-upload")?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <Edit className="h-5 w-5" />
                      )}
                    </Button>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-medium text-sm text-gray-500">Profile Picture</h3>
                <p className="text-sm text-gray-500">Click the edit button to upload a new profile picture.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <div className="flex gap-2">
                    <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} />
                    <Button onClick={handleNameSave}>Save</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled className="select-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact</Label>
                  <div className="flex gap-2">
                    <Input id="contact" value={contact} 
                    maxLength={10}
                    onChange={(e) => {
                      const value = e.target.value;
                       if (/^\d*$/.test(value)) {
                        setContact(value);
                      }
                    }}
                    placeholder="No contact number"
                    className="select-none placeholder:italic"/>
                    <Button onClick={handleContactSave}>Save</Button>
                   </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-muted">
          <CardHeader>
            <CardTitle className="text-xl">Security</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showPasswordFields ? (
              <Button variant="outline" onClick={() => setShowPasswordFields(true)} className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                {isPassword ? "Change Password" : "Set Password"}
              </Button>
            ) : (
              <div className="space-y-4 animate-in fade-in-50 duration-300">
                {isPassword  &&
                <>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      style={{fontFamily:"inter"}}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter your current password"
                    />
                  </div>
                  <Separator className="my-4" />
                </>
                }

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    style={{fontFamily:"inter"}}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value)
                      validatePassword(e.target.value)
                    }}
                    placeholder="Enter your new password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    style={{fontFamily:"inter"}}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      validateConfirmPassword(e.target.value)
                    }}
                    placeholder="Confirm your new password"
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <p className="font-medium">Password Requirements:</p>
                  <div className="flex items-center gap-2">
                    {passwordLength ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordMatch ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span>Passwords match</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handlePasswordChange}>Update Password</Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordFields(false)
                      setOldPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      }
    </div>
  )
}

