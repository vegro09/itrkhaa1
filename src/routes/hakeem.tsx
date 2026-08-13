import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Home, Send, Sparkles } from "lucide-react";
import Markdown from "react-markdown";
import { useApp } from "@/lib/app-state";
import { useT } from "@/lib/i18n";

function cleanArabicOutput(raw: string): string {
  if (!raw) return "";
  let text = raw;
  // Remove quotation marks or apostrophes around Arabic nicknames or words (e.g., "صديقي" -> صديقي)
  text = text.replace(/["'«»]([\u0600-\u06FF\s]+)["'«»]/g, "$1");
  // Remove English technical terms in parentheses if any linger (e.g., (Urge Surfing) -> '')
  text = text.replace(/\s*\([A-Za-z\s-]+\)/g, "");
  // Strip raw markdown asterisks (e.g., **word** -> word)
  text = text.replace(/\*\*(.*?)\*\*/g, "$1");
  // Strip bullet or numbered list prefixes at start of lines (e.g., "1. ", "- ", "* ")
  text = text.replace(/^[\s]*[\d\-*]+[.)\s]+/gm, "");
  return text;
}

export const Route = createFileRoute("/hakeem")({
  head: () => ({
    meta: [
      { title: "Hakeem — your calm companion | Leave It" },
      {
        name: "description",
        content: "Chat with Hakeem for grounding support the moment a craving hits.",
      },
      { property: "og:title", content: "Hakeem — your calm companion" },
      { property: "og:description", content: "Support in the moment a craving hits." },
    ],
  }),
  component: Hakeem,
});

type Msg = { id: string; from: "me" | "ai"; text: string };

export function Hakeem() {
  const { state, set } = useApp();
  const tr = useT(state.lang);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const activeTone = state.hakeemTone || state.tone || "empathetic";

  const cycleTone = () => {
    const tones: ("empathetic" | "scientific" | "strict")[] = [
      "empathetic",
      "scientific",
      "strict",
    ];
    const currentIndex = tones.indexOf(activeTone);
    const nextTone = tones[(currentIndex + 1) % tones.length];
    set({ hakeemTone: nextTone, tone: nextTone });
  };

  useEffect(() => {
    setMsgs([
      {
        id: "hello",
        from: "ai",
        text:
          state.lang === "ar"
            ? `أهلًا ${state.nickname || "يا صديقي"}، أنا حكيم. ما الذي تشعر به الآن؟`
            : `Hi ${state.nickname || "friend"}, I'm Hakeem. What are you feeling right now?`,
      },
    ]);
  }, [state.lang, state.nickname]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  const send = async (value: string, hiddenDirective?: string) => {
    const v = value.trim();
    if (!v || typing) return;

    const userMsgId = crypto.randomUUID();
    const updatedMsgs = [...msgs, { id: userMsgId, from: "me" as const, text: v }];
    setMsgs(updatedMsgs);
    setText("");
    setTyping(true);

    const aiMsgId = crypto.randomUUID();
    setMsgs((prev) => [...prev, { id: aiMsgId, from: "ai" as const, text: "" }]);

    try {
      const payloadMessages = updatedMsgs.map((m, idx) => {
        const isLast = idx === updatedMsgs.length - 1;
        if (isLast && hiddenDirective) {
          return { from: m.from, text: m.text, hiddenDirective };
        }
        return { from: m.from, text: m.text };
      });

      const response = await fetch("/api/hakeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          userContext: {
            nickname: state.nickname,
            gender: state.gender,
            target: state.target,
            duration: state.duration,
            triggers: state.triggers,
            motivation: state.motivation,
            tone: activeTone,
            hakeemTone: activeTone,
            hakeemLength: state.hakeemLength || "medium",
            lang: state.lang,
          },
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("HTTP error " + response.status);
      }

      setTyping(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamAccumulator = "";

      while (true) {
        const { done, value: chunkVal } = await reader.read();
        if (done) break;
        const chunkText = decoder.decode(chunkVal, { stream: true });
        streamAccumulator += chunkText;

        setMsgs((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: streamAccumulator } : m)),
        );
      }
    } catch (err) {
      console.error("Hakeem chat error:", err);
      setTyping(false);
      const fallback =
        state.lang === "ar"
          ? "أنا هنا معك. خذ نفساً عميقاً لأربع ثوانٍ، احبسه سبعاً، وأخرجه في ثمانٍ. الموجة ستمر سريعا."
          : "I am right here with you. Breathe in for four seconds, hold for seven, exhale for eight. The wave will pass.";
      setMsgs((prev) =>
        prev.map((m) => (m.id === aiMsgId && !m.text ? { ...m, text: fallback } : m)),
      );
    }
  };

  const handleQuickChip = (chipLabel: string) => {
    const triggerDirective =
      "[SYSTEM DIRECTIVE: User is experiencing an immediate trigger right now. Provide a concise 3-step grounding exercise/Urge Surfing technique immediately].";
    send(chipLabel, triggerDirective);
  };

  const quick = [tr("quick1"), tr("quick2"), tr("quick3"), tr("quick4"), tr("quick5")];

  const toneBadges = {
    empathetic: state.lang === "ar" ? "متعاطف" : "Empathetic",
    scientific: state.lang === "ar" ? "علمي" : "Scientific",
    strict: state.lang === "ar" ? "حازم" : "Strict",
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-noir/8 bg-background/80 px-5 py-4 backdrop-blur-md">
        {/* Title & Interactive Tone Badge directly under title in RTL */}
        <div className="flex flex-col items-start gap-1">
          <p className="font-display text-base font-semibold text-maroon">{tr("hakeem")}</p>
          <button
            onClick={cycleTone}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-cherry/20 bg-cherry/10 px-2.5 py-0.5 text-[11px] font-medium text-cherry hover:bg-cherry/20 active:scale-95 transition-all cursor-pointer"
            title={state.lang === "ar" ? "اضغط لتغيير نبرة حكيم" : "Click to toggle Hakeem's tone"}
          >
            <Sparkles size={11} />
            <span>{toneBadges[activeTone]}</span>
          </button>
        </div>

        {/* Circular Home Icon Button strictly on top-left in RTL */}
        <Link
          to="/dashboard"
          aria-label={tr("home")}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-noir/10 bg-card/70 text-maroon hover:border-cherry/40 active:scale-95 transition-all"
        >
          <Home size={18} strokeWidth={1.75} />
        </Link>
      </header>

      <div className="mx-auto w-full max-w-xl flex-1 space-y-3 overflow-y-auto px-5 py-6">
        {msgs.map((m) => {
          if (m.from === "ai" && !m.text) return null;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                dir={state.lang === "ar" ? "rtl" : "ltr"}
                className={`max-w-[85%] rounded-[24px] px-5 py-3.5 text-sm leading-relaxed ${
                  m.from === "me"
                    ? "bg-cherry text-cotton shadow-sm font-sans whitespace-pre-wrap"
                    : "bg-white text-cherry font-bold border border-noir/10 shadow-sm font-thamanya antialiased"
                }`}
              >
                {m.from === "ai" ? (
                  <div className="markdown-body space-y-2 [&_p]:mb-1.5 [&_p:last-child]:mb-0 [&_strong]:font-black [&_strong]:text-cherry [&_ul]:list-disc [&_ul]:pr-4 [&_ol]:list-decimal [&_ol]:pr-4">
                    <Markdown>{cleanArabicOutput(m.text)}</Markdown>
                  </div>
                ) : (
                  m.text
                )}
              </div>
            </motion.div>
          );
        })}

        {typing && (
          <div className="flex justify-start">
            <div className="flex gap-1.5 rounded-[24px] border border-noir/10 bg-[var(--cotton)] px-5 py-4 shadow-sm">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.25, 1, 0.25] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18 }}
                  className="h-1.5 w-1.5 rounded-full bg-cherry"
                />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 border-t border-noir/8 bg-background/85 backdrop-blur-md">
        <div className="mx-auto w-full max-w-xl px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
            {quick.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickChip(q)}
                disabled={typing}
                className="shrink-0 rounded-full border border-noir/10 bg-card/70 px-4 py-2 text-xs text-maroon hover:border-cherry/40 active:scale-95 transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(text);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={tr("typeMsg")}
              dir={state.lang === "ar" ? "rtl" : "ltr"}
              disabled={typing}
              className="flex-1 rounded-full border border-noir/10 bg-card/80 px-5 py-3.5 text-sm text-maroon outline-none focus:border-cherry transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={typing || !text.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cherry text-cotton hover:bg-maroon transition-colors disabled:opacity-40"
            >
              <Send size={18} className="rtl:-scale-x-100" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
