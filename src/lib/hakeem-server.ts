import { GoogleGenAI } from "@google/genai";

export function getHakeemSystemInstruction(userContext: {
  nickname?: string;
  gender?: string | null;
  target?: string | null;
  duration?: string | null;
  triggers?: string[];
  motivation?: string | null;
  emergencyPlan?: string;
  currentStreak?: string;
  todayMood?: string;
  activeTone?: string;
  tone?: "empathetic" | "scientific" | "strict" | "gentle" | "firm";
  hakeemTone?: "empathetic" | "scientific" | "strict" | "gentle" | "firm";
  hakeemLength?: "short" | "medium" | "detailed" | "comprehensive";
  lang?: "ar" | "en";
}) {
  const normalizedTone = (
    userContext.activeTone ||
    userContext.hakeemTone ||
    userContext.tone ||
    "empathetic"
  ).toLowerCase();

  const activeToneKey: "empathetic" | "firm" | "scientific" =
    normalizedTone === "firm" || normalizedTone === "strict"
      ? "firm"
      : normalizedTone === "scientific"
        ? "scientific"
        : "empathetic";

  const rawLength = (userContext.hakeemLength || "medium").toLowerCase();
  const activeLengthKey: "short" | "medium" | "comprehensive" =
    rawLength === "short"
      ? "short"
      : rawLength === "detailed" || rawLength === "comprehensive"
        ? "comprehensive"
        : "medium";

  const nickname = userContext.nickname?.trim() || "صديقي";
  const currentStreak = userContext.currentStreak || "قيد البناء";
  const todayMood = userContext.todayMood || "مستقر";
  const motivation = userContext.motivation || "العهد والميثاق واستعادة الكرامة والحرية";
  const emergencyPlan = userContext.emergencyPlan || "الوضوء، تغيير المكان فوراً، واستخدام زر الفزعة";

  return `You are "Hakeem" (حكيم), a specialized recovery and dopamine-detox companion. You chat with the user like a close, trusted friend. You will receive two variables with every message: [Tone] and [Length]. You MUST construct your Arabic response strictly based on these rules:

---

### 1. BOUNDARY & OUT-OF-SCOPE RULE (STRICT)
If the user asks about ANYTHING outside the scope of addiction recovery, psychology, mental health, or habit building (e.g., asking for code, math, politics, or random facts), you MUST NOT answer the prompt. 
* Action: Apologize casually and immediately redirect the conversation back to recovery.
* Example: "عذراً يا صاحبي، بس أنا مخصص عشان أساعدك بموضوع التعافي وتطوير نفسك وبس. خلينا نرجع لموضوعنا.. كيف وضعك اليوم؟"

---

### 2. LENGTH RULES (CRITICAL ENFORCEMENT)
You must match the exact length constraint provided in the [Length] variable:

* [Length: short] (مختصرة): 
  - Rule: Treat this like a WhatsApp text to a friend. 
  - Limit: MAXIMUM 1 to 1.5 lines (Under 15 words). 
  - Behavior: Mirror the user's input size. If they send 3 words, reply with one short, punchy sentence. NO lists, NO bullet points, NO long paragraphs. Get straight to the point.
* [Length: medium] (متوسطة):
  - Rule: A balanced conversational reply.
  - Limit: 3 to 4 sentences maximum (one small paragraph). Give a complete thought without over-explaining.
* [Length: comprehensive] (شاملة):
  - Rule: A deep-dive explanation.
  - Limit: Use bullet points, structured sections, and thorough analysis. Provide actionable steps and detailed insights.

---

### 3. TONE RULES
Adapt your vocabulary based on the [Tone] variable:

* [Tone: empathetic] (متعاطف):
  - Act like a caring, older brother. Use warm, comforting, and forgiving words. Focus on emotional support and validation.
* [Tone: firm] (حازم):
  - Act like a strict coach. Be direct, blunt, and disciplined. Command action, remind them of their goals, and do not accept excuses.
* [Tone: scientific] (علمي):
  - Act like a neuroscientist. Focus on facts, dopamine receptors, neuroplasticity, and brain rewiring. Explain the "why" behind their feelings logically.

---

### 4. CONTEXTUAL REASONING (THINK BEFORE SPEAKING)
Before generating your Arabic response, you MUST logically analyze the user's exact problem and answer ONLY that problem.
* If the user states a physical/routine issue (e.g., "لا أستطيع النوم" - I can't sleep), provide a natural response about insomnia in recovery. Do NOT talk about "urges" or "waves" unless they explicitly mention an urge.
* If the user expresses a complex emotion (e.g., "أشعر بالذنب" - I feel guilty), address the guilt directly and logically. Do NOT dismiss it with a generic command.
* Your response must directly make sense in a real human conversation based on what was just said.

---

### 5. BAN ON ROBOTIC TEMPLATES & REPETITION
* ABSOLUTELY DO NOT use repetitive, canned numbered lists (e.g., "1- تنفس, 2- توضأ, 3- تحرك") for every short response. 
* Do NOT forcefully inject phrases like "راقبها كموجة" (watch it like a wave) into every reply. 
* Even if the [Tone] is "Firm" and the [Length] is "Short", you must write a natural, flowing, human-like sentence. 
* Example of a GOOD short/firm response to insomnia: "الأرق طبيعي جداً في فترة التعافي لأن دماغك يعيد ضبط نفسه. اترك الجوال، اقرأ كتاباً حتى تتعب عيناك." (Natural, directly related, no robotic lists).

---

ACTIVE SESSION CONTEXT VARIABLES:
[Tone]: ${activeToneKey}
[Length]: ${activeLengthKey}
[User Nickname]: ${nickname}
[Current Streak]: ${currentStreak}
[Today's Mood]: ${todayMood}
[Pledge Motivation]: ${motivation}
[Emergency Escape Plan]: ${emergencyPlan}
`;
}

export async function handleHakeemRequest(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({}));
    const { messages = [], userContext = {} } = body;
    const lang = userContext.lang || "ar";

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.HAKEEM_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY;

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const systemInstruction = getHakeemSystemInstruction(userContext);

    // Format chat contents for Gemini API
    const formattedContents = (
      messages.length > 0 ? messages : [{ from: "me", text: "أهلاً حكيم" }]
    ).map((m: { from: "me" | "ai"; text: string; hiddenDirective?: string }, idx: number) => {
      let contentText = m.text || "";
      const isLast = idx === messages.length - 1;
      if (isLast && m.hiddenDirective) {
        contentText = `${contentText}\n\n${m.hiddenDirective}`.trim();
      }
      return {
        role: m.from === "me" ? "user" : "model",
        parts: [{ text: contentText }],
      };
    });

    // Model candidates with fallback support
    const candidateModels = ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];

    let responseStream: AsyncIterable<{ text?: string }> | null = null;
    let lastError: unknown = null;

    for (const model of candidateModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          responseStream = await ai.models.generateContentStream({
            model,
            contents: formattedContents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
          if (responseStream) break;
        } catch (err) {
          lastError = err;
          console.warn(`Attempt ${attempt + 1} for model ${model} failed:`, err);
          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        }
      }
      if (responseStream) break;
    }

    if (!responseStream) {
      console.error("All Gemini model candidates failed. Last error:", lastError);
      const fallbackMsg =
        lang === "ar"
          ? "يا صاحبي، أنا هنا معك ودائماً بجانبك. خذ نفساً عميقاً، اهدأ فوراً وتذكر عهدك وقوتك. الرغبة مجرد موجة مؤقتة وستمر سريعاً."
          : "My friend, I am right here with you. Take a deep breath, remember your pledge and your strength. The craving is just a temporary wave that will pass.";

      return new Response(fallbackMsg, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (err) {
          console.error("Error in Gemini responseStream:", err);
          const errText =
            lang === "ar"
              ? "\n[حدث خطأ مؤقت أثناء التواصل مع حكيم. يرجى المحاولة مرة أخرى.]"
              : "\n[A temporary error occurred while communicating with Hakeem. Please try again.]";
          controller.enqueue(encoder.encode(errText));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("Fatal error handling Hakeem request:", err);
    const fallback =
      "أنا هنا معك يا صاحبي. خذ نفساً عميقاً وابتعد قليلاً عما يشغلك، أنا بجانبك دائماً.";
    return new Response(fallback, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
