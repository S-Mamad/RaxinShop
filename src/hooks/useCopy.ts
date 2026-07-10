"use client";

import { copyByMode } from "@/content/copy";
import { usePrefs } from "@/context/PrefsContext";

export function useCopy() {
  const { mode } = usePrefs();
  return copyByMode[mode];
}
