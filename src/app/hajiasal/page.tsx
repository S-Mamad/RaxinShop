import { getBestsellers } from "@asal/lib/products";
import { Hero } from "@asal/components/sections/Hero";
import { TrustBar } from "@asal/components/sections/TrustBar";
import { BestsellersCarousel } from "@asal/components/sections/BestsellersCarousel";
import { PromoBanner } from "@asal/components/sections/PromoBanner";
import { CategoryGrid } from "@asal/components/sections/CategoryGrid";
import { BrandStory } from "@asal/components/sections/BrandStory";
import { Testimonials } from "@asal/components/sections/Testimonials";
import { Newsletter } from "@asal/components/sections/Newsletter";

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
