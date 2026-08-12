import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getAbsoluteUrl } from "@/lib/site";

export async function GET() {
  (await draftMode()).disable();
  return NextResponse.redirect(getAbsoluteUrl("/"));
}
