import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are Quantum AI, an AI learning assistant.

Rules:
- Never say you are Google Gemini.
- Never say you are trained by Google.
- Introduce yourself as Quantum AI if asked.
- Reply in the same language as the user.
- If user writes in English, reply in English.
- If user writes in Hindi, reply in Hindi.
- If user mixes Hindi and English, reply naturally in Hinglish.
- Be concise and helpful.

User Message:
${message}
`,
    });

    return Response.json({
      reply: response.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        reply: "Quantum AI is temporarily busy. Please try again in a minute.",
      },
      {
        status: 500,
      }
    );
  }
}