import { Ollama } from "@langchain/community/llms/ollama";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = new URL(request.url);

	const prompt = searchParams.get("prompt") ?? "";

	const chain = RunnableSequence.from([
		PromptTemplate.fromTemplate("Responde en menos de 15 palabras la siguiente consulta: {query}"),
		new Ollama({
			model: "llama3:8b-instruct-q4_0",
            baseUrl: "http://localhost:11434",  // Conexión a tu servidor Ollama local
            temperature: 0.7,                   // Control de creatividad
            numCtx: 2048                        // Tamaño de contexto
		}),
	]);

	try {
        const response = await chain.invoke({ query: prompt });
        return NextResponse.json({ response });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al conectar con Ollama: " + error.message },
            { status: 500 }
        );
    }
}
