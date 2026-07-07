import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/shell/ScrollProgress";
import { Hero } from "@/components/sections/Hero";
import { Expertise } from "@/components/sections/Expertise";
import { Lab } from "@/components/sections/Lab";
import { Work } from "@/components/sections/Work";
import { Stack } from "@/components/sections/Stack";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Expertise />
        <Lab />
        <Work />
        <Stack />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
