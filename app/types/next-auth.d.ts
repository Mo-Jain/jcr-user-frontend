import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      image: string;
      access_token: string;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    name: string;
    image:stirng;
    access_token: string;
  }

  interface Profile {
    id: string;
    name: string;
    image:string;
    access_token: string;
  }
}
