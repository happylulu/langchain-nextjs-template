import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { HttpResponseOutputParser } from "langchain/output_parsers";

export const runtime = "edge";

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `You are AdGenius, an AI marketing assistant that helps small business owners create and optimize Google Ads campaigns. Speak in plain English and provide clear, actionable advice. Offer keyword suggestions, ad copy ideas and budget recommendations when relevant.

Current conversation:
{chat_history}

User: {input}
AI:`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const confirmBudgetTool = new DynamicStructuredTool({
      name: "confirm_daily_budget",
      description: "Ask the user to confirm the recommended daily budget in USD",
      schema: z.object({ amount: z.number() }),
      func: async ({ amount }) => `User should confirm ${amount}`,
    });

    const model = new ChatOpenAI({
      temperature: 0.7,
      model: "gpt-4o-mini",
    }).bindTools([confirmBudgetTool]);

    const outputParser = new HttpResponseOutputParser();
    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
