"use client";

import {
  Monitor,
  Stack,
  HardDrives,
  PuzzlePiece,
} from "@phosphor-icons/react";

const iconMap = {
  Monitor,
  Server: HardDrives,
  Layers: Stack,
  Component: PuzzlePiece,
} as const;

export function ServiceIcon({ name }: { name: string }) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? Stack;
  return <Icon className="h-5 w-5 text-accent/70" weight="duotone" />;
}
