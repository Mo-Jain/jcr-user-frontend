"use client"

import type React from "react"
import BackButton from "@/public/back-button.svg";
import { useState, useRef, useEffect, useCallback } from "react"
import { User, Phone, MapPin, FileText, Upload, X, Edit,  Eye,  Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { BASE_URL } from "@/lib/config"
import LoadingScreen from "@/components/loading-screen"
import { uploadToDrive } from "@/app/actions/upload"
import { } from "@radix-ui/react-dialog"
import {  Dialog, DialogContent, DialogDescription, DialogTitle,DialogFooter, DialogHeader, DialogOverlay } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/lib/store";

export interface Customer {
  id: number;
  name: string;
  contact: string;
  address?: string;
  email?: string;
  folderId: string;
  documents?: Document[];
}
export interface Document {
  id: number;
  name: string;
  url: string;
  type: string;
  docType: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function KYCPage() {

  const [customer, setCustomer] = useState<Customer>(); 
  const [isEditable, setIsEditable] = useState(false)
  const [address, setAddress] = useState("")
  const [aadharFiles, setAadharFiles] = useState<File[]>([])
  const [licenseFiles, setLicenseFiles] = useState<File[]>([])
  const [aadharPreviews, setAadharPreviews] = useState<{url:string,fileIndex:number}[]>([])
  const [licensePreviews, setLicensePreviews] = useState<{url:string,fileIndex:number}[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const aadharInputRef = useRef<HTMLInputElement>(null)
  const licenseInputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0);
  const { toast } = useToast()
  const [isDialogOpen,setIsDialogOpen] = useState(false);
  const router = useRouter();
  const [isKYCDone,setIsKYCDone] = useState(true);
  const [email,setEmail] = useState("");
  const [loadingMessage,setLoadingMessage] = useState("Uploading documents");
  const [deletedPhotos,setDeletedPhotos] = useState<{id:number,url:string}[]>([]);
  const [hasUploaded,setHasUploaded] = useState(false);
  const {kycStatus,setKycStatus} = useUserStore();
  const [errors, setErrors] = useState<FormErrors>({});
  const [contact,setContact] = useState<string>("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/v1/customer/me`, {
          headers: {
            "Content-type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCustomer(res.data.customer);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const updateCustomer = useCallback(() => {
    if (customer) {
      if(customer.address) setAddress(customer.address);
      if(customer.email) setEmail(customer.email);
      if(customer.contact) setContact(customer.contact);
      if(customer.documents){
        const newAadharPreviews:{url:string,fileIndex:number}[] = [];
        const newLicensePreviews:{url:string,fileIndex:number}[] = [];
        for(const document of customer.documents){
          if(document.docType === "aadhar") newAadharPreviews.push({url:document.url,fileIndex:-1});
          else if(document.docType === "license") newLicensePreviews.push({url:document.url,fileIndex:-1});
        }
        setAadharPreviews(newAadharPreviews);
        setLicensePreviews(newLicensePreviews);
      }
      if(!customer.address || !customer.documents) setIsKYCDone(false);
    }
  }, [customer]); // Dependencies

  useEffect(() => {
      updateCustomer();
  }, [customer,updateCustomer]);

  // Toggle editability
  const toggleEditable = () => {
    setIsEditable(!isEditable);
    setHasUploaded(false);
    setDeletedPhotos([]);
    updateCustomer();
    setErrors((prev) => ({...prev, address: "", email: "", aadharFiles: "", licenseFiles: ""}))
  }

  // Handle address change
  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAddress(e.target.value)
    setErrors((prev) => ({...prev, address: ""}))
  }
  
  if(!customer) 
    return <LoadingScreen/>;

  // Handle file upload for Aadhar
  const handleAadharUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !isEditable) return
    setErrors((prev) => ({...prev, aadharFiles: ""}))
    const newFile = e.target.files[0]

    if (aadharPreviews.length > 1) {
      toast({
        title: "Upload limit exceeded",
        description: "You can only upload up to 2 files for Aadhar card.",
        variant: "destructive",
      })
      return
    }

    setAadharFiles([...aadharFiles, newFile])

    // Create previews
    const newPreviews = {url:URL.createObjectURL(newFile),new:true,fileIndex:aadharFiles.length}
    setAadharPreviews([...aadharPreviews, newPreviews])
    setHasUploaded(true);
  }

  // Handle file upload for License
  const handleLicenseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !isEditable) return
    setErrors((prev) => ({...prev, licenseFiles: ""}))
    const newFiles = Array.from(e.target.files)

    if (licensePreviews.length + newFiles.length > 2) {
      toast({
        title: "Upload limit exceeded",
        description: "You can only upload up to 2 files for Driving License.",
        variant: "destructive",
      })
      return
    }

    setLicenseFiles([...licenseFiles, ...newFiles])

    // Create previews
    const newPreviews = newFiles.map((file) => {
      return {url:URL.createObjectURL(file),new:true,fileIndex:licenseFiles.length}
    })
    setLicensePreviews([...licensePreviews, ...newPreviews])
    setHasUploaded(true);
  }

  // Remove Aadhar file, fileIndex is index of file in aadharFiles array
  const removeAadharFile = (index: number,url:string,fileIndex:number) => {
    if (!isEditable) return

    //remove new file from files array
    if(fileIndex !== -1) {
      const newFiles = aadharFiles.filter((file,i) => {
        if(i === fileIndex) {
          return false
        };
        return true;
      })
      setAadharFiles(newFiles)
      if(newFiles.length === 0 && licenseFiles.length === 0) setHasUploaded(false);
    }

    const newPreviews = [...aadharPreviews]
    URL.revokeObjectURL(newPreviews[index].url)
    newPreviews.splice(index, 1)
    //updating fileIndex of next new file
    if(fileIndex === 0){
      const nextFileIndex = newPreviews.findIndex((preview) => preview.fileIndex === 1);
      if(nextFileIndex !== -1) newPreviews[nextFileIndex].fileIndex = 0;
    }
    setAadharPreviews(newPreviews)

    if(fileIndex == -1  && customer.documents){
      const document = customer.documents.find((document) => document.url === url);
      if(document) setDeletedPhotos((prev) => [...prev,{id:document.id,url:document.url}]);
    }
  }

  // Remove License file, fileIndex is index of file in licenseFiles array
  const removeLicenseFile = (index: number,url:string,fileIndex:number) => {
    if (!isEditable) return

    //remove new file from files array
    if(fileIndex !== -1) {
      const newFiles = licenseFiles.filter((file,i) => {
        if(i === fileIndex) {
          return false
        };
        return true;
      })
      setLicenseFiles(newFiles)
      if(newFiles.length === 0 && aadharFiles.length === 0) setHasUploaded(false);
    }

    const newPreviews = [...licensePreviews]
    URL.revokeObjectURL(newPreviews[index].url)
    newPreviews.splice(index, 1)
    //updating fileIndex of next new file
    if(fileIndex === 0){
      const nextFileIndex = newPreviews.findIndex((preview) => preview.fileIndex === 1);
      if(nextFileIndex !== -1) newPreviews[nextFileIndex].fileIndex = 0;
    }
    setLicensePreviews(newPreviews);
    if(fileIndex == -1 && customer.documents){
      const document = customer.documents.find((document) => document.url === url);
      if(document) setDeletedPhotos((prev) => [...prev,{id:document.id,url:document.url}]);
    }
  }

  // Preview image
  const openPreview = (imageUrl: string) => {
    setPreviewImage(imageUrl)
    setIsPreviewOpen(true)
  }

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (email === "") newErrors.email = "This field is mandatory";
    if (address === "" ) newErrors.address = "This field is mandatory";
    if(aadharFiles.length + aadharPreviews.length === 0) newErrors.aadharFiles = "documents are required";
    if(licenseFiles.length + licensePreviews.length === 0) newErrors.licenseFiles = "documents are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Submit form
  const handleSubmit = async() => {
    try{
      const resAadhar = [];
      const resLicense = [];
      let overallProgress = 0;
      if (!validateForm()) {
        toast({
          description: `Please fill required fields`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000,
        });
        setIsEditable(true);
        return;
      }
      setIsLoading(true);
      setProgress(overallProgress);
      const updatedDocuments:Document[] = [];
      if(hasUploaded){
        toast({
          description: "Please wait, uploading documents...",
          duration: 5000,
        });
        const totalSize = Object.values([...aadharFiles,...licenseFiles]).reduce(
          (acc, file) => acc + file.size,
          0,
        );

        if (aadharFiles.length > 0) {
          let cnt = 0;
          for (const file of aadharFiles) {
            const res = await uploadToDrive(file, customer.folderId);
            if (res.error) {
              throw new Error("Failed to upload documents");
              return;
            }
            resAadhar.push({ ...res, id: cnt });
            cnt++;
            overallProgress += Math.round((file.size / totalSize) * 100) * 0.98;
            setProgress(overallProgress);
          }
        }
        if (licenseFiles.length > 0) {
          let cnt = 0;
          for (const file of licenseFiles) {
            const res = await uploadToDrive(file, customer.folderId);
            if (res.error) {
              throw new Error("Failed to upload documents");
              return;
            }
            resLicense.push({ ...res, id: cnt });
            cnt++;
            overallProgress += Math.round((file.size / totalSize) * 100) * 0.98;
            setProgress(overallProgress);
          }
        }

        if(resAadhar){
          const resDocs = resAadhar.map((file) => {
            return {
              id: file.id || 0,
              name: file.name || "",
              url: file.url || "",
              type: file.type || "",
              docType: "aadhar",
            };
          });
          updatedDocuments.push(...resDocs);
        }
        
        if(resLicense){
          const resDocs = resLicense.map((file) => {
            return {
              id: file.id || 0,
              name: file.name || "",
              url: file.url || "",
              type: file.type || "",
              docType: "license",
            };
          });
          updatedDocuments.push(...resDocs);
        }
      }
      setProgress(100);
      setLoadingMessage("Updating details");
      await axios.put(
      `${BASE_URL}/api/v1/customer/${customer.id}`,
      {
        name: customer.name,
        contact: contact !== "" ? contact : undefined,
        address: address,
        email:email,
        documents: updatedDocuments.length > 0 ? updatedDocuments : undefined,
        deletedPhotos: deletedPhotos.length > 0 ? deletedPhotos : undefined,
        kycStatus: kycStatus === "pending" ? "under review" : undefined
      },
      {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ` + localStorage.getItem("token"),
        },
      },
      );
      if(resAadhar.length > 0) {
        const newAadharPreviews:{url:string,fileIndex:number}[] = [];
        if(customer.documents){
          for(const doc of customer.documents){
            if(doc.docType !== "aadhar") continue;
            if(deletedPhotos.find((photo) => photo.id === doc.id)) continue;
            newAadharPreviews.push({url:doc.url,fileIndex:-1});
          }
        }
        for(const file of updatedDocuments){
          if(file.docType !== "aadhar") continue;
          newAadharPreviews.push({url:file.url,fileIndex:-1});
        }
        setAadharPreviews(newAadharPreviews);
      }
      if(kycStatus === "pending" ) {
        setKycStatus("under review");
      }
      if(resLicense.length > 0) {
        const newLicensePreviews:{url:string,fileIndex:number}[] = [];
        if(customer.documents){
          for(const doc of customer.documents){
            if(doc.docType !== "license") continue;
            if(deletedPhotos.find((photo) => photo.id === doc.id)) continue;
            newLicensePreviews.push({url:doc.url,fileIndex:-1});
          }
        }
        for(const file of updatedDocuments){
          if(file.docType !== "license") continue;
          newLicensePreviews.push({url:file.url,fileIndex:-1});
        }
        setLicensePreviews(newLicensePreviews);
      }
      setAadharFiles([]);
      setLicenseFiles([]);
      setProgress(100);
      setIsLoading(false);
      }catch(error){
        console.log(error);
        toast({
          description: `KYC failed to update`,
          className:
            "text-black bg-white border-0 rounded-md shadow-mg shadow-black/5 font-normal",
          variant: "destructive",
          duration: 2000,
        });
        setIsLoading(false);
        return;
      }
      setIsEditable(false);
      setIsLoading(false);
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 bg-gray-200 dark:bg-background`}>
      <div className="max-w-4xl mx-auto pt-20 sm:pt-16">
        <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
            <Button
                onClick={() => router.push("/account")}
                className=" flex mr-2 mt-1 -ml-2 bg-transparent active:scale-95 w-fit rounded-md cursor-pointer shadow-none justify-start text-black border dark:border-card border-gray-200 hover:bg-gray-200 dark:hover:bg-card "
                >
                <BackButton className="h-6 w-6 stroke-0 fill-gray-800 dark:fill-blue-300" />
            </Button>
            <h1 className="text-3xl font-bold">My Account </h1>
          </div>
          {!isEditable && <Button
              type="button"
              variant={"outline"}
              onClick={toggleEditable}
              disabled={kycStatus === "under review"}
              className={cn("gap-2 hover:bg-gray-200 dark:hover:bg-zinc-700 bg-transparent",
                !isKYCDone && "bg-primary",
                kycStatus === "under review" && "bg-primary bg-opacity-50 cursor-not-allowed hover:bg-opacity-50"
              )}
            >
              {kycStatus === "under review" ?
              <>
              <span>Under Verification</span>
              </>
              :
              <>
                {isKYCDone?
                <>
                <Edit className="h-4 w-4" />
                  Update Details
                </>
                :
                <>Complete KYC</>
                }
              </>
              }
            </Button>}
        </div>

        <div>
          <div className="space-y-6">
            {/* Customer Information Card */}
            <Card className="dark:bg-muted border-border">
              <CardHeader>
                <CardTitle>Information</CardTitle>
                <CardDescription>Your personal details are shown below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </Label>
                    <Input id="name" value={customer.name} disabled className="bg-muted/50" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="contact" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Contact Number
                    </Label>
                    <Input id="contact" value={contact}
                    maxLength={10}
                     onChange={(e) => {
                      const value = e.target.value;
                       if (/^\d*$/.test(value)) {
                        setContact(value);
                      }
                    }} 
                    disabled={!isEditable || customer.contact === ""} className="bg-muted/50" />
                  </div>
                </div>
                <div className="">
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4" /> Email Address
                    {isEditable && email.length === 0 && <span className="text-sm text-red-400">*</span>}
                  </Label>
                  <Input id="email" 
                  placeholder="Enter your email address" 
                  value={email} 
                  disabled={!isEditable} 
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setErrors((prev) => ({...prev, email: ""}))
                  }} 
                  className={cn("bg-muted/50", errors.email && "border border-red-500")} />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card className="dark:bg-muted border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Address Details</span>
                  {isEditable && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 border-border text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Editable
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="">
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4" /> Residential Address
                    {isEditable && address.length === 0 && <span className="text-sm text-red-400">*</span>}

                  </Label>
                  <Textarea
                    id="address"
                    value={address}
                    onChange={handleAddressChange}
                    disabled={!isEditable}
                    className={`min-h-[100px] ${errors.address && "border border-red-500"}`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm">
                      {errors.address}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Document Upload Card */}
            <Card className="dark:bg-muted border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Document Verification</span>
                  {isEditable && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 border-border text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Editable
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Upload your identity and address proof documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Aadhar Card Upload */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> 
                    <span>Aadhar Card (Max 2 photos)</span>
                    {aadharFiles.length + aadharPreviews.length === 0 && <span className="text-red-500 text-sm">*</span>}
                    {errors.aadharFiles && <span className="text-red-500 ml-2 text-sm">{errors.aadharFiles}</span>}
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aadharPreviews.map((preview, index) => (
                      <div key={index} className="relative border rounded-md overflow-hidden group">
                        <Image
                          src={preview.url || "/placeholder.svg"}
                          alt={`Aadhar ${index + 1}`}
                          height={2000}
                          width={2000}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button type="button" variant="secondary" className="bg-white/30 backdrop-blur-lg hover:bg-white/20" size="icon" onClick={() => openPreview(preview.url)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isEditable && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeAadharFile(index,preview.url,preview.fileIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {aadharPreviews.length < 2 && isEditable && (
                      <div
                        className="border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => aadharInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload Aadhar Card</p>
                        <p className="text-xs text-muted-foreground mt-1">{aadharPreviews.length}/2 images</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={aadharInputRef}
                    onChange={handleAadharUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={!isEditable || aadharFiles.length >= 2}
                  />
                </div>

                {/* Driving License Upload */}
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> 
                    <span>Driving License (Max 2 photos)</span>
                    {licenseFiles.length + licensePreviews.length === 0 && <span className="text-red-500 text-sm">*</span>}
                    {errors.licenseFiles && <span className="text-red-500 ml-2 text-sm">{errors.licenseFiles}</span>}
                  </Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {licensePreviews.map((preview, index) => (
                      <div key={index} className="relative border rounded-md overflow-hidden group">
                        <Image
                          src={preview.url || "/placeholder.svg"}
                          alt={`License ${index + 1}`}
                          height={2000}
                          width={2000}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button type="button" variant="secondary" className="bg-white/30 backdrop-blur-lg hover:bg-white/20" size="icon" onClick={() => openPreview(preview.url)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isEditable && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeLicenseFile(index,preview.url,preview.fileIndex)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {licensePreviews.length < 2 && isEditable && (
                      <div
                        className="border-2 border-dashed rounded-md flex flex-col items-center justify-center h-40 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => licenseInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload Driving License</p>
                        <p className="text-xs text-muted-foreground mt-1">{licensePreviews.length}/2 images</p>
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    ref={licenseInputRef}
                    onChange={handleLicenseUpload}
                    accept="image/*"
                    className="hidden"
                    disabled={!isEditable || licenseFiles.length >= 2}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 items-center">
                {isEditable && !isLoading && <Button
                  type="button"
                  variant={"outline"}
                  onClick={toggleEditable}
                  className="gap-2 text-white bg-transparent w-full"
                >
                  Cancel
                </Button>}

                  <div className="w-full">
                    {isLoading && (
                      <div className="w-full border-2 border-border rounded-lg relative">
                        <div
                          style={{ width: `${progress}%` }}
                          className={`bg-primary rounded-lg text-white h-[35px] transition-all duration-300 ease-in-out hover:bg-opacity-80`}
                        />
                        <div
                          className={`w-full h-[35px] p-1 flex justify-center items-center absolute top-0 left-0 `}
                        >
                          <span className="text-black dark:text-white">
                           {loadingMessage}
                          </span>
                          <div className="flex items-end py-1 h-full">
                            <span className="sr-only">Loading...</span>
                            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-1 w-1 bg-white mx-[2px] border-border rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {isEditable && (
                      <Button
                        disabled={isLoading}
                        onClick={() => {
                          setIsDialogOpen(true);
                        }}
                        className={`w-full ${isLoading && "cursor-not-allowed active:scale-95 opacity-50"}`}
                      >
                        <span className="text-white">Save Changes</span>
                      </Button>
                    )}
                  </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
     

      {/* Image Preview Dialog */}
      <AlertDialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Document Preview</AlertDialogTitle>
            <AlertDialogDescription>Viewing uploaded document image</AlertDialogDescription>
          </AlertDialogHeader>
          <div className=" flex justify-center">
            {previewImage && (
              <Image
                src={previewImage || "/placeholder.svg"}
                alt="Document preview"
                height={2000}
                width={2000}
                className="max-h-[50vh] object-contain"
              />
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogOverlay className=" bg-black/50 backdrop-blur-lg"/>
        <DialogContent className="max-sm:w-full p-2 rounded-md  sm:max-w-[425px] bg-muted border-border">
          <DialogHeader>
            <DialogTitle>Update</DialogTitle>
            <DialogDescription className="text-grey-500">
              Are you sure you want to update the customer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 items-center mt-2">
            <Button
              className="max-sm:w-full  bg-primary hover:bg-opacity-10 active:scale-95 shadow-lg"
              onClick={() => {
                setIsEditable(false);
                handleSubmit();
                setIsDialogOpen(false);
              }}
            >
              Update
            </Button>
            <Button variant="outline" className="bg-transparent max-sm:w-full" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

