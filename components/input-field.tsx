'use client';

import {  useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const InputFieldOutline = ({
    label,
    bgColor,
    className,
    input,
    setInput,
    type,
    required,
    onChange,
    maxLength
    }:
    {
    label:string,
    bgColor:string,
    input:string,
    setInput?:React.Dispatch<React.SetStateAction<string>>,
    className?:string,
    type?:string,
    required?:boolean,
    onChange?:(value:string) => void,
    maxLength?:number
    }) => {
    const [focused,setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {

            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setFocused(false); // Blur when clicking outside
                inputRef.current?.blur();
            }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => {
          document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            if(setInput){
                setInput(inputRef.current.value); // Update state if autofilled
            }
            else {
               if (onChange) onChange(inputRef.current.value); // Call onChange if provided
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setInput]);

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        if(!onChange) {
           if(setInput) setInput(e.target.value);
        }
        else {
            onChange(e.target.value);
        }
    }
    
  
  return (
    <div 
    ref={containerRef}
    style={{marginTop:"12px"}}
    className={cn(`w-full `,"relative mt-4")}
    onClick={() => {
        setFocused(true);
        inputRef.current?.focus();
      }}
    >
        {/* Label */}
        <div 
        className={cn("absolute h-full w-fit top-0 left-[2%] text-sm flex items-center px-1 text-gray-400",
            (focused || input != "" ) && `-top-[28%] text-[12px] bg-${bgColor} h-fit`,
            "transition-all duration-200 ease-in-out"
        )}
        onClick={() => inputRef.current?.focus()}
        >
            <span>{label}</span>
        </div>

        {/* Imput */}
        <Input
            ref={inputRef}
            type={type || "text"}
            value={input}
            onChange={handleChange}
            required={required ? true : false}
            maxLength={maxLength}
            className={cn(`text-sm w-full bg-${bgColor} rounded-sm focus-visible:ring-0 focus-visible:border-blue-400 focus-visible:border-2`,className)}
        />
    </div>
  )
};




