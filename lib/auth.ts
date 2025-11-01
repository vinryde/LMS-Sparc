import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { emailOTP, admin } from "better-auth/plugins"
import { resend } from "./resend";
import { APIError } from "better-auth/api"
import { redirect } from "next/navigation";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
      google: { 
          clientId: process.env.GOOGLE_CLIENT_ID as string, 
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
      }, 
  },onAPIError: {
		throw: true,
		onError: (error, ctx) => {
			// Custom error handling
			console.error("Auth error:", error);
			if(error === "User_limit_of_100_has_been_reached._Sign-ups_are_closed."){
				redirect("/registrations-closed");
			}
		},
		errorURL: "/registrations-closed"
  
    
	},
  plugins: [
    emailOTP({
        async sendVerificationOTP(email){
           await resend.emails.send({
            from: 'SPARC LMS <onboarding@resend.dev>',
            to: [email.email],
            subject: 'SPARC LMS Verification Code',
            html: `<p>Your verification code is: <strong>${email.otp}</strong></p>`,
          });
          
            
        }
    }),
    admin(),

  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {

          const count = await prisma.user.count();
          if (count > 100) {
            throw new APIError("BAD_REQUEST", {
              message: "User limit of 100 has been reached. Sign-ups are closed.",
            });
          
        
           
          }
          // Otherwise continue with creating the user
          return { data: user };
        },
      },
    },
  },
  //...
});