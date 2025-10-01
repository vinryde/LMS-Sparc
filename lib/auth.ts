import "server-only";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db";
import { emailOTP } from "better-auth/plugins"
import { resend } from "./resend";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    socialProviders: {
      google: { 
          clientId: process.env.GOOGLE_CLIENT_ID as string, 
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
      }, 
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
    })
  ]
  //...
});