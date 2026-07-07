import { hajiasalPath } from "@asal/lib/paths";

export const extraNav = [
  { id: "faq", label: "سوالات", href: hajiasalPath("/faq") },
  { id: "contact", label: "تماس", href: hajiasalPath("/contact") },
] as const;
