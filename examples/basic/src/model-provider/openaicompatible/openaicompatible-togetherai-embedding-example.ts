import dotenv from "dotenv";
import { embed, openaicompatible } from "modelfusion";

dotenv.config();

async function main() {
  const embedding = await embed({
    model: openaicompatible.TextEmbedder({
      api: openaicompatible.TogetherAIApi(),
      model: "togethercomputer/m2-bert-80M-8k-retrieval",
    }),
    value: "At first, Nox didn't know what to do with the pup.",
  });

  console.log(embedding);
}

main().catch(console.error);
