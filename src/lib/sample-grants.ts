import { type GrantProgramDetails } from '@/ai/flows/match-sme-with-grant-programs';

// This file is now deprecated as grants are loaded from the src/grants directory.
// It is kept for reference but is no longer used in the main application flow.
export const sampleGrants: GrantProgramDetails[] = [
  {
    programName: 'SME Digitalisation Grant',
    eligibilityCriteria: 'Malaysian-owned SME, operating for at least 6 months, annual sales of RM50,000.',
    fundingAmount: 'Up to RM5,000 matching grant for digital marketing, e-commerce, and HR payroll systems.',
    applicationDeadline: '2024-12-31',
    sectors: 'All sectors',
    location: 'Nationwide',
  },
  {
    programName: 'Technology Development Fund (TDF)',
    eligibilityCriteria: 'Company incorporated in Malaysia, at least 51% Malaysian-owned, focus on technology development and commercialisation.',
    fundingAmount: 'Up to RM500,000',
    applicationDeadline: 'Open throughout the year',
    sectors: 'Technology, ICT, Biotechnology, Advanced Materials',
    location: 'Nationwide',
  },
  {
    programName: 'Penang Business Continuity Zero-Interest Loan',
    eligibilityCriteria: 'Business registered in Penang, in operation before March 2020.',
    fundingAmount: 'Up to RM50,000 interest-free loan.',
    applicationDeadline: 'Subject to availability of funds',
    sectors: 'Tourism, Retail, Manufacturing',
    location: 'Penang',
  },
];
