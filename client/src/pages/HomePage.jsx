import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import HeroSection from '../components/home/HeroSection';
import FeaturedTreats from '../components/home/FeaturedTreats';
import CategoriesPreview from '../components/home/CategoriesPreview';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CTABanner from '../components/home/CTABanner';

export default function HomePage() {
  return (
    <PageTransition>
      <main>
        <HeroSection />
        <FeaturedTreats />
        <CategoriesPreview />
        <HowItWorks />
        <Testimonials />
        <CTABanner />
      </main>
    </PageTransition>
  );
}
