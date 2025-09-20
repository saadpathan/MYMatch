"use client";

import { useState } from 'react';
import type {
  SMEProfile,
  MatchedGrantProgram,
} from '@/ai/flows/match-sme-with-grant-programs';
import type { AnalyzeGrantProgramDetailsOutput } from '@/ai/flows/analyze-grant-program-details';
import { matchSMEWithGrantPrograms } from '@/ai/flows/match-sme-with-grant-programs';
import { useToast } from '@/hooks/use-toast';

import { Hero } from '@/components/hero';
import { SMEQuestionnaire } from '@/components/sme-questionnaire';
import { MatchResults } from '@/components/match-results';
import { Loader2 } from 'lucide-react';

type Step = 'hero' | 'questionnaire' | 'matching' | 'results';

export default function Home() {
  const [step, setStep] = useState<Step>('hero');
  const [smeProfile, setSmeProfile] = useState<SMEProfile | null>(null);
  const [analyzedProgramDetails, setAnalyzedProgramDetails] = useState<Record<string, AnalyzeGrantProgramDetailsOutput>>({});

  const [matchedGrants, setMatchedGrants] = useState<
    MatchedGrantProgram[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleStart = () => setStep('questionnaire');

  const handleProfileSubmit = async (profile: SMEProfile) => {
    setSmeProfile(profile);
    await handleFindMatches(profile);
  };
  
  const handleFindMatches = async (profile: SMEProfile) => {
    setError(null);
    setStep('matching');
    try {
      const results = await matchSMEWithGrantPrograms({
        smeProfile,
        grantPrograms: [], // grantPrograms are now loaded from the backend
      });

      // The new flow doesn't return the full analysis, so we create a basic record
      const analyzed: Record<string, AnalyzeGrantProgramDetailsOutput> = {};
      results.forEach(r => {
        analyzed[r.programName] = {
            programName: r.programName,
            eligibilityCriteria: r.eligibility,
            fundingAmount: r.fundingAmount,
            deadline: r.applicationDeadline,
            description: 'Please refer to the original document.',
            applicationProcess: 'Please refer to the original document.',
            contactInformation: 'Please refer to the original document.',
        }
      });
      setAnalyzedProgramDetails(analyzed);

      setMatchedGrants(results.sort((a, b) => b.matchScore - a.matchScore));
      setStep('results');
    } catch (e) {
      console.error('Matching failed', e);
      const errorMessage = 'An error occurred while finding matches. Please check the grant documents in the `src/grants` folder and try again.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Matching Failed',
        description: errorMessage,
      });
      setStep('questionnaire'); // Go back to questionnaire
    }
  };

  const handleReset = () => {
    setStep('hero');
    setSmeProfile(null);
    setMatchedGrants(null);
    setError(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'hero':
        return <Hero onGetStarted={handleStart} />;
      case 'questionnaire':
        return (
          <SMEQuestionnaire 
            onSubmit={handleProfileSubmit} 
            onBack={() => setStep('hero')}
            error={error}
          />
        );
      case 'matching':
        return (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
            <h2 className="font-headline text-3xl font-bold mb-2">
              Finding Your Perfect Match...
            </h2>
            <p className="text-muted-foreground">
              Our AI is analyzing your profile against available grant programs.
            </p>
          </div>
        );
      case 'results':
        return (
          <MatchResults
            results={matchedGrants || []}
            onReset={handleReset}
            analyzedDetails={analyzedProgramDetails}
          />
        );
      default:
        return <Hero onGetStarted={handleStart} />;
    }
  };

  return <div className="container mx-auto px-4 py-8 md:py-12">{renderStep()}</div>;
}
