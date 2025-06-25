import { generateText, ollama } from "modelfusion";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);

  const prompt = searchParams.get("prompt") ?? "";

  try {
    const response = await generateText({
      model: ollama
        .CompletionTextGenerator({
          model: "llama3:8b-instruct-q4_0", // Tu modelo
          maxGenerationTokens: 50, // Límite de tokens de respuesta
          temperature: 0.7, // Control de creatividad
          raw: true, // Permite configuraciones avanzadas
        })
        .withInstructionPrompt(),
      prompt: {
        system:
          "Eres un respondedor de preguntas. Tus respuestas no superan las 15 palabras.",
        instruction: prompt,
      },
    });

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al generar la respuesta: " + error.message },
      { status: 500 }
    );
  }
}
