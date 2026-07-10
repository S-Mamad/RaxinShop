"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import site from "@/data/site.json";
import type { SiteConfig } from "@/types";

const data = site as SiteConfig;

export function ClientLogos() {
  const reduceMotion = useReducedMotion();

  if (!data.clients?.length) return null;

  return (
    <section
      aria-label="مشتریان"
      className="relative z-[var(--z-content)] border-b border-border py-10 md:py-12"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.ul
          className="flex flex-wrap items-center justify-center gap-8 md:gap-14"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {data.clients.map((client) => {
            const logo = client.logo ? (
              <Image
                src={client.logo}
                alt=""
                width={120}
                height={40}
                className="h-8 w-auto opacity-50 transition-opacity duration-300 hover:opacity-90 md:h-9"
              />
            ) : (
              <span className="font-display text-sm text-muted">{client.name}</span>
            );

            const item = (
              <motion.li
                key={client.name}
                variants={
                  reduceMotion
                    ? undefined
                    : {
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0 },
                      }
                }
              >
                {client.href ? (
                  <Link
                    href={client.href}
                    className="block"
                    aria-label={client.name}
                    {...(client.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {logo}
                  </Link>
                ) : (
                  logo
                )}
              </motion.li>
            );

            return item;
          })}
        </motion.ul>
      </div>
    </section>
  );
}
