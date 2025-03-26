'use client';
import { Star } from "lucide-react";
import React, { useEffect } from "react"

const SkeletonPreLoader = () => {
  const repeatCount = Array.from({ length: 10 });

  useEffect(() => {
    document.documentElement.classList.add("no-scroll");

    return () => {
      document.documentElement.classList.remove("no-scroll");
    };
  }, []);

  return (
    <div style={{ zIndex: 90 }}
    className="flex fixed top-[81px] sm:top-[55px] left-0 overflow-hidden scrollbar-hide flex-col z-0 bg-blue-200 dark:bg-black items-center w-full py-2">
        <div className=" my-0 relative py-4 pb-12 w-full  flex justify-center items-center">
          <div className="relative w-[326px] h-[212px] sm:w-[565px] sm:h-[267px] rounded-lg bg-white/20 dark:bg-muted backdrop-blur-lg flex flex-col items-center px-5 py-3 sm:px-10 sm:py-6">
              <div className="w-[218px] h-[25px] sm:w-[270px] sm:h-[30px] mb-2 animate-pulse rounded-full bg-gray-400 bg-opacity-25 "/>
              <div className="w-full flex items-center gap-2 border rounded-sm border-black/10 dark:border-white/15 p-2 mb-4">
                <div className="w-7 h-6 mr-3 bg-gray-400 bg-opacity-25 rounded-sm animate-pulse"/>
                <div className="w-[80px] h-[22px] bg-gray-400 bg-opacity-25 rounded-sm animate-pulse"/>
              </div>
              <div className="relative z-10 flex items-center gap-2 sm:gap-8 w-full h-fit justify-between mb-6">
                <div className="flex flex-col rounded-sm p-4 sm:px-6 min-w-[136px] sm:min-w-[220px] border-2 gap-2 border-black/5 dark:border-white/15 ">
                  <div className="w-[40px] h-[17px] sm:w-[70px] animate-pulse sm:h-[29px] bg-gray-400 bg-opacity-25 rounded-sm"/>
                  <div className="w-[100px] h-[17px] sm:w-[170px] animate-pulse sm:h-[29px] bg-gray-400 bg-opacity-25 rounded-sm"/>
                </div>
                <div className="flex flex-col rounded-sm p-4 sm:px-6 min-w-[136px] sm:min-w-[220px] border-2 gap-2 border-black/5 dark:border-white/15 ">
                  <div className="w-[17px] h-[17px] sm:w-[35px] animate-pulse sm:h-[29px] bg-gray-400 bg-opacity-25 rounded-sm"/>
                  <div className="w-[100px] h-[17px] sm:w-[170px] animate-pulse sm:h-[29px] bg-gray-400 bg-opacity-25 rounded-sm"/>
                </div>
              </div>
              <div className="absolute -bottom-[10%] sm:-bottom-[8%] text-white left-0 w-full flex items-center justify-center">
                  <div className="w-[117px] sm:w-[132px] h-[38px] rounded-full bg-blue-200 dark:bg-muted">
                    <div className="w-[117px] sm:w-[132px] h-[38px] animate-pulse rounded-full bg-gray-400 bg-opacity-25 backdrop-blur-lg dark:bg-zinc-600"/>
                  </div>
              </div>
          </div>
        </div>
        <div className="py-6 bg-white w-[98%] h-full bg-opacity-30 dark:bg-opacity-10 rounded-t-md backdrop-blur-lg sm:px-4 px-2">
            <div
              className="w-full pb-4 border-b border-border"
            >
              <div className="w-[70px] h-[25px] sm:w-[90px] sm:h-[38px] rounded-sm animate-pulse bg-gray-400 bg-opacity-25"/>
            </div>
            <div
                className="flex items-center py-4 gap-2 overflow-hidden mx-2"
              >
                {repeatCount.map((_, index) => (
                <div 
                key={index}
                className="py-2 px-1 z-0 border  border-border shadow-sm  bg-white dark:bg-muted rounded-md cursor-pointer">
                  <div className="flex flex-col relative justify-between gap-1 sm:px-1 rounded-sm z-0">
                    <div className="w-[150px] h-[100px] max-sm:px-1 sm:w-[238px] sm:h-[202px] relative overflow-hidden skeleton border px-1 border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 rounded-lg "/>
                    <div className="w-full sm:px-2 flex flex-col justify-around items-start gap-1 mt-1  min-h-[86px] sm:min-h-[100px]">
                      <div className="w-[122px] h-[15px] sm:w-[142px] sm:h-[18px] bg-gray-400 bg-opacity-25 animate-pulse rounded-sm"/>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-sm bg-gray-400 bg-opacity-25 animate-pulse"/>
                        <div className="w-[52px] h-[17px] sm:w-[63px] sm:h-[22px] animate-pulse rounded-sm bg-gray-400 bg-opacity-25"/>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-2 sm:h-4 sm:w-3 rounded-sm animate-pulse bg-gray-400 bg-opacity-25"/>
                          <div className="h-3 w-[41px] sm:h-4 sm:w-[50px] animate-pulse rounded-sm bg-gray-400 bg-opacity-25"/>
                        </div>
                        <div className="rounded-full -ml-2 w-[56px] h-[25px] animate-pulse sm:w-[61px] sm:h-[29px] bg-gray-400 bg-opacity-25"/>
                        <Star className="h-4 w-4 fill-gray-200 text-gray-200 dark:fill-card dark:text-card animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
        <div className="py-6 bg-white w-[98%] h-full bg-opacity-30 dark:bg-opacity-10 mt-2 backdrop-blur-lg sm:px-4 px-2">
            <div
              className="w-full pb-4 border-b border-border"
            >
              <div className="w-[100px] h-[25px] sm:w-[150px] sm:h-[38px] rounded-sm animate-pulse bg-gray-400 bg-opacity-25"/>
            </div>
            <div
                className="flex items-center py-4 gap-2 overflow-hidden mx-2"
              >
                {repeatCount.map((_, index) => (
                <div 
                key={index}
                className="py-2 px-1 z-0 border  border-border shadow-sm  bg-white dark:bg-muted rounded-md cursor-pointer">
                  <div className="flex flex-col relative justify-between gap-1 sm:px-1 rounded-sm z-0">
                    <div className="w-[150px] h-[100px] max-sm:px-1 sm:w-[238px] sm:h-[202px] border px-1 relative overflow-hidden skeleton border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/10 rounded-lg "/>
                    <div className="w-full sm:px-2 flex flex-col justify-around items-start gap-1 mt-1  min-h-[86px] sm:min-h-[100px]">
                      <div className="w-[122px] h-[15px] sm:w-[142px] sm:h-[18px] bg-gray-400 bg-opacity-25 animate-pulse rounded-sm"/>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded-sm bg-gray-400 bg-opacity-25 animate-pulse"/>
                        <div className="w-[52px] h-[17px] sm:w-[63px] sm:h-[22px] animate-pulse rounded-sm bg-gray-400 bg-opacity-25"/>
                      </div>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-1">
                          <div className="h-3 w-2 sm:h-4 sm:w-3 rounded-sm animate-pulse bg-gray-400 bg-opacity-25"/>
                          <div className="h-3 w-[41px] sm:h-4 sm:w-[50px] animate-pulse rounded-sm bg-gray-400 bg-opacity-25"/>
                        </div>
                        <div className="rounded-full -ml-2 w-[56px] h-[25px] animate-pulse sm:w-[61px] sm:h-[29px] bg-gray-400 bg-opacity-25"/>
                        <Star className="h-4 w-4 fill-gray-400 text-gray-400 animate-pulse opacity-25" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
    </div>
  )
};

export default SkeletonPreLoader;
