"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const {status} = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated"  && pathname !== "/test" && pathname !=="/policy" && pathname !=="/auth") {
      router.push('/auth');
    }
  }, [status, router, pathname]);
  return null;
};

export default Redirect;
