"use client";

import Image from "next/image";
import type { TeamMember } from "@/types";

export function TeamImage({ member }: { member: TeamMember }) {
  return (
    <Image
      src={member.image}
      alt={member.name}
      fill
      className="object-cover"
      style={{ objectPosition: member.imagePosition ?? "center center" }}
      sizes="(max-width: 768px) 100vw, 42vw"
    />
  );
}
