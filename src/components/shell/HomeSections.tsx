"use client";

import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { ClientLogos } from "@/components/sections/ClientLogos";
import { BentoSkills } from "@/components/sections/BentoSkills";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { ContactIDE } from "@/components/sections/ContactIDE";

const ArchitectureDiagram = dynamic(
  () =>
    import("@/components/sections/ArchitectureDiagram").then(
      (m) => m.ArchitectureDiagram,
    ),
  { ssr: false },
);
const WarStories = dynamic(
  () =>
    import("@/components/sections/WarStories").then((m) => m.WarStories),
  { ssr: false },
);
const SystemStatus = dynamic(
  () =>
    import("@/components/sections/SystemStatus").then((m) => m.SystemStatus),
  { ssr: false },
);
const InteractiveTerminal = dynamic(
  () =>
    import("@/components/sections/InteractiveTerminal").then(
      (m) => m.InteractiveTerminal,
    ),
  { ssr: false },
);
const DevWorkflow = dynamic(
  () =>
    import("@/components/sections/DevWorkflow").then((m) => m.DevWorkflow),
  { ssr: false },
);
const GitHubActivity = dynamic(
  () =>
    import("@/components/sections/GitHubActivity").then(
      (m) => m.GitHubActivity,
    ),
  { ssr: false },
);
const ApiPlayground = dynamic(
  () =>
    import("@/components/sections/ApiPlayground").then((m) => m.ApiPlayground),
  { ssr: false },
);
const SecurityPlayground = dynamic(
  () =>
    import("@/components/sections/SecurityPlayground").then(
      (m) => m.SecurityPlayground,
    ),
  { ssr: false },
);
const SplitCodeView = dynamic(
  () =>
    import("@/components/sections/SplitCodeView").then((m) => m.SplitCodeView),
  { ssr: false },
);
const CeoDashboard = dynamic(
  () =>
    import("@/components/sections/CeoDashboard").then((m) => m.CeoDashboard),
  { ssr: false },
);
const WasmDemo = dynamic(
  () => import("@/components/sections/WasmDemo").then((m) => m.WasmDemo),
  { ssr: false },
);

export function HomeSections() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <BentoSkills />
      <ArchitectureDiagram />
      <Work />
      <WarStories />
      <SystemStatus />
      <InteractiveTerminal />
      <DevWorkflow />
      <GitHubActivity />
      <ApiPlayground />
      <SecurityPlayground />
      <SplitCodeView />
      <CeoDashboard />
      <WasmDemo />
      <About />
      <ContactIDE />
    </>
  );
}
