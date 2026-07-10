"use client";

import type { ReactNode } from "react";
import { PrefsProvider } from "@/context/PrefsContext";
import { ContextAwareProvider } from "@/context/ContextAwareContext";
import { ToastProvider } from "@/components/ui/Toast";
import { BootstrapEffects } from "@/components/shell/BootstrapEffects";
import { FloatingAssistant } from "@/components/sections/FloatingAssistant";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <PrefsProvider>
      <ContextAwareProvider>
        <ToastProvider>
          <BootstrapEffects />
          {children}
          <FloatingAssistant />
        </ToastProvider>
      </ContextAwareProvider>
    </PrefsProvider>
  );
}
