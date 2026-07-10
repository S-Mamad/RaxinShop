"use client";

import { useEffect, useRef } from "react";
import { usePrefs } from "@/context/PrefsContext";
import { useContextAware } from "@/context/ContextAwareContext";
import { useCopy } from "@/hooks/useCopy";
import { useToast } from "@/components/ui/Toast";
import { installConsoleArt, installKonami } from "@/lib/easter-eggs";

export function BootstrapEffects() {
  const { hydrated, returningVisitor, markWelcomeSeen, mode } = usePrefs();
  const { lowBattery, slowNetwork } = useContextAware();
  const copy = useCopy();
  const { pushToast } = useToast();
  const welcomed = useRef(false);
  const batteryTold = useRef(false);
  const networkTold = useRef(false);

  useEffect(() => {
    installConsoleArt();
    return installKonami();
  }, []);

  useEffect(() => {
    if (!hydrated || welcomed.current) return;
    if (returningVisitor) {
      welcomed.current = true;
      pushToast(
        mode === "executive"
          ? copy.welcomeBack
          : copy.welcomeBack,
      );
      markWelcomeSeen();
    }
  }, [
    hydrated,
    returningVisitor,
    mode,
    copy.welcomeBack,
    pushToast,
    markWelcomeSeen,
  ]);

  useEffect(() => {
    if (!hydrated) return;
    if (lowBattery && !batteryTold.current) {
      batteryTold.current = true;
      pushToast(copy.lowBattery);
    }
  }, [hydrated, lowBattery, copy.lowBattery, pushToast]);

  useEffect(() => {
    if (!hydrated) return;
    if (slowNetwork && !networkTold.current) {
      networkTold.current = true;
      pushToast(copy.slowNetwork);
    }
  }, [hydrated, slowNetwork, copy.slowNetwork, pushToast]);

  return null;
}
