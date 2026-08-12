import { NextResponse } from "next/server";
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity";

// Entered from the Sanity Presentation tool so the client can click a page
// on the live site and see draft edits before they publish.
export const { GET } = process.env.SANITY_API_READ_TOKEN
  ? defineEnableDraftMode({
      client: sanityClient.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
    })
  : { GET: async () => NextResponse.json({ error: "SANITY_API_READ_TOKEN is not configured." }, { status: 503 }) };
