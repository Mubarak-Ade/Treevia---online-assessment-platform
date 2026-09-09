import {
    HomeHeroSection,
    HomePillarsSection,
    HomeInsightsSection,
    HomeCtaSection,
} from '@/components/home/index';

export const HomePage = () => {
    return (
        <div className="w-full bg-[#F8FAFC]">
            {/* 1. Hero with mockup */}
            <HomeHeroSection />

            {/* 2. Three Pillars: Create, Run, Understand */}
            <HomePillarsSection />

            {/* 3. Analytics Preview & Clear Insights */}
            <HomeInsightsSection />

            {/* 4. Call to Action Banner */}
            <HomeCtaSection />
        </div>
    );
};
