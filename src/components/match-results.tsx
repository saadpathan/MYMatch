"use client";

import type { MatchedGrantProgram } from '@/ai/flows/match-sme-with-grant-programs';
import type { AnalyzeGrantProgramDetailsOutput } from '@/ai/flows/analyze-grant-program-details';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Award, Target, Info, Calendar, DollarSign, MapPin, Building, Link as LinkIcon, Phone } from 'lucide-react';
import { Feedback } from './feedback';

interface MatchResultsProps {
  results: MatchedGrantProgram[];
  onReset: () => void;
  analyzedDetails: Record<string, AnalyzeGrantProgramDetailsOutput>;
}

export function MatchResults({ results, onReset, analyzedDetails }: MatchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Award className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 font-headline text-2xl font-semibold">No Matches Found</h2>
        <p className="mt-2 text-muted-foreground">
          We couldn't find any suitable grant programs based on your profile.
        </p>
        <Button onClick={onReset} className="mt-6">
          Start Over
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Your Grant Matches</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Here are the top grant programs our AI has matched for your business.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map((grant) => (
          <Card key={grant.programName} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-start justify-between">
                <span className="font-headline">{grant.programName}</span>
                <Badge variant="secondary" className="ml-2 shrink-0">{grant.matchScore}% Match</Badge>
              </CardTitle>
              <Progress value={grant.matchScore} className="w-full h-2" />
            </CardHeader>
            <CardContent className="flex-grow space-y-3 text-sm">
                <div className="flex items-start">
                    <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" /> 
                    <span>{grant.fundingAmount}</span>
                </div>
                <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <span>Deadline: {grant.applicationDeadline}</span>
                </div>
                 <div className="flex items-start">
                    <Building className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <span>Sectors: {grant.sectors}</span>
                </div>
                <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground shrink-0" />
                    <span>Location: {grant.location}</span>
                </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">View Details</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{grant.programName}</DialogTitle>
                    <DialogDescription>
                        Detailed information about the grant program and how to apply.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 text-sm">
                    <h3 className="font-semibold text-base flex items-center"><Target className="h-4 w-4 mr-2 text-primary"/>Eligibility Criteria</h3>
                    <p className="text-muted-foreground">{grant.eligibility}</p>
                    
                    {analyzedDetails[grant.programName] && (
                        <>
                            <h3 className="font-semibold text-base flex items-center mt-2"><Info className="h-4 w-4 mr-2 text-primary"/>Program Description</h3>
                            <p className="text-muted-foreground">{analyzedDetails[grant.programName].description}</p>
                            
                            <h3 className="font-semibold text-base flex items-center mt-2"><LinkIcon className="h-4 w-4 mr-2 text-primary"/>Application Process</h3>
                            <p className="text-muted-foreground">{analyzedDetails[grant.programName].applicationProcess}</p>
                            
                             <h3 className="font-semibold text-base flex items-center mt-2"><Phone className="h-4 w-4 mr-2 text-primary"/>Contact Information</h3>
                            <p className="text-muted-foreground">{analyzedDetails[grant.programName].contactInformation}</p>
                        </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button onClick={onReset} variant="ghost">Start a New Search</Button>
      </div>

      <Feedback />
    </div>
  );
}
