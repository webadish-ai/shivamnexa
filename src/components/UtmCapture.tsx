"use client";

import { useEffect } from "react";
import { captureUtmFromLocation } from "@/lib/utm";

export default function UtmCapture() {
  useEffect(() => {
    captureUtmFromLocation();
  }, []);
  return null;
}
