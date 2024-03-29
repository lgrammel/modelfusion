import { ollama, streamText } from "modelfusion";

async function main() {
  const textStream = await streamText({
    model: ollama.CompletionTextGenerator({
      model: "mistral:text", // mistral base model without instruct fine-tuning
      maxGenerationTokens: 500,
    }),
    prompt: {
      prompt: "Write a short story about a robot learning to love:\n\n",
    },
  });

  for await (const textPart of textStream) {
    process.stdout.write(textPart);
  }
}

main().catch(console.error);
