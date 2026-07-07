import { getBestsellers } from "@/lib/products";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { BestsellersCarousel } from "@/components/sections/BestsellersCarousel";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { BrandStory } from "@/components/sections/BrandStory";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";

export default function HomePage() {
  const bestsellers = getBestsellers(8);

  return (
    <>
      <Hero />
      <TrustBar />
      <BestsellersCarousel products={bestsellers} />
      <PromoBanner />
      <CategoryGrid />
      <BrandStory />
      <Testimonials />
      <Newsletter />
    </>
  );
}
