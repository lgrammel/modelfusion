import dotenv from "dotenv";
import { Tool, openai, runTool, zodSchema } from "modelfusion";
import { z } from "zod";

dotenv.config();

export const calculatorThatThrowsError = new Tool({
  name: "calculator",
  description: "Execute a calculation",

  parameters: zodSchema(
    z.object({
      a: z.number().describe("The first number."),
      b: z.number().describe("The second number."),
      operator: z
        .enum(["+", "-", "*", "/"])
        .describe("The operator (+, -, *, /)."),
    })
  ),

  execute: async () => {
    throw new Error("This tool always throws an error.");
  },
});

async function main() {
  const { tool, toolCall, args, ok, result } = await runTool({
    model: openai.ChatTextGenerator({ model: "gpt-3.5-turbo" }),
    tool: calculatorThatThrowsError,
    prompt: [openai.ChatMessage.user("What's fourteen times twelve?")],
  });

  console.log(`Tool call:`, toolCall);
  console.log(`Tool:`, tool);
  console.log(`Arguments:`, args);
  console.log(`Ok:`, ok);
  console.log(`Result or Error:`, result);
}

main().catch(console.error);
