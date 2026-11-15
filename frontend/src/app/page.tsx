import { InteractiveHero } from "@/components/sections/interactive-hero";
import { HomePathways } from "@/components/sections/home-pathways";
import {
  HomeFinalCta,
  HomeEcosystem,
  HomeIndustrySolutions,
  HomeLearningPrograms,
  HomePillars,
  HomeServices,
  HomeValueAndWhy,
} from "@/components/sections/homepage-sections";

export default function Home() {
  return (
    <>
      <InteractiveHero />
      <HomePillars />
      <HomePathways />
      <HomeIndustrySolutions />
      <HomeServices />
      <HomeEcosystem />
      <HomeLearningPrograms />
      <HomeValueAndWhy />
      <HomeFinalCta />
    </>
  );
}
