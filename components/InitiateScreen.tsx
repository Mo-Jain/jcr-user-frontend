"use client";
import { usePathname } from "next/navigation";
import Logo1 from "@/public/logo.svg";
import { useServerStore } from "@/lib/store";

const InitiateScreen = () => {
  const pathname = usePathname();
  const {isInitiateComplete} = useServerStore();
  if ( pathname != "/") return null;

  return (
    <div className={`relative ${isInitiateComplete ? "hidden":""}`}>
      <div className="fixed top-0 left-0 z-[999999] w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-xl">
        <Logo1 className="h-[120px] w-[140px] z-10 stroke-[1px] stroke-white" />
      </div>
    </div>
  );
};

export default InitiateScreen;
