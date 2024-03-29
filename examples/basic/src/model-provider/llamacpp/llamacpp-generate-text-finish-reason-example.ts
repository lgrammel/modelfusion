import { generateText, llamacpp } from "modelfusion";

async function main() {
  const { text, finishReason } = await generateText({
    model: llamacpp
      .CompletionTextGenerator({
        // run a Llama2 model in llama.cpp
        promptTemplate: llamacpp.prompt.Llama2,
        maxGenerationTokens: 200,
      })
      .withTextPrompt(),

    prompt: "Write a short story about a robot learning to love:",

    fullResponse: true,
  });

  console.log(text);
  console.log();
  console.log("Finish reason:", finishReason);
}

main().catch(console.error);
