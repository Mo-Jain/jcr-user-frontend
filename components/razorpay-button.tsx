import { toast } from "@/hooks/use-toast";
import { BASE_URL } from "@/lib/config";
import { useUserStore } from "@/lib/store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MdFormatListBulleted } from "react-icons/md";

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayPrefill {
  name?: string;
  email?: string;
  contact?: string;
}

interface RazorpayDisplayConfig {
  blocks: Record<
    string,
    {
      name: string;
      instruments?: { method: string }[];
    }
  >;
  sequence: string[];
  preferences: {
    show_default_blocks?: boolean;
  };
}

interface RazorpayModal {
  ondismiss?: () => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  image?: string;
  order_id: string;
  description?: string;
  prefill?: RazorpayPrefill;
  handler: (response: RazorpayHandlerResponse) => void;
  theme?: {
    color?: string;
  };
  config?: {
    display: RazorpayDisplayConfig;
  };
  modal?: RazorpayModal;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  on(event: "payment.failed", handler: (response: RazorpayHandlerResponse) => void): void;
}

const PaymentButton = ({
        selectedMethod,
        totalAmount,
        onSuccess,
        bookingId,
        setIsLoading,
        children,
        className,
        status,
        disabled
    }:{
        selectedMethod:"card" | "upi" | "netbanking" | "wallet" | "all",
        totalAmount:number,
        onSuccess?:(method:string)=>void,
        bookingId:string,
        setIsLoading?:(value:boolean) => void,
        children: React.ReactNode;
        className?:string;
        status?:string;
        disabled?:boolean;
    }) => {
    const {name} = useUserStore();
    const [email,setEmail] = useState("");
    const [contact,setContact] = useState("");
  

    const createOrder = async () => {
      if(disabled) return;
        try {
          if(setIsLoading) setIsLoading(true);
          const check = await axios.get(`${BASE_URL}/api/v1/razorpay/recent-pending/${bookingId}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
      
          if (check?.data?.order) {
            console.log("Reusing existing order:", check.data.order.id);
            openRazorpayCheckout(check.data.order);
          } else {
            const res = await axios.post(`${BASE_URL}/api/v1/razorpay/order/${bookingId}`, {
              amount: totalAmount * 100,
            }, {
              headers: {
                "Content-type": "application/json",
                authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
      
            openRazorpayCheckout(res.data.order);
          }
        } catch (err) {
          console.log(err);
          toast({ description: "Something went wrong", variant: "destructive" });
          if(setIsLoading) setIsLoading(false);
          return;
        }
        if(setIsLoading) setIsLoading(false);
      };
      

    const openRazorpayCheckout = (order: RazorpayOrder) => {
        const paymentOptions: RazorpayOptions = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
          amount: order.amount,
          currency: order.currency,
          order_id: order.id,
          name: 'Jain Car Rentals',
          description: `Pay ₹${totalAmount} to book your car`,
          prefill: {
            name,
            email,
            contact,
          },
          handler: async function (response: RazorpayResponse) {
            const options2 = {
              order_id: order.id,
              signature: response.razorpay_signature,
              payment_id: response.razorpay_payment_id,
              method: selectedMethod,
              status: status,
            };
            try {
              
              const res = await axios.post(`${BASE_URL}/api/v1/razorpay/payment-status`, options2, {
                headers: {
                  "Content-type": "application/json",
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              if (res?.data?.success) {
                toast({
                  title: "Payment Successful",
                  duration: 2000,
                });
                if(onSuccess) onSuccess(res.data.paymentMethod);
              } else {
                toast({
                  title: "Payment Failed",
                  duration: 2000,
                  variant: "destructive",
                });
              }
              if(setIsLoading) setIsLoading(false);
            } catch (error) {
              console.log(error);
              toast({
                title: "Payment Failed",
                duration: 2000,
                variant: "destructive",
              });
              if(setIsLoading) setIsLoading(false);
            }
          },
          config: {
            display: {
              blocks: {
                only: {
                  name: `${selectedMethod.toUpperCase()} Payment`,
                  instruments: selectedMethod === "all" ? undefined : [{ method: selectedMethod }],
                },
              },
              sequence: ["block.only"],
              preferences: {
                show_default_blocks: selectedMethod === "all",
              },
            },
          },
          modal: {
            ondismiss: async function () {
              console.log("User dismissed Razorpay window");
              await axios.put(`${BASE_URL}/api/v1/razorpay/cancel-order`, {
                order_id: order.id,
              }, {
                headers: {
                  "Content-type": "application/json",
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              });
              if(setIsLoading) setIsLoading(false)
            },
          },
        };
          
        const paymentObj = new window.Razorpay(paymentOptions);
        
        paymentObj.on('payment.failed', function () {
            toast({
            title: 'Payment Failed',
            duration: 2000,
            variant: 'destructive',
            });
        });

        paymentObj.open();
      };
      

    const loadScript = (): Promise<boolean> => {
        return new Promise((resolve) => {
          if (document.getElementById('razorpay-script')) return resolve(true);
    
          const script = document.createElement('script');
          script.id = 'razorpay-script';
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

    useEffect(() => {
        loadScript()
    },[]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/v1/customer/me`, {
                    headers: {
                        "Content-type": "application/json",
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setEmail(res.data.email);
                setContact(res.data.contact);
            }
                catch (error) {
                console.log(error);
            }
        };
        fetchData();
      }, []);
  return (
  <>
    <div
      onClick={createOrder}
      className={cn(" active:scale-95 cursor-pointer",className,
        disabled && "cursor-not-allowed bg-opacity-70"
      )}
      >
        {children}
    </div>
  </>
  )
};

export default PaymentButton;
