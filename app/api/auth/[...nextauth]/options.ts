import { BASE_URL } from "@/lib/config";
import axios from "axios";
import {NextAuthOptions} from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "Password",
        },
      },
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(credentials):Promise<any> {
        try{
            if(!credentials ){
                throw new Error("Invalid Credentials");
            }
            const response = await axios.post(`${BASE_URL}/api/v1/customer/signin`, 
            {
                username: credentials.username,
                password: credentials.password,
            },
            {
                headers: {
                "Content-type": "application/json",
                },
            });

            const {data} = response

            if(response.status !== 200){
                throw new Error("Invalid Credentials");
            }

            return {
                id:data.id,
                name:data.name,
                image:data.image,
                access_token:data.token,
            }
        }catch(error){
          if (axios.isAxiosError(error)) {
            // Extract error details from the response
            console.error(" Sign-In Failed:", error.response?.data.message || "Unknown error");
            throw new Error(error.response?.data.message || "Something went wrong");
          } else {
            console.error(" Sign-In Failed:Something went wrong", error);
            throw new Error("Something went wrong");
          }
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline", // Ensures refresh token is provided
          scope: 'https://www.googleapis.com/auth/userinfo.profile openid email',
          response_type: "code",
        },
      },
      async profile(profile) {
        try {
          console.log("Google Profile", profile);

          // Call your backend to authenticate the user via Google
          const response = await axios.post(
            `${BASE_URL}/api/v1/customer/signin`,
            {
              username: profile.email, // Using email as username
              provider: "google", // Indicate this is a Google login
              imageUrl: profile.picture,
              name: profile.name,
            },
            { headers: { "Content-Type": "application/json" } }
          );

          const { data } = response;
          if (response.status !== 200) throw new Error("Google Sign-In Failed");

          return {
            id: data.id,
            name: data.name || profile.name,
            email: profile.email,
            image: data.image || profile.picture,
            access_token: data.token,
            kycStatus: data.kycStatus,
            approvedFlag: data.approvedFlag,
          };
        } catch (error) {
          console.error("Google Sign-In Failed", error);
          throw new Error("Google Sign-In Failed");
        }
      },
    }),
  ],
  callbacks: {
    
    async session({ session, token, }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.access_token = token.access_token as string;
      }
      return session;
    },
    async jwt({ token, user}) {
        if (user) {
          token.id = user.id;
          token.access_token = user.access_token;
        }
        return token;
      },
  },
  pages: {
    signIn: "/auth"
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  
};