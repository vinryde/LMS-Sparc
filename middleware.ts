/*import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

    // THIS IS NOT SECURE!
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*"], // Specify the routes the middleware applies to
};*/
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
   async function authMiddleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);

    
    // This is the recommended approach to optimistically redirect users
    // We recommend handling auth checks in each page/route
	if (!sessionCookie) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	return NextResponse.next();
}

export const config = {
  // matcher tells Next.js which routes to run the middleware on.
  // This runs the middleware on all routes except for static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};
const aj = arcjet({
  key: process.env.ARCJET_KEY as string, // Get your site key from https://app.arcjet.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW",
		"CATEGORY:SOCIAL",
		"CATEGORY:ACADEMIC",
		"CATEGORY:AI" // Link previews e.g. Slack, Discord
      ],
    }),
  ],
});
// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async(request: NextRequest)=>{
	if(request.nextUrl.pathname.startsWith("/admin")){
		return authMiddleware(request);
	}

	return NextResponse.next();
});