import { useRef, useState, useEffect } from "react";
import { ShieldCheck, Eraser, PenTool, CheckCircle2, Sparkles } from "lucide-react";
import { useApp, type Lang } from "@/lib/app-state";

export interface PledgeDocumentProps {
  reasons?: string;
  impacts?: string;
  goals?: string;
  emergencyPlan?: string;
  nickname?: string;
  initialSignature?: string | null;
  onSaveSignature?: (sigDataUrl: string) => void;
  onOpenReSignModal?: () => void;
  onChangeFields?: (fields: {
    reasons?: string;
    impacts?: string;
    goals?: string;
    emergencyPlan?: string;
  }) => void;
  readOnly?: boolean;
  lang?: Lang;
}

export function PledgeDocument({
  reasons = "",
  impacts = "",
  goals = "",
  emergencyPlan = "",
  nickname = "",
  initialSignature = null,
  onSaveSignature,
  onOpenReSignModal,
  onChangeFields,
  readOnly = false,
  lang,
}: PledgeDocumentProps) {
  const { state } = useApp();
  const currentLang = lang || state?.lang || "ar";
  const isAr = currentLang === "ar";

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!initialSignature);
  const [savedSig, setSavedSig] = useState<string | null>(initialSignature || null);
  const [hasDrawnStroke, setHasDrawnStroke] = useState(!!initialSignature);

  // Local state for interactive text areas
  const [fieldReasons, setFieldReasons] = useState(reasons);
  const [fieldImpacts, setFieldImpacts] = useState(impacts);
  const [fieldGoals, setFieldGoals] = useState(goals);
  const [fieldEmergencyPlan, setFieldEmergencyPlan] = useState(emergencyPlan);

  useEffect(() => {
    setFieldReasons(reasons);
  }, [reasons]);

  useEffect(() => {
    setFieldImpacts(impacts);
  }, [impacts]);

  useEffect(() => {
    setFieldGoals(goals);
  }, [goals]);

  useEffect(() => {
    setFieldEmergencyPlan(emergencyPlan);
  }, [emergencyPlan]);

  useEffect(() => {
    if (initialSignature) {
      setSavedSig(initialSignature);
      setHasSignature(true);
      setHasDrawnStroke(true);
    }
  }, [initialSignature]);

  // Canvas drawing routines
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ("touches" in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ("clientX" in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawnStroke(true);
    const coords = getCoordinates(e, canvas);

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoordinates(e, canvas);

    ctx.strokeStyle = "#810100"; // cherry red
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && onSaveSignature) {
      const dataUrl = canvas.toDataURL("image/png");
      setSavedSig(dataUrl);
      setHasSignature(true);
      onSaveSignature(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasDrawnStroke(false);
    setHasSignature(false);
    setSavedSig(null);
    if (onSaveSignature) onSaveSignature("");
  };

  const signWithName = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "italic bold 32px 'Thamanya', 'Amiri', serif";
    ctx.fillStyle = "#810100";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(nickname || (isAr ? "البطل" : "Hero"), canvas.width / 2, canvas.height / 2);

    const dataUrl = canvas.toDataURL("image/png");
    setSavedSig(dataUrl);
    setHasSignature(true);
    setHasDrawnStroke(true);
    if (onSaveSignature) onSaveSignature(dataUrl);
  };

  const todayDate = new Date().toLocaleDateString(isAr ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-[28px] border-2 border-[#D4CBB0] bg-[#F7F4EA] p-5 sm:p-7 text-maroon shadow-lg text-start dark:bg-[#1C1816] dark:border-[#3D3530] dark:text-[#EDEBDE] transition-all">
      {/* Scrollable Parchment Sheet */}
      <div className="max-h-[620px] overflow-y-auto pr-1 space-y-6 text-xs sm:text-sm leading-relaxed scrollbar-thin scrollbar-thumb-cherry/20">
        {/* Header Title */}
        <div className="text-center border-b border-[#D4CBB0]/60 pb-4 dark:border-[#3D3530]">
          <div className="inline-flex items-center gap-2 rounded-full bg-cherry/10 px-4 py-1.5 text-cherry font-bold text-xs mb-2">
            <ShieldCheck size={16} />
            <span>{isAr ? "العهد" : "The Pledge"}</span>
          </div>
          <h1 className="font-thamanya text-2xl font-bold tracking-tight text-maroon dark:text-[#EDEBDE]">
            {isAr ? "﴿ العهد ﴾" : "﴿ The Pledge ﴾"}
          </h1>
          <p className="text-xs font-semibold text-cherry mt-1">
            {isAr ? "بسم الله الرحمن الرحيم" : "In the Name of God, Most Gracious, Most Merciful"}
          </p>
        </div>

        {/* Continuous Parchment Text Flow */}
        <div className="space-y-5 text-noir/90 dark:text-cotton/90 font-sans leading-relaxed text-xs sm:text-sm">
          {/* Preamble Paragraphs */}
          <p>
            {isAr
              ? "أنا اليوم أقف مع نفسي بصدق، وأعترف أن هذه العادة أخذت مني أشياء كثيرة، وأن الاستمرار فيها لن يقودني إلى الحياة التي أريدها. لقد حان الوقت لأن أتوقف عن تأجيل التغيير، وأن أبدأ باستعادة وقتي، وطاقتي، وتركيزي، وثقتي بنفسي، وكل شيء أشعر أنني فقدته بسبب هذه العادة."
              : "Today I stand honestly with myself, acknowledging that this habit has taken so much from me, and that continuing it will not lead to the life I want. The time has come to stop postponing change, and to begin reclaiming my time, my energy, my focus, my self-confidence, and everything I feel I lost because of this habit."}
          </p>

          <p>
            {isAr
              ? "أنا لا أكتب هذا العهد لأنني أكره نفسي أو ألومها، بل لأنني أؤمن أنني أستحق حياة أفضل، وأن التغيير ممكن مهما طال الطريق. قد أتعثر، وقد تمر عليّ لحظات صعبة، لكنني لن أجعل لحظة ضعف واحدة تقرر مستقبلي كله."
              : "I do not write this pledge out of self-hatred or blame, but because I believe I deserve a better life, and that change is possible no matter how long the road. I may stumble, and difficult moments will come, but I will not let a single moment of weakness decide my entire future."}
          </p>

          {/* Section 1 */}
          <div className="space-y-1.5 pt-1">
            <h2 className="font-bold text-cherry text-sm sm:text-base">
              {isAr
                ? "أولاً: لماذا أريد أن أترك هذه العادة؟"
                : "1. Why do I want to break this habit?"}
            </h2>
            <p>
              {isAr
                ? "أريد أن أترك هذه العادة لأنني أعرف أنها لم تعد شيئًا أريده في حياتي، ولأنني أريد أن أكون أنا من يقرر ماذا أفعل، وليس العادة هي التي تقرر عني."
                : "I want to break this habit because I know it is no longer something I want in my life, and because I want to be the one deciding what I do, not the habit deciding for me."}
            </p>
            <p className="font-medium text-maroon dark:text-[#EDEBDE] pt-0.5">
              <span className="font-bold text-cherry">
                {isAr ? "أكثر الأسباب التي تدفعني لتركها: " : "The primary reasons driving me to break it: "}
              </span>
              <span>
                {fieldReasons ||
                  (isAr
                    ? "استعادة حريتي وكرامتي وصحتي"
                    : "Regaining my freedom, dignity, and health")}
              </span>
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-1.5 pt-1">
            <h2 className="font-bold text-cherry text-sm sm:text-base">
              {isAr ? "ثانياً: ماذا أخذت مني هذه العادة؟" : "2. What has this habit taken from me?"}
            </h2>
            <p>
              {isAr
                ? "أعترف بصدق أن هذه العادة أثرت في جوانب من حياتي، وأنني لا أريد أن أسمح لها بأخذ المزيد مني."
                : "I honestly admit that this habit has affected areas of my life, and I refuse to let it take any more from me."}
            </p>
            <p className="font-medium text-maroon dark:text-[#EDEBDE] pt-0.5">
              <span className="font-bold text-cherry">
                {isAr ? "أكثر الأشياء التي تأثرت في حياتي هي: " : "The things most affected in my life are: "}
              </span>
              <span>
                {fieldImpacts ||
                  (isAr
                    ? "الندم والإنهاك وضياع الوقت"
                    : "Regret, physical exhaustion, and lost time")}
              </span>
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-1.5 pt-1">
            <h2 className="font-bold text-cherry text-sm sm:text-base">
              {isAr ? "ثالثاً: ماذا أريد أن أستعيد؟" : "3. What do I want to reclaim?"}
            </h2>
            <p>
              {isAr
                ? "أنا لا أترك هذه العادة لأحرم نفسي فقط، بل أتركها لأستعيد شيئًا أفضل. أتخيل حياتي بعد أن أتخلص منها، وأعرف أن كل يوم أبتعد فيه عنها هو يوم أقترب فيه من الشخص الذي أريد أن أكونه."
                : "I am not breaking this habit merely to deprive myself, but to reclaim something far better. I picture my life after breaking free, knowing every day I stay away brings me closer to the person I want to be."}
            </p>
            <p className="font-medium text-maroon dark:text-[#EDEBDE] pt-0.5">
              <span className="font-bold text-cherry">
                {isAr
                  ? "الأشياء التي أتمنى أن تتحسن في حياتي بعد تركها: "
                  : "Things I hope to improve in my life after quitting: "}
              </span>
              <span>
                {fieldGoals ||
                  (isAr
                    ? "الوصول لحياة أفضل وبناء مستقبل مشرق"
                    : "Reaching a better life and building a bright future")}
              </span>
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-1.5 pt-1">
            <h2 className="font-bold text-cherry text-sm sm:text-base">
              {isAr ? "رابعاً: خطتي عندما تأتي الرغبة" : "4. My plan when an urge strikes"}
            </h2>
            <p>
              {isAr
                ? "أعرف أن الرغبة قد تأتي فجأة، وقد تحاول إقناعي بأن أعود ولو لمرة واحدة. لكنني سأذكر نفسي في تلك اللحظة بسبب بدايتي، وبالأشياء التي كتبتها هنا. لن أتخذ قرارًا دائمًا بسبب شعور مؤقت."
                : "I know an urge may come suddenly and try to convince me to go back 'just once'. But in that moment, I will remind myself why I started and what I wrote here. I will not make a permanent decision based on a temporary feeling."}
            </p>
            <p className="font-medium text-maroon dark:text-[#EDEBDE] pt-0.5">
              <span className="font-bold text-cherry">
                {isAr
                  ? "عندما أشعر أن الرغبة أصبحت قوية، سأقوم بـ: "
                  : "When I feel the urge growing strong, I will: "}
              </span>
              <span>
                {fieldEmergencyPlan ||
                  (isAr
                    ? "الوضوء، التغيير الفوري للمكان، واستخدام زر الفزعة"
                    : "Cold water/wudu, changing location immediately, and using the SOS button")}
              </span>
            </p>
          </div>

          {/* Section 5: Covenant Declaration */}
          <div className="space-y-2 pt-2 text-maroon dark:text-[#EDEBDE]">
            <h2 className="font-bold text-cherry text-sm sm:text-base">
              {isAr ? "خامساً: عهدي مع نفسي" : "5. My covenant with myself"}
            </h2>
            <p className="font-medium">
              {isAr
                ? "أعاهد نفسي أن أستمر في هذه الرحلة، وأن أتعامل مع كل يوم كفرصة جديدة لأثبت لنفسي أنني قادر على التغيير."
                : "I pledge to myself to continue this journey, treating every day as a new opportunity to prove to myself that I am capable of change."}
            </p>
            <p className="font-medium">
              {isAr
                ? "إذا جاءتني لحظة ضعف، سأتذكر لماذا بدأت."
                : "If a moment of weakness comes, I will remember why I started."}
            </p>
            <p className="font-medium">
              {isAr
                ? "وإذا تعثرت، لن أقول إن كل شيء انتهى؛ سأقف وأكمل."
                : "And if I stumble, I will not say everything is over; I will stand up and keep going."}
            </p>
            <p className="font-medium">
              {isAr
                ? "وإذا حاولت العادة أن تعيدني إلى المكان الذي خرجت منه، سأقرأ هذا العهد وأتذكر كم كنت أريد أن أبتعد."
                : "And if the habit tries to pull me back to where I left, I will read this pledge and remember how much I wanted to break free."}
            </p>
            <p className="font-medium">
              {isAr
                ? "أنا لا أبحث عن الكمال، بل عن التقدم. ولا أحتاج أن أقطع الطريق كله اليوم؛ يكفيني أن آخذ الخطوة التالية."
                : "I am not looking for perfection, but for progress. I don't need to walk the entire path today; taking the next step is enough."}
            </p>
            <p className="font-bold text-cherry text-sm sm:text-base pt-1">
              {isAr
                ? "أنا اخترت أن أترك هذه العادة، لأن حياتي أكبر منها، ومستقبلي يستحق مني أن أحاول."
                : "I chose to leave this habit because my life is greater than it, and my future deserves my effort."}
            </p>
            <p className="font-bold text-maroon dark:text-[#EDEBDE] text-sm sm:text-base">
              {isAr ? "ومن هذه اللحظة، أبدأ من جديد." : "And from this moment, I start anew."}
            </p>
          </div>
        </div>

        {/* Signatures & Footer */}
        <div className="pt-4 border-t-2 border-dashed border-[#D4CBB0]/80 dark:border-[#3D3530] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold text-maroon dark:text-[#EDEBDE]">
            <div className="flex items-center gap-1.5">
              <span>{isAr ? "الاسم:" : "Name:"}</span>
              <span className="font-mono text-cherry text-base underline underline-offset-4 decoration-cherry/40">
                {nickname || (isAr ? "البطل" : "Hero")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{isAr ? "التاريخ:" : "Date:"}</span>
              <span className="font-mono text-xs text-noir/70 dark:text-cotton/70 bg-white/60 dark:bg-[#241F1E] px-2.5 py-1 rounded-full border border-[#D4CBB0]/40">
                {todayDate}
              </span>
            </div>
          </div>

          {/* Signature Section */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-maroon dark:text-[#EDEBDE] flex items-center gap-1.5">
                <PenTool size={14} className="text-cherry" />
                <span>{isAr ? "توقيع الأصبع المعتمد:" : "Approved Finger Signature:"}</span>
              </span>
              {!readOnly && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={signWithName}
                    className="inline-flex items-center gap-1 text-[11px] text-cherry font-medium hover:underline cursor-pointer bg-cherry/10 px-2.5 py-1 rounded-full border border-cherry/20"
                  >
                    <Sparkles size={12} />
                    <span>{isAr ? "توقيع سريع بالاسم" : "Quick Name Sign"}</span>
                  </button>
                  {(hasDrawnStroke || savedSig) && (
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="inline-flex items-center gap-1 text-[11px] text-noir/60 hover:text-cherry font-medium hover:underline cursor-pointer"
                    >
                      <Eraser size={12} />
                      <span>{isAr ? "مسح" : "Clear"}</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* If in read-only mode with saved signature */}
            {readOnly && savedSig ? (
              <div className="relative h-28 w-full flex items-center justify-center p-2 bg-transparent">
                <img
                  src={savedSig}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              /* Interactive Canvas Pad for signing right inside the document */
              <div className="relative h-32 w-full rounded-2xl border-2 border-dashed border-[#D4CBB0] dark:border-[#3D3530] bg-[#F4F0E2]/60 dark:bg-[#241F1E]/60 overflow-hidden cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={128}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="h-full w-full touch-none"
                />
                {!hasDrawnStroke && !savedSig && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-xs text-noir/40 dark:text-cotton/40 font-medium">
                    <span>{isAr ? "✍️ ارسم توقيعك هنا بأصبعك أو بالماوس..." : "✍️ Draw your signature here with finger or mouse..."}</span>
                  </div>
                )}
                {hasSignature && (
                  <div className="pointer-events-none absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-cherry/10 px-2 py-0.5 text-[10px] font-bold text-cherry">
                    <CheckCircle2 size={12} />
                    <span>{isAr ? "تم اعتماد التوقيع" : "Signature Saved"}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
