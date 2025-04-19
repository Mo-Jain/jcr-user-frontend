"use client";

import { BASE_URL } from "@/lib/config";
import {
  useCarStore,
  useFavoriteStore,
  useServerStore,
  useUserStore,
} from "@/lib/store";
import axios from "axios";
import SplashScreen from "./SplashScreen";
import InitiateScreen from "./InitiateScreen";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import SkeletonPreLoader from "./skeleton-loader";
import { useSession } from "next-auth/react";

const Initiate = () => {
  const { setName, setImageUrl,setUserId,setKycStatus,setKycStatusFlag } = useUserStore();
  const router = useRouter();
  const {isServerLoading,setIsServerLoading, isInitiateComplete } = useServerStore();
  const pathname = usePathname();
  const {setFavoriteCars} = useFavoriteStore();
  const {setCars,setIsCarLoading} = useCarStore();
  const {data:session,status} = useSession();
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if( pathname.includes("/test")) return;
      try {
        setIsLoading(true);
        setIsServerLoading(true);
        setIsCarLoading(true);
        const res1 = await axios.get(`${BASE_URL}/api/v1/customer/car/all`, {
          headers: {
            authorization: `Bearer ` + localStorage.getItem("token"),
          },
        });
        setCars(res1.data.cars);
        setIsCarLoading(false);
        if(session){
          setName(session.user.name);
          setImageUrl(session.user.image);
          setUserId(Number(session.user.id));
          const res = await axios.get(`${BASE_URL}/api/v1/customer/kyc-status`, {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setKycStatus(res.data.kycStatus);
          setKycStatusFlag(res.data.approvedFlag);
          if(res.data.kycStatus === "pending"){
            setKycStatusFlag(true);
          }
          const res2 = await axios.get(`${BASE_URL}/api/v1/customer/favorite-cars`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem("token"),
              },
            });
          setFavoriteCars(res2.data.favoriteCars);
        }
      } catch (error) {
          console.log(error);
          setIsCarLoading(false);
          setIsServerLoading(false);
      }
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router,setName,setImageUrl,setUserId,status]);

  if(pathname.includes("/test")) return null;

  // useEffect(() => {
  //   console.log("isInitiateComplete",isInitiateComplete);
  //   console.log("isServerLoading",isServerLoading);
  //   console.log("isLoading",isLoading);
  // }, [isInitiateComplete,isServerLoading,isLoading]);

  if(isInitiateComplete && isServerLoading && isLoading && (pathname==="/"|| pathname==="/auth")) {
    return <SkeletonPreLoader/>
  } 
  else if (!isInitiateComplete){
    return <SplashScreen/>
  }
  return <InitiateScreen/>;
};

export default Initiate;
