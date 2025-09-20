"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SMEProfile } from '@/ai/flows/match-sme-with-grant-programs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, Send } from 'lucide-react';

const SMEProfileSchema = z.object({
  businessType: z.string().min(1, 'Business type is required.'),
  industry: z.string().min(1, 'Industry is required.'),
  location: z.string().min(1, 'Location (e.g., state or city) is required.'),
  revenue: z.coerce.number().min(0, 'Annual revenue must be a positive number.'),
  employeeCount: z.coerce.number().int().min(1, 'Must have at least one employee.'),
  businessAge: z.coerce.number().int().min(0, 'Business age must be a positive number.'),
  fundingStage: z.string().min(1, 'Funding stage is required.'),
  previousFundingAmount: z.coerce.number().min(0, 'Previous funding amount must be a positive number.'),
  purposeOfFunding: z.string().min(1, 'Please specify the purpose of funding.'),
});

interface SMEQuestionnaireProps {
  onSubmit: (data: SMEProfile) => void;
  onBack: () => void;
  error?: string | null;
}

export function SMEQuestionnaire({ onSubmit, onBack, error }: SMEQuestionnaireProps) {
  const form = useForm<z.infer<typeof SMEProfileSchema>>({
    resolver: zodResolver(SMEProfileSchema),
    defaultValues: {
      businessType: 'Technology',
      industry: 'Software',
      location: 'Kuala Lumpur',
      revenue: 500000,
      employeeCount: 10,
      businessAge: 2,
      fundingStage: 'Seed',
      previousFundingAmount: 0,
      purposeOfFunding: 'Product Development',
    },
  });

  function onFormSubmit(values: z.infer<typeof SMEProfileSchema>) {
    onSubmit(values);
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Tell Us About Your Business</CardTitle>
        <CardDescription>
          Complete this profile to help our AI find the best grants for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
            
            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-headline text-xl font-semibold">Business Basics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="businessType" render={({ field }) => (
                        <FormItem><FormLabel>Business Type</FormLabel><FormControl><Input placeholder="e.g., Retail, Technology" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="industry" render={({ field }) => (
                        <FormItem><FormLabel>Industry</FormLabel><FormControl><Input placeholder="e.g., Food & Beverage" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="location" render={({ field }) => (
                        <FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Kuala Lumpur" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="businessAge" render={({ field }) => (
                        <FormItem><FormLabel>Business Age (Years)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-headline text-xl font-semibold">Company Size</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="revenue" render={({ field }) => (
                        <FormItem><FormLabel>Annual Revenue (MYR)</FormLabel><FormControl><Input type="number" placeholder="e.g., 500000" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="employeeCount" render={({ field }) => (
                        <FormItem><FormLabel>Number of Employees</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>

            <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-headline text-xl font-semibold">Funding Needs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="fundingStage" render={({ field }) => (
                        <FormItem><FormLabel>Current Funding Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a stage" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="None">None</SelectItem>
                                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                                <SelectItem value="Seed">Seed</SelectItem>
                                <SelectItem value="Series A">Series A</SelectItem>
                                <SelectItem value="Series B+">Series B+</SelectItem>
                                <SelectItem value="Growth">Growth</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="previousFundingAmount" render={({ field }) => (
                        <FormItem><FormLabel>Previous Funding (MYR)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormDescription>Enter 0 if none.</FormDescription><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="purposeOfFunding" render={({ field }) => (
                        <FormItem className="md:col-span-2"><FormLabel>Purpose of Funding</FormLabel><FormControl><Input placeholder="e.g., Business expansion, R&D, Marketing" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
            </div>
            
            <CardFooter className="flex justify-between p-0 pt-6">
                <Button variant="outline" type="button" onClick={onBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button type="submit">
                  Find My Matches <Send className="ml-2 h-4 w-4" />
                </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
