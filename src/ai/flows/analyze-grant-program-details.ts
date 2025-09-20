'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing grant program details from PDF documents.
 *
 * It includes:
 * - analyzeGrantProgramDetails: An async function that takes a PDF document (as a data URI) and returns structured information about the grant program.
 * - AnalyzeGrantProgramDetailsInput: The input type for the analyzeGrantProgramDetails function.
 * - AnalyzeGrantProgramDetailsOutput: The output type for the analyzeGrantProgramDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeGrantProgramDetailsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF document containing grant program details, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // keep the single quotes, because the whole string is already enclosed in single quotes
    ),
});
export type AnalyzeGrantProgramDetailsInput = z.infer<
  typeof AnalyzeGrantProgramDetailsInputSchema
>;

const AnalyzeGrantProgramDetailsOutputSchema = z.object({
  programName: z.string().describe('The name of the grant program.'),
  eligibilityCriteria: z
    .string()
    .describe('The eligibility criteria for the grant program.'),
  fundingAmount: z.string().describe('The funding amount offered by the grant program.'),
  deadline: z.string().describe('The application deadline for the grant program.'),
  description: z.string().describe('A brief description of the grant program.'),
  applicationProcess: z.string().describe('A description of the grant application process.'),
  contactInformation: z.string().describe('Contact information for the grant program.'),
});
export type AnalyzeGrantProgramDetailsOutput = z.infer<
  typeof AnalyzeGrantProgramDetailsOutputSchema
>;

export async function analyzeGrantProgramDetails(
  input: AnalyzeGrantProgramDetailsInput
): Promise<AnalyzeGrantProgramDetailsOutput> {
  return analyzeGrantProgramDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeGrantProgramDetailsPrompt',
  input: {schema: AnalyzeGrantProgramDetailsInputSchema},
  output: {schema: AnalyzeGrantProgramDetailsOutputSchema},
  prompt: `You are an expert grant program analyst.

You will analyze the provided PDF document to extract key details about the grant program, including eligibility criteria, funding amount, and application deadline.

Analyze the following PDF document:

{{media url=pdfDataUri}}

Provide the output in the following JSON format:
{
  "programName": "",
  "eligibilityCriteria": "",
  "fundingAmount": "",
  "deadline": "",
  "description": "",
  "applicationProcess": "",
  "contactInformation": ""
}
`,
});

const analyzeGrantProgramDetailsFlow = ai.defineFlow(
  {
    name: 'analyzeGrantProgramDetailsFlow',
    inputSchema: AnalyzeGrantProgramDetailsInputSchema,
    outputSchema: AnalyzeGrantProgramDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
