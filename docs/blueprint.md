# **App Name**: MonoNote AI

## Core Features:

- Secure User Authentication: Allow users to securely sign up, log in, and manage their accounts using Firebase Authentication.
- Note Management (CRUD): Create, read, update, and delete note documents, including content, timestamps, and metadata, leveraging Cloud Firestore as the primary NoSQL database.
- Real-time Note Synchronization: Ensure notes and their metadata are synchronized in real-time across all user devices using Cloud Firestore's capabilities.
- AI-Powered Summarization: Process long-form text within notes to generate concise bullet-point summaries using a Vertex AI (Gemini) tool.
- Real-time AI Tag Suggestions: Analyze note content in real-time to provide automatic, relevant organizational tag suggestions using a Vertex AI (Gemini) tool.
- Tag-based Note Filtering & Search: Efficiently filter and retrieve notes based on suggested or custom tags, utilizing Firestore indexes for optimized queries.

## Style Guidelines:

- Primary digital accent color: Bright cyan (#52CEEF) for an energetic, modern digital feel against a dark background.
- Background color: Very dark, desaturated bluish-grey (#101314) to maintain a high-contrast 'mono-digital' aesthetic.
- Accent color: A soft, complementary purple (#8479D8) to highlight secondary interactive elements without overwhelming the primary digital blue.
- Body and headline font: 'Source Code Pro' (monospace sans-serif) for all text to achieve the requested monospaced, high-contrast, 'mono-digital' experience.
- Minimalist, outline-based icons with sharp angles and high contrast to complement the 'mono-digital' aesthetic and improve clarity.
- Clean and minimalist layout, prioritizing content readability with ample negative space and a clear hierarchy of elements for a high-performance feel.
- Subtle and fast UI transitions for actions like opening/closing notes, sorting, and filtering, to maintain responsiveness and a fluid user experience.