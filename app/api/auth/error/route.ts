import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const errorParam = searchParams.get("error") || "";

  console.log("Auth error URL triggered:", errorParam);

  // ✅ If the error indicates user limit reached, redirect to your page
  if (errorParam.includes("User_limit") || errorParam.includes("Sign-ups_are_closed")) {
    return NextResponse.redirect(new URL("/registrations-closed", req.url));
  }

  // ✅ Otherwise, fallback to a generic auth error page
  return NextResponse.redirect(new URL("/auth/error", req.url));
}
