'use server';
/**
 * @fileOverview An AI agent for suggesting organizational tags for notes.
 *
 * - suggestNoteTags - A function that handles the tag suggestion process.
 * - SuggestNoteTagsInput - The input type for the suggestNoteTags function.
 * - SuggestNoteTagsOutput - The return type for the suggestNoteTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNoteTagsInputSchema = z.object({
  noteContent: z.string().describe('The content of the note for which to suggest tags.'),
});
export type SuggestNoteTagsInput = z.infer<typeof SuggestNoteTagsInputSchema>;

const SuggestNoteTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('A list of suggested organizational tags for the note.'),
});
export type SuggestNoteTagsOutput = z.infer<typeof SuggestNoteTagsOutputSchema>;

export async function suggestNoteTags(input: SuggestNoteTagsInput): Promise<SuggestNoteTagsOutput> {
  return suggestNoteTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNoteTagsPrompt',
  input: {schema: SuggestNoteTagsInputSchema},
  output: {schema: SuggestNoteTagsOutputSchema},
  prompt: `You are an AI assistant specialized in generating concise and relevant organizational tags for notes.

Based on the following note content, generate a list of up to 5 relevant tags. Each tag should be a single word or a short, descriptive phrase.

Note Content:
{{{noteContent}}}`,
});

const suggestNoteTagsFlow = ai.defineFlow(
  {
    name: 'suggestNoteTagsFlow',
    inputSchema: SuggestNoteTagsInputSchema,
    outputSchema: SuggestNoteTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
