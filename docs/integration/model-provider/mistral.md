---
sidebar_position: 10
---

# Mistral

Generate text and embeddings using the [Mistral platform](https://mistral.ai).

## Setup

1. Sign up for the [Mistral platform](https://console.mistral.ai/), activate your subscription and and generate an API key.
1. The API key can be configured as an environment variable (`MISTRAL_API_KEY`) or passed in as an option into the model constructor.

## Model Functions

[Examples](https://github.com/lgrammel/modelfusion/tree/main/examples/basic/src/model-provider/mistral)

### Generate Text

[MistralChatModel API](/api/classes/MistralChatModel)

```ts
import { generateText, mistral } from "modelfusion";

const text = await generateText({
  model: mistral.ChatTextGenerator({
    model: "mistral-medium",
    maxGenerationTokens: 120,
  }),
  prompt: [
    {
      role: "user",
      content: "Write a short story about a robot learning to love:",
    },
  ],
});
```

### Stream Text

[MistralChatModel API](/api/classes/MistralChatModel)

```ts
import { mistral, streamText } from "modelfusion";

const textStream = await streamText({
  model: mistral.ChatTextGenerator({
    model: "mistral-medium",
    maxGenerationTokens: 120,
  }),
  prompt: [
    {
      role: "user",
      content: "Write a short story about a robot learning to love:",
    },
  ],
});

for await (const textPart of textStream) {
  process.stdout.write(textPart);
}
```

### Embed Text

[MistralTextEmbeddingModel API](/api/classes/MistralTextEmbeddingModel)

```ts
import { embedMany, mistral } from "modelfusion";

const embeddings = await embedMany({
  model: mistral.TextEmbedder({ model: "mistral-embed" }),
  values: [
    "At first, Nox didn't know what to do with the pup.",
    "He keenly observed and absorbed everything around him, from the birds in the sky to the trees in the forest.",
  ],
});
```

## Configuration

### API Configuration

[Mistral API Configuration](/api/classes/MistralApiConfiguration)

```ts
import { mistral } from "modelfusion";

const api = mistral.Api({
  apiKey: "my-api-key", // optional; default: process.env.MISTRAL_API_KEY
  // ...
});

const model = mistral.ChatTextGenerator({
  api,
  // ...
});
```
