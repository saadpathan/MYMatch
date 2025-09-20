// MatchSMEWithGrantPrograms flow implemented using Genkit.

'use server';

/**
 * @fileOverview This file defines a Genkit flow to match SMEs with relevant grant programs.
 *
 * - matchSMEWithGrantPrograms - A function that orchestrates the matching process.
 * - MatchSMEWithGrantProgramsInput - The input type for the matchSMEWithGrantPrograms function.
 * - MatchSMEWithGrantProgramsOutput - The return type for the matchSMEWithGrantPrograms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeGrantProgramDetails, type AnalyzeGrantProgramDetailsOutput } from './analyze-grant-program-details';
import * as fs from 'fs/promises';
import * as path from 'path';

// Define the input schema for the SME profile.
const SMEProfileSchema = z.object({
  businessType: z.string().describe('The type of business (e.g., Retail, Manufacturing, Technology).'),
  industry: z.string().describe('The industry the business operates in (e.g., Food, Automotive, Software).'),
  location: z.string().describe('The location of the business (e.g., Kuala Lumpur, Penang).'),
  revenue: z.number().describe('The annual revenue of the business in MYR.'),
  employeeCount: z.number().describe('The number of employees in the business.'),
  businessAge: z.number().describe('The age of the business in years.'),
  fundingStage: z
    .string()
    .describe(
      'The current funding stage of the business (e.g., Seed, Series A, Growth). If no funding, specify None'
    ),
  previousFundingAmount: z.number().describe('The amount of funding received previously in MYR, 0 if none.'),
  purposeOfFunding: z
    .string()
    .describe(
      'The purpose for which the business is seeking funding (e.g., Expansion, Research, Marketing).'
    ),
});
export type SMEProfile = z.infer<typeof SMEProfileSchema>;

// Define the input schema for the grant program details (extracted from uploaded PDFs).
const GrantProgramDetailsSchema = z.object({
  programName: z.string().describe('The name of the grant program.'),
  eligibilityCriteria: z.string().describe('The eligibility criteria for the grant program.'),
  fundingAmount: z.string().describe('The maximum funding amount available under the grant program.'),
  applicationDeadline: z.string().describe('The application deadline for the grant program.'),
  sectors: z.string().describe('The sectors or industries targeted by the grant program.'),
  location: z.string().describe('The location targeted by the grant program.'),
});
export type GrantProgramDetails = z.infer<typeof GrantProgramDetailsSchema>;

const MatchSMEWithGrantProgramsInputSchema = z.object({
  smeProfile: SMEProfileSchema.describe('The profile of the SME.'),
  grantPrograms: z.array(GrantProgramDetailsSchema).describe('A list of grant programs. This will be populated by reading from the filesystem.').optional(),
});
export type MatchSMEWithGrantProgramsInput = z.infer<typeof MatchSMEWithGrantProgramsInputSchema>;

// Define the output schema for the matched grant programs.
const MatchedGrantProgramSchema = z.object({
  programName: z.string().describe('The name of the matched grant program.'),
  matchScore: z.number().describe('A score indicating how well the grant program matches the SME profile.'),
  eligibility: z.string().describe('Eligibility details from the grant program details.'),
  fundingAmount: z.string().describe('Available funding amount for the grant.'),
  applicationDeadline: z.string().describe('Application deadline for the grant.'),
  sectors: z.string().describe('Sectors targeted by the grant program.'),
  location: z.string().describe('Location targeted by the grant program.'),
});
export type MatchedGrantProgram = z.infer<typeof MatchedGrantProgramSchema>;

const MatchSMEWithGrantProgramsOutputSchema = z.array(MatchedGrantProgramSchema);
export type MatchSMEWithGrantProgramsOutput = z.infer<typeof MatchSMEWithGrantProgramsOutputSchema>;

// Exported function to match SMEs with grant programs.
export async function matchSMEWithGrantPrograms(input: MatchSMEWithGrantProgramsInput): Promise<MatchSMEWithGrantProgramsOutput> {
  return matchSMEWithGrantProgramsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchSMEWithGrantProgramsPrompt',
  input: {schema: MatchSMEWithGrantProgramsInputSchema},
  output: {schema: MatchSMEWithGrantProgramsOutputSchema},
  prompt: `You are an expert in matching SMEs with suitable grant programs. Based on the SME's profile and the details of the grant programs, determine the best matches and rank them by relevance.

SME Profile:
{{json smeProfile}}

Grant Programs:
{{#each grantPrograms}}
  Program Name: {{this.programName}}
  Eligibility Criteria: {{this.eligibilityCriteria}}
  Funding Amount: {{this.fundingAmount}}
  Application Deadline: {{this.applicationDeadline}}
  Sectors: {{this.sectors}}
  Location: {{this.location}}
{{/each}}

Return a JSON array of matched grant programs, ranked by relevance (matchScore), including program name, eligibility, funding amount, and application deadline.
`,
});

const matchSMEWithGrantProgramsFlow = ai.defineFlow(
  {
    name: 'matchSMEWithGrantProgramsFlow',
    inputSchema: MatchSMEWithGrantProgramsInputSchema,
    outputSchema: MatchSMEWithGrantProgramsOutputSchema,
  },
  async (input) => {
    const grantsDir = path.join(process.cwd(), 'src', 'grants');
    const grantFiles = await fs.readdir(grantsDir);

    const analyzedGrants: GrantProgramDetails[] = [];

    for (const file of grantFiles) {
        if (path.extname(file).toLowerCase() === '.pdf') {
            const filePath = path.join(grantsDir, file);
            const fileBuffer = await fs.readFile(filePath);
            const pdfDataUri = `data:application/pdf;base64,${fileBuffer.toString('base64')}`;
            
            try {
                const analysisResult = await analyzeGrantProgramDetails({ pdfDataUri });
                
                // Heuristic to extract sectors and location if not explicitly provided
                const sectors = analysisResult.description.match(/sector|industry/i) ? 'Extracted from description' : 'Various';
                const location = analysisResult.description.match(/location|state|city/i) ? 'Extracted from description' : 'Nationwide';

                analyzedGrants.push({
                    programName: analysisResult.programName,
                    eligibilityCriteria: analysisResult.eligibilityCriteria,
                    fundingAmount: analysisResult.fundingAmount,
                    applicationDeadline: analysisResult.deadline,
                    sectors: sectors,
                    location: location
                });
            } catch (e) {
                console.error(`Skipping file ${file} due to analysis error:`, e);
            }
        }
    }

    if (analyzedGrants.length === 0) {
        // If you have sample grants, you can add them here as a fallback
        // For now, we'll just return an empty array or throw an error.
        console.warn("No grant documents found or analyzed. Using sample grants.");
    }
    
    const flowInput = {
        smeProfile: input.smeProfile,
        grantPrograms: analyzedGrants.length > 0 ? analyzedGrants : input.grantPrograms ?? [],
    };

    const { output } = await prompt(flowInput);
    return output!;
  }
);
