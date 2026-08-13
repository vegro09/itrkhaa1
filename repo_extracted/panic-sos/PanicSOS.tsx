import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, RefreshCw, ShieldCheck, X } from "lucide-react";
import { ChallengeIcon } from "./ChallengeIcon";
import { pickRandomChallenge, type Challenge } from "@/lib/sos-challenges";
import { loadPledge, type Pledge } from "@/lib/pledge";

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
      className="flex flex-1 flex-col items-center justify-center gap-10 text-center"
    >
      <div className="space-y-3">
        <h1 className="font-display text-3xl leading-snug md:text-5xl">
          تنفس ببطء مع الدائرة المضيئة..
        </h1>
        <p className="mx-auto max-w-xl text-sm leading-relaxed text-sos-ink/60 md:text-base">
          إلغاء التفكير التلقائي وإعادة توجيه الأوكسجين للدماغ لتقليل شدة الرغبة.
        </p>
      </div>

      <div className="relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
        <motion.div
          className="absolute inset-0 rounded-full bg-sos-accent/25 blur-3xl"
          animate={{ scale: [0.8, 1.15, 1.15, 0.8], opacity: [0.35, 0.8, 0.8, 0.35] }}
          transition={{
            duration: TOTAL,
            times: [0, 4 / TOTAL, 8 / TOTAL, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-6 rounded-full border border-sos-ink/15 bg-sos-accent/20 shadow-glow"
          animate={{ scale: [0.72, 1.1, 1.1, 0.72] }}
          transition={{
            duration: TOTAL,
            times: [0, 4 / TOTAL, 8 / TOTAL, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1">
          <span className="font-display text-2xl md:text-3xl">{label}</span>
          <span className="text-xs text-sos-ink/50">الدورة {Math.min(cycles + 1, 3)} من 3</span>
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
      className="flex flex-1 flex-col items-center justify-center gap-8 text-center"
    >
      <AnimatePresence mode="wait">
        <motion.div key={challenge.id} {...fade} className="flex flex-col items-center gap-8">
          <div className="flex h-44 w-44 items-center justify-center rounded-full border border-sos-ink/10 bg-sos-ink/5 text-sos-ink shadow-glow md:h-56 md:w-56">
            <ChallengeIcon icon={challenge.icon} />
          </div>
          <div className="space-y-3">
            <h2 className="font-display max-w-2xl text-3xl leading-snug md:text-5xl">
              {challenge.action}
            </h2>
            <p className="mx-auto max-w-md text-sm text-sos-ink/55 md:text-base">
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

function OathStage({ onFinish }: { onFinish: () => void }) {
  const pledge = useMemo<Pledge>(() => loadPledge(), []);

  return (
    <motion.div {...fade} className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sos-ink/10 px-4 py-1.5 text-xs text-sos-ink/60">
          <ShieldCheck className="h-4 w-4" strokeWidth={1.75} /> العهد
        </span>
      </div>

      <div className="w-full max-w-2xl space-y-5 rounded-3xl border border-sos-ink/10 bg-sos-ink/5 p-6 md:p-8">
        <p className="whitespace-pre-line font-display text-lg leading-loose md:text-2xl">
          {pledge.text}
        </p>

        <div className="rounded-2xl border border-sos-accent/40 bg-sos-accent/15 p-4">
          <p className="mb-1 text-xs text-sos-ink/60">خطة الهروب الخاصة بك</p>
          <p className="text-base leading-relaxed md:text-lg">{pledge.escapePlan}</p>
        </div>

        <div className="flex flex-col items-center gap-2 border-t border-sos-ink/10 pt-4">
          <span className="text-xs text-sos-ink/50">توقيعك</span>
          {pledge.signatureDataUrl ? (
            <img
              src={pledge.signatureDataUrl}
              alt="التوقيع بالإصبع"
              className="h-24 w-full max-w-xs object-contain opacity-90"
            />
          ) : (
            <span className="font-display text-2xl text-sos-ink/70">
              {pledge.name ?? "توقيعك المسجّل"}
            </span>
          )}
        </div>
      </div>

      <button onClick={onFinish} className="btn-sos-primary w-full max-w-2xl">
        تجاوزت الرغبة بنجاح.. العودة للرئيسية
      </button>
    </motion.div>
  );
}

export function PanicSOS({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const close = () => {
    document.body.style.overflow = "unset";
    onClose();
  };

  return (
    <div
      dir="rtl"
      className="sos-surface fixed inset-0 z-[9999] flex h-screen w-screen flex-col justify-between overflow-y-auto bg-sos-bg p-6 text-sos-ink backdrop-blur-xl md:p-12"
    >
      <div className="flex items-center justify-between">
        <button
          onClick={close}
          className="inline-flex items-center gap-2 rounded-full border border-sos-ink/10 px-4 py-2 text-sm text-sos-ink/70 transition-colors hover:bg-sos-ink/10 hover:text-sos-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
          خروج
        </button>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === currentStage ? "w-8 bg-sos-accent" : "w-4 bg-sos-ink/20"
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentStage === 1 ? (
          <BreathingStage key="s1" onNext={() => setCurrentStage(2)} />
        ) : currentStage === 2 ? (
          <ChallengeStage key="s2" onNext={() => setCurrentStage(3)} />
        ) : (
          <OathStage
            key="s3"
            onFinish={() => {
              onSuccess?.();
              close();
            }}
          />
        )}
      </AnimatePresence>

      <div className="pt-6 text-center text-xs text-sos-ink/35">
        {currentStage === 1 ? "تهدئة" : currentStage === 2 ? "تحدٍّ جسدي" : "العهد"}
      </div>
    </div>
  );
}
