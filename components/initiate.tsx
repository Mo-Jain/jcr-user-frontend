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

const Initiate = () => {
  const { setName, setImageUrl,setUserId,setKycStatus,setKycStatusFlag } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isServerLoading, setIsServerLoading,isInitiateComplete } = useServerStore();
  const pathname = usePathname();
  const {setFavoriteCars} = useFavoriteStore();
  const {setCars,setIsCarLoading} = useCarStore();
  useEffect(() => {
    const fetchData = async () => {
      if( pathname.includes("/test")) return;
      try {
        setIsLoading(true);
        setIsCarLoading(true);
          setIsServerLoading(true);
          const res = await axios.get(`${BASE_URL}/api/v1/customer/me`, {
            headers: {
              "Content-type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setName(res.data.name);
          setImageUrl(res.data.imageUrl);
          setUserId(res.data.id);
          setKycStatus(res.data.customer.kycStatus);
          setKycStatusFlag(res.data.customer.approvedFlag);
          if(res.data.customer.kycStatus === "pending") setKycStatusFlag(true);
          const res1 = await axios.get(`${BASE_URL}/api/v1/customer/car/all`, {
            headers: {
              authorization: `Bearer ` + localStorage.getItem("token"),
            },
          });
          setCars(res1.data.cars);
          setIsCarLoading(false);
          const res2 = await axios.get(`${BASE_URL}/api/v1/customer/favorite-cars`, {
              headers: {
                authorization: `Bearer ` + localStorage.getItem("token"),
              },
            });
          setFavoriteCars(res2.data.favoriteCars);
          setIsServerLoading(false);
      } catch (error) {
          console.log(error);
          setIsServerLoading(false);
          setIsCarLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router,setName,setImageUrl,setIsServerLoading,setUserId]);

  if(pathname.includes("/test")) return null;

  if(isInitiateComplete && isServerLoading && pathname==="/") {
    return <SkeletonPreLoader/>
  } 
  else if (isLoading){
    return <SplashScreen setIsLoading={setIsLoading}/>
  }  
  return <InitiateScreen/>;
};

export default Initiate;
