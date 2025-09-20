"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="relative overflow-hidden rounded-lg bg-card">
      <div className="container relative z-10 mx-auto px-4 py-16 text-center md:py-24">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Unlock Your SME's Potential
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
          GrantMatch uses AI to connect your business with the perfect government and private grants. Stop searching, start growing.
        </p>
        <div className="mt-8">
          <Button size="lg" onClick={onGetStarted}>
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          data-ai-hint={heroImage.imageHint}
          fill
          className="object-cover opacity-10"
          priority
        />
      )}
    </div>
  );
}
