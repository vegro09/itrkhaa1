import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, RefreshCw, ShieldCheck, X } from "lucide-react";
import { ChallengeIcon } from "./ChallengeIcon";
import { pickRandomChallenge, type Challenge } from "@/lib/sos-challenges";
import { loadPledge, type Pledge } from "@/lib/pledge";
import { useApp } from "@/lib/app-state";

const CYCLE = { inhale: 4, hold: 4, exhale: 6 };
const TOTAL = CYCLE.inhale + CYCLE.hold + CYCLE.exhale;

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function BreathingStage({ onNext }: { onNext: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const t = ((Date.now() - start) / 1000) % TOTAL;
      setPhase(t < CYCLE.inhale ? "inhale" : t < CYCLE.inhale + CYCLE.hold ? "hold" : "exhale");
      setCycles(Math.floor((Date.now() - start) / 1000 / TOTAL));
    }, 200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (cycles >= 3) onNext();
  }, [cycles, onNext]);

  const label = phase === "inhale" ? "شهيق" : phase === "hold" ? "احبس" : "زفير";

  return (
    <motion.div
      {...fade}
      className="flex flex-1 flex-col items-center justify-center gap-10 text-center py-6"
    >
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-bold leading-snug text-[#EDEBDE] md:text-5xl">
          تنفس ببطء مع الدائرة المضيئة..
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#EDEBDE]/70 md:text-base">
          إلغاء التفكير التلقائي وإعادة توجيه الأوكسجين للدماغ لتقليل شدة الرغبة.
        </p>
      </div>

      <div className="relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
        <motion.div
          className="absolute inset-0 rounded-full bg-[#810100]/30 blur-3xl"
          animate={{ scale: [0.8, 1.15, 1.15, 0.8], opacity: [0.35, 0.8, 0.8, 0.35] }}
          transition={{
            duration: TOTAL,
            times: [0, 4 / TOTAL, 8 / TOTAL, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-6 rounded-full border border-[#EDEBDE]/15 bg-[#810100]/20 shadow-[0_0_50px_rgba(129,1,0,0.5)]"
          animate={{ scale: [0.72, 1.1, 1.1, 0.72] }}
          transition={{
            duration: TOTAL,
            times: [0, 4 / TOTAL, 8 / TOTAL, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="font-display text-2xl font-bold text-[#EDEBDE] md:text-4xl">
            {label}
          </span>
          <span className="text-xs text-[#EDEBDE]/60">الدورة {Math.min(cycles + 1, 3)} من 3</span>
        </div>
      </div>

      <button onClick={onNext} className="btn-sos-primary">
        جاهز للتحدي <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
      </button>
    </motion.div>
  );
}

function ChallengeStage({ onNext }: { onNext: () => void }) {
  const [challenge, setChallenge] = useState<Challenge>(() => pickRandomChallenge());

  return (
    <motion.div
      {...fade}
      className="flex flex-1 flex-col items-center justify-center gap-8 text-center py-6"
    >
      <AnimatePresence mode="wait">
        <motion.div key={challenge.id} {...fade} className="flex flex-col items-center gap-8">
          <div className="flex h-44 w-44 items-center justify-center rounded-full border border-[#EDEBDE]/10 bg-[#EDEBDE]/5 text-[#EDEBDE] shadow-[0_0_40px_rgba(129,1,0,0.3)] md:h-56 md:w-56">
            <ChallengeIcon icon={challenge.icon} />
          </div>
          <div className="space-y-3">
            <h2 className="font-display max-w-2xl text-3xl font-bold leading-snug text-[#EDEBDE] md:text-5xl">
              {challenge.action}
            </h2>
            <p className="mx-auto max-w-md text-sm text-[#EDEBDE]/60 md:text-base">
              {challenge.hint}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex w-full max-w-md flex-col gap-3">
        <button onClick={onNext} className="btn-sos-primary w-full">
          نفذت التحدي بنجاح <ArrowLeft className="h-5 w-5" strokeWidth={1.75} />
        </button>
        <button
          onClick={() => setChallenge((c) => pickRandomChallenge(c.id))}
          className="btn-sos-ghost w-full"
        >
          تحدي آخر <RefreshCw className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>
    </motion.div>
  );
}

function OathStage({
  onFinish,
  pledgeText: customPledgeText,
  escapePlan: customEscapePlan,
  signatureDataUrl: customSig,
  nickname: customName,
}: {
  onFinish: () => void;
  pledgeText?: string;
  escapePlan?: string;
  signatureDataUrl?: string | null;
  nickname?: string | null;
}) {
  const { state } = useApp();
  const fallbackPledge = useMemo<Pledge>(() => loadPledge(), []);

  const pledgeText = customPledgeText || state.pledgeText || fallbackPledge.text;
  const reasons = state.pledgeReasons;
  const impacts = state.pledgeImpacts;
  const goals = state.pledgeGoals;
  const escapePlan = customEscapePlan || state.pledgeEscapePlan || fallbackPledge.escapePlan;
  const signatureDataUrl = customSig ?? state.pledgeSignature ?? fallbackPledge.signatureDataUrl;
  const name = customName || state.nickname || fallbackPledge.name || "توقيعك المسجّل";

  return (
    <motion.div
      {...fade}
      className="flex flex-1 flex-col items-center justify-center gap-6 py-4 w-full max-w-2xl mx-auto"
    >
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#EDEBDE]/15 bg-[#EDEBDE]/5 px-4 py-1.5 text-xs text-[#EDEBDE]/80">
          <ShieldCheck className="h-4 w-4 text-[#810100]" strokeWidth={2} /> العهد والميثاق
        </span>
      </div>

      <div className="w-full space-y-5 rounded-3xl border border-[#EDEBDE]/10 bg-[#EDEBDE]/5 p-6 md:p-8 text-[#EDEBDE]">
        <p className="whitespace-pre-line font-display text-base leading-relaxed md:text-xl font-medium text-right">
          {pledgeText}
        </p>

        {(reasons || impacts || goals) && (
          <div className="space-y-3 border-t border-[#EDEBDE]/10 pt-4 text-right text-xs md:text-sm">
            {reasons && (
              <div>
                <span className="font-bold text-[#EDEBDE]/90">دوافعي للحرية: </span>
                <span className="text-[#EDEBDE]/70">{reasons}</span>
              </div>
            )}
            {impacts && (
              <div>
                <span className="font-bold text-[#EDEBDE]/90">ما خسرتُه وأرفض خسارته مجدداً: </span>
                <span className="text-[#EDEBDE]/70">{impacts}</span>
              </div>
            )}
            {goals && (
              <div>
                <span className="font-bold text-[#EDEBDE]/90">أهدافي القادمة: </span>
                <span className="text-[#EDEBDE]/70">{goals}</span>
              </div>
            )}
          </div>
        )}

        {escapePlan && (
          <div className="rounded-2xl border border-[#810100]/40 bg-[#810100]/15 p-4 text-right">
            <p className="mb-1 text-xs text-[#EDEBDE]/60 font-medium">
              خطة الهروب الخاصة بك عند الطوارئ
            </p>
            <p className="text-sm leading-relaxed md:text-base text-[#EDEBDE]">{escapePlan}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-2 border-t border-[#EDEBDE]/10 pt-4">
          <span className="text-xs text-[#EDEBDE]/50">توقيع الملتزم بالعهد ({name})</span>
          {signatureDataUrl ? (
            <img
              src={signatureDataUrl}
              alt="توقيعك بالإصبع"
              className="h-20 w-full max-w-xs object-contain opacity-95 invert brightness-200"
            />
          ) : (
            <span className="font-display text-xl font-bold text-[#EDEBDE]/80 py-2">{name}</span>
          )}
        </div>
      </div>

      <button onClick={onFinish} className="btn-sos-primary w-full max-w-2xl">
        تجاوزت الرغبة بنجاح.. العودة للرئيسية
      </button>
    </motion.div>
  );
}

export interface PanicSOSProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  pledgeText?: string;
  escapePlan?: string;
  signatureDataUrl?: string | null;
  nickname?: string | null;
}

export function PanicSOS({
  isOpen = true,
  onClose,
  onSuccess,
  pledgeText,
  escapePlan,
  signatureDataUrl,
  nickname,
}: PanicSOSProps) {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentStage(1);
    } else {
      document.body.style.overflow = "unset";
      setCurrentStage(1);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const close = () => {
    setCurrentStage(1);
    document.body.style.overflow = "unset";
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="sos-surface fixed inset-0 z-[9999] flex h-screen w-screen flex-col justify-between overflow-y-auto bg-[#121010] p-6 text-[#EDEBDE] backdrop-blur-xl md:p-12"
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={close}
          className="inline-flex items-center gap-2 rounded-full border border-[#EDEBDE]/15 bg-[#EDEBDE]/5 px-4 py-2 text-sm text-[#EDEBDE]/80 transition-colors hover:bg-[#EDEBDE]/10 hover:text-[#EDEBDE] cursor-pointer"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
          خروج
        </button>

        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === currentStage ? "w-8 bg-[#810100]" : "w-4 bg-[#EDEBDE]/20"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStage === 1 ? (
          <BreathingStage key={`s1-${isOpen}`} onNext={() => setCurrentStage(2)} />
        ) : currentStage === 2 ? (
          <ChallengeStage key={`s2-${isOpen}`} onNext={() => setCurrentStage(3)} />
        ) : (
          <OathStage
            key={`s3-${isOpen}`}
            pledgeText={pledgeText}
            escapePlan={escapePlan}
            signatureDataUrl={signatureDataUrl}
            nickname={nickname}
            onFinish={() => {
              onSuccess?.();
              close();
            }}
          />
        )}
      </AnimatePresence>

      <div className="pt-4 text-center text-xs text-[#EDEBDE]/40">
        المرحلة {currentStage} من 3:{" "}
        {currentStage === 1
          ? "تهدئة وتنفس"
          : currentStage === 2
            ? "تحدٍّ جسدي لكسر الرغبة"
            : "العهد وخطة الهروب"}
      </div>
    </div>
  );
}
