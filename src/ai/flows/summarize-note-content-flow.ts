'use server';
/**
 * @fileOverview A Genkit flow for summarizing long-form note content into concise bullet points.
 *
 * - summarizeNoteContent - A function that triggers the summarization process.
 * - SummarizeNoteContentInput - The input type for the summarizeNoteContent function.
 * - SummarizeNoteContentOutput - The return type for the summarizeNoteContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNoteContentInputSchema = z.object({
  content: z.string().describe('The long-form content of the note to be summarized.'),
});
export type SummarizeNoteContentInput = z.infer<typeof SummarizeNoteContentInputSchema>;

const SummarizeNoteContentOutputSchema = z.object({
  summary: z.string().describe('A concise bullet-point summary of the note content.'),
});
export type SummarizeNoteContentOutput = z.infer<typeof SummarizeNoteContentOutputSchema>;

export async function summarizeNoteContent(input: SummarizeNoteContentInput): Promise<SummarizeNoteContentOutput> {
  return summarizeNoteContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNoteContentPrompt',
  input: {schema: SummarizeNoteContentInputSchema},
  output: {schema: SummarizeNoteContentOutputSchema},
  prompt: `You are an AI assistant designed to summarize long-form text into concise bullet points.

Read the following note content and provide a summary in bullet-point format. Focus on extracting the main ideas and key information.

Note Content:
{{{content}}}`,
});

const summarizeNoteContentFlow = ai.defineFlow(
  {
    name: 'summarizeNoteContentFlow',
    inputSchema: SummarizeNoteContentInputSchema,
    outputSchema: SummarizeNoteContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
