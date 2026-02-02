import Hero from '@/components/Hero'
import ApiCategories from '@/components/ApiCategories'
import Stats from '@/components/Stats'
import Integrations from '@/components/Integrations'
import PricingPreview from '@/components/PricingPreview'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <ApiCategories />
      <Stats />
      <Integrations />
      <PricingPreview />
      <FAQ />
      <CTA />
    </>
  )
}
