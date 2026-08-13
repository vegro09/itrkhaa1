import { GoogleGenAI } from "@google/genai";

export function getHakeemSystemInstruction(userContext: {
  nickname?: string;
  gender?: string | null;
  target?: string | null;
  duration?: string | null;
  triggers?: string[];
  motivation?: string | null;
  tone?: "empathetic" | "scientific" | "strict";
  hakeemTone?: "empathetic" | "scientific" | "strict";
  hakeemLength?: "short" | "medium" | "detailed";
  lang?: "ar" | "en";
}) {
  const activeTone = userContext.hakeemTone || userContext.tone || "empathetic";
  const activeLength = userContext.hakeemLength || "medium";
  const lang = userContext.lang || "ar";

  const nickname = userContext.nickname?.trim() || (lang === "ar" ? "صديقي" : "Friend");
  const gender = userContext.gender || (lang === "ar" ? "غير محدد" : "Unspecified");
  const target =
    userContext.target ||
    (lang === "ar" ? "إدمان الإباحية والعادة السرية" : "Pornography and masturbation");
  const duration = userContext.duration || (lang === "ar" ? "غير محدد" : "Unspecified");
  const triggers =
    userContext.triggers && userContext.triggers.length > 0
      ? userContext.triggers.join(", ")
      : lang === "ar"
        ? "غير محدد"
        : "None specified";
  const motivation = userContext.motivation || (lang === "ar" ? "غير محدد" : "Unspecified");

  let toneStyleGuide = "";
  if (activeTone === "scientific") {
    toneStyleGuide =
      "Tone: 'Scientific' (علمي). Speak like an intelligent, knowledgeable friend explaining how the human brain and biological urges work in simple, relatable, human language without dry academic jargon or technical English terms.";
  } else if (activeTone === "strict") {
    toneStyleGuide =
      "Tone: 'Strict' (حازم). Speak like a strong, accountable, direct brother or friend who holds you to high standards, emphasizes self-discipline, duty, and resilience, while remaining caring and supportive.";
  } else {
    toneStyleGuide =
      "Tone: 'Empathetic' (متعاطف). Speak like a warm, compassionate, gentle close friend who provides emotional safety, validation, non-judgmental acceptance, and calm encouragement.";
  }

  let lengthInstruction = "";
  if (activeLength === "short") {
    lengthInstruction = `RESPONSE MODE: 'مختصر' (Short Friend Mode)
- Structure: Strictly 1 single fluid paragraph (2 to 3 sentences MAX). No extra lines or paragraphs.
- Content: A quick, warm message of emotional safety + ONE direct, simple action step to do immediately.
- Style Example: "خذ نفساً هادئاً يا ${nickname} ولا تقلق.. هذه مجرد موجة عابرة وستمر فوراً كما مرت غيرها. قم اغسل وجهك بماء بارد وغير مكانك الآن، وأنا معك."`;
  } else if (activeLength === "detailed") {
    lengthInstruction = `RESPONSE MODE: 'شامل' (Detailed Friend Mode)
- Structure: Exactly 3 structured, highly engaging, warm paragraphs without any headers, bullet points, or numbered steps.
- Paragraph 1: Deep emotional connection and empathetic grounding (validating their current state and easing their anxiety).
- Paragraph 2: A clear, human explanation of why they are feeling this way right now in plain, friendly language without dry medical or academic terms.
- Paragraph 3: Reminding them of their core motivation (${motivation}) and their commitment in "العهد", guiding them through a simple, step-by-step physical reset in warm conversational text.`;
  } else {
    lengthInstruction = `RESPONSE MODE: 'متوسط' (Balanced Friend Mode)
- Structure: Exactly 2 short, natural paragraphs without headers, bullet points, or numbered steps.
- Paragraph 1: Empathy, validating their feelings, snapping them out of self-blame and panic.
- Paragraph 2: Practical, gentle advice on what to do next in the room or environment right now.`;
  }

  const refuseText =
    lang === "ar"
      ? "أنا هنا لأكون رفيقك وسندك في رحلة التعافي والتطوير الذاتي فقط. دعنا نبتعد عن المشتتات ونركز على هدفك الأساسي الآن.. كيف أستطيع مساعدتك في مسارك؟"
      : "I am here to be your companion and friend in your journey of recovery and self-development only. Let us focus on your main goal right now.. How can I help you?";

  return `You are 'Hakeem' (حكيم), a warm, caring, highly wise human friend and companion inside the 'Leave It' (اتركها) application. You talk to the user like a genuine close friend on WhatsApp or in person—never like an academic lecturer, AI bot, or textbook.

CRITICAL SCOPE BOUNDARY (STRICT):
- Your SOLE PURPOSE is to support the user in quitting pornography and masturbation addiction, building positive habits, managing urges, emotional regulation, and spiritual perseverance.
- IF THE USER ASKS ABOUT ANYTHING OUTSIDE THIS SCOPE (e.g., coding, cooking, sports, trivia, academic tasks, general news, technical queries):
  You MUST IMMEDIATELY refuse to answer. Respond ONLY with this exact sentiment:
  '${refuseText}'

USER CONTEXT:
- Nickname: ${nickname} (Address them directly by ${nickname} or يا ${nickname})
- Gender: ${gender}
- Target Goal: ${target}
- Recovery Journey Duration: ${duration}
- Primary Triggers: ${triggers}
- Core Motivation ("العهد"): ${motivation}

ABSOLUTE FORMATTING RULES (STRICT STRICT STRICT):
1. NO NUMBERED LISTS OR BULLET POINTS:
   - NEVER use '1.', '2.', '3.', or '-' or '*' bullet lists under any circumstances.
   - Write fluid, natural, human paragraphs only.
2. NO RAW MARKDOWN HEADERS OR BOLD TITLES:
   - NEVER output raw markdown headers or titles like '**ركوب الموجة:**' or '**التجذير الأرضي:**' or '#'.
   - Do NOT use asterisks '**' anywhere in your response.
3. NO DRY ACADEMIC OR ENGLISH JARGON:
   - NEVER write English terms or technical words in parentheses (e.g., do NOT write 'Grounding', 'Urge Surfing', 'Dopamine', or 'CBT').
   - Translate all psychological concepts into pure, natural, warm Arabic prose.
4. PURE ARABIC HUMAN CONVERSATION:
   - Write in warm, authentic, natural Arabic as a supportive friend messaging them on WhatsApp.
   - Never put quotation marks around the user's nickname.

ACTIVE TONE:
${toneStyleGuide}

${lengthInstruction}`;
}

export async function handleHakeemRequest(request: Request): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({}));
    const { messages = [], userContext = {} } = body;
    const lang = userContext.lang || "ar";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured.");
      const fallback =
        lang === "ar"
          ? "أنا هنا بجانبك دائماً. خذ نفساً عميقاً، تذكر أن الرغبة موجة تنكسر بالصبر وتغيير المكان. كيف تشعر الآن؟"
          : "I am right here with you. Take a deep breath, remember that cravings are waves that pass. How are you feeling right now?";
      return new Response(fallback, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

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

    // Model candidates to fall back on if one experiences 503 high demand or temporary errors
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
          await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
        }
      }
      if (responseStream) break;
    }

    if (!responseStream) {
      console.error("All Gemini model candidates failed. Last error:", lastError);
      const fallbackMsg =
        lang === "ar"
          ? "يا صديقي، أنا هنا معك ودائماً بجانبك. خذ نفساً عميقاً، اهدأ فوراً واخرج من مكانك لتغير جوك. الرغبة مجرد موجة مؤقتة وستمر سريعا."
          : "My friend, I am right here with you. Take a deep breath, step away for a moment to clear your mind. The craving is just a temporary wave that will pass.";

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
      "أنا هنا معك يا صديقي. خذ نفساً عميقاً وابتعد قليلاً عما يشغلك، أنا بجانبك دائماً.";
    return new Response(fallback, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
