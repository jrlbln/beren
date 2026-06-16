"use client";

import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/lib/firebase";

export function FirebaseBootstrap() {
  useEffect(() => {
    initFirebaseAnalytics();
  }, []);

  return null;
}
