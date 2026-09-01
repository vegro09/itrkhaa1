import React from "react";

export interface RecoveryTrackerProps {
  days: number;
  hours: number;
  minutes: number;
  targetDays?: number;
}

export function RecoveryTracker({
  days,
  hours,
  minutes,
  targetDays = 90,
}: RecoveryTrackerProps) {
  const clampedDays = Math.min(Math.max(days, 0), targetDays);
  const ratio = clampedDays / targetDays;
  const percentage = Math.round(ratio * 100);

  // SVG viewBox height is 140
  const totalHeight = 140;
  // Calculate reveal height for silver shield layer over gunmetal base
  const visualRatio = clampedDays === 0 ? 0 : 0.12 + ratio * 0.88;
  const fillHeight = totalHeight * visualRatio;
  const fillY = totalHeight - fillHeight;
  const isHighFill = visualRatio > 0.45;

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center py-6 bg-transparent border-none shadow-none text-center dir-rtl">
      {/* شريط العنوان العلوي */}
      <div className="w-full flex items-center justify-between mb-2 px-2">
        <span className="text-xs font-semibold text-noir/50 dark:text-cotton/50 tracking-wide">
          مدّة تعافيك
        </span>
        <span className="text-xs font-bold text-maroon dark:text-[#EDEBDE] bg-cherry/10 px-3 py-1.5 rounded-full border border-cherry/20 font-serif">
          {clampedDays >= targetDays ? "الدرع الفضي المكتمل ⚔️" : "الدرع الفضي المنيع"}
        </span>
      </div>

      {/* حاوية الرسم المركزي التفاعلي */}
      <div className="relative w-64 h-64 flex items-center justify-center my-2">
        <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 120 140">
          <defs>
            {/* 3D Metallic Gunmetal Base Gradients (Empty State Grayscale Texture) */}
            <linearGradient id="gunmetal-base" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="30%" stopColor="#1F2937" />
              <stop offset="60%" stopColor="#111827" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>

            <linearGradient id="gunmetal-rim" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6B7280" />
              <stop offset="40%" stopColor="#374151" />
              <stop offset="70%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#4B5563" />
            </linearGradient>

            {/* Rich 3D Metallic Silver Gradients (Active Revealed Layer) */}
            <linearGradient id="silver-base" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E5E7EB" />
              <stop offset="50%" stopColor="#9CA3AF" />
              <stop offset="75%" stopColor="#F3F4F6" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>

            <linearGradient id="silver-rim" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#9CA3AF" />
              <stop offset="70%" stopColor="#4B5563" />
              <stop offset="100%" stopColor="#E5E7EB" />
            </linearGradient>

            {/* مسار قص الحد الداخلي للدرع */}
            <clipPath id="inner-shield-clip">
              <path d="M 60 18 C 75 18 95 28 102 28 C 102 65 88 100 60 125 C 32 100 18 65 18 28 C 25 28 45 18 60 18 Z" />
            </clipPath>

            {/* مسار القص الديناميكي لكشف الدرع الفضي من الأسفل للأعلى */}
            <clipPath id="silver-reveal-clip">
              <rect
                x="0"
                y={fillY}
                width="120"
                height={fillHeight}
                className="transition-all duration-1000 ease-out"
              />
            </clipPath>
          </defs>

          {/* LAYER 1: BASE GUNMETAL 3D SHIELD (Empty State Texture) */}
          <g id="monochrome-base-shield">
            {/* 1.1 الظل الخلفي */}
            <path
              d="M 60 8 C 80 8 105 20 112 20 C 112 65 95 110 60 135 C 25 110 8 65 8 20 C 15 20 40 8 60 8 Z"
              fill="rgba(0,0,0,0.45)"
              transform="translate(0, 4)"
              filter="blur(4px)"
            />

            {/* 1.2 الإطار الخارجي الفولاذي الداكن */}
            <path
              d="M 60 8 C 80 8 105 20 112 20 C 112 65 95 110 60 135 C 25 110 8 65 8 20 C 15 20 40 8 60 8 Z"
              fill="url(#gunmetal-base)"
              stroke="url(#gunmetal-rim)"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* 1.3 التجويف الداخلي الداكن */}
            <path
              d="M 60 15 C 75 15 98 25 105 25 C 105 65 90 105 60 128 C 30 105 15 65 15 25 C 22 25 45 15 60 15 Z"
              fill="#111827"
              stroke="#374151"
              strokeWidth="1.5"
            />

            {/* 1.4 السطح الداخلي ثلاثي الأبعاد */}
            <path
              d="M 60 18 C 75 18 95 28 102 28 C 102 65 88 100 60 125 C 32 100 18 65 18 28 C 25 28 45 18 60 18 Z"
              fill="url(#gunmetal-base)"
              opacity="0.85"
            />

            {/* 1.5 إضاءة وحجم ثلاثي الأبعاد معتم */}
            <path d="M 60 15 L 60 128" stroke="#4B5563" strokeWidth="1.2" opacity="0.6" />

            {/* 1.6 مسامير تثبيت معتمة */}
            <g fill="url(#gunmetal-rim)" stroke="#0F172A" strokeWidth="0.5">
              <circle cx="60" cy="11.5" r="2" />
              <circle cx="15" cy="24" r="1.5" />
              <circle cx="105" cy="24" r="1.5" />
              <circle cx="12" cy="65" r="1.5" />
              <circle cx="108" cy="65" r="1.5" />
              <circle cx="32" cy="105" r="1.5" />
              <circle cx="88" cy="105" r="1.5" />
              <circle cx="60" cy="131" r="2" />
            </g>
          </g>

          {/* LAYER 2: TOP METALLIC SILVER SHIELD (Active Fill State Revealed via ClipPath) */}
          <g id="metallic-silver-shield" clipPath="url(#silver-reveal-clip)">
            {/* 2.1 الإطار الفضي المعدني الخارجي */}
            <path
              d="M 60 8 C 80 8 105 20 112 20 C 112 65 95 110 60 135 C 25 110 8 65 8 20 C 15 20 40 8 60 8 Z"
              fill="url(#silver-base)"
              stroke="url(#silver-rim)"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* 2.2 التجويف الداخلي الفولاذي */}
            <path
              d="M 60 15 C 75 15 98 25 105 25 C 105 65 90 105 60 128 C 30 105 15 65 15 25 C 22 25 45 15 60 15 Z"
              fill="#E5E7EB"
              stroke="#4B5563"
              strokeWidth="1.5"
            />

            {/* 2.3 لمعان السطح الداخلي الفضي اللامع */}
            <path
              d="M 60 18 C 75 18 95 28 102 28 C 102 65 88 100 60 125 C 32 100 18 65 18 28 C 25 28 45 18 60 18 Z"
              fill="url(#silver-base)"
              opacity="0.95"
            />

            {/* 2.4 انعكاس ثلاثي الأبعاد لامع */}
            <path d="M 60 15 L 60 128" stroke="#ffffff" strokeWidth="1.5" opacity="0.8" />

            {/* 2.5 مسامير التثبيت الفولاذية اللامعة */}
            <g fill="url(#silver-rim)" stroke="#1F2937" strokeWidth="0.5">
              <circle cx="60" cy="11.5" r="2" />
              <circle cx="15" cy="24" r="1.5" />
              <circle cx="105" cy="24" r="1.5" />
              <circle cx="12" cy="65" r="1.5" />
              <circle cx="108" cy="65" r="1.5" />
              <circle cx="32" cy="105" r="1.5" />
              <circle cx="88" cy="105" r="1.5" />
              <circle cx="60" cy="131" r="2" />
            </g>
          </g>

          {/* LAYER 3: FORGING EDGE MOLTEN/CHARGING GLOW LINE AT BOUNDARY */}
          {clampedDays > 0 && (
            <g clipPath="url(#inner-shield-clip)">
              <line
                x1="0"
                y1={fillY}
                x2="120"
                y2={fillY}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                opacity="0.9"
                className="transition-all duration-1000 ease-out"
                style={{ filter: "drop-shadow(0 0 5px rgba(255,255,255,0.9))" }}
              />
            </g>
          )}
        </svg>

        {/* الأرقام المركزية داخل الدرع (مع تباين ذكي عالي القراءة) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-2">
          <span
            id="days-count"
            className={`text-6xl font-black tracking-tighter drop-shadow-md z-10 transition-colors duration-500 ${
              isHighFill ? "text-[#810100]" : "text-[#F3F4F6]"
            }`}
          >
            {clampedDays}
          </span>
          <span
            id="days-label"
            className={`text-sm font-bold mt-1 drop-shadow-sm z-10 transition-colors duration-500 ${
              isHighFill ? "text-[#810100]" : "text-[#F3F4F6]"
            }`}
          >
            يوم حُر
          </span>
        </div>
      </div>

      {/* الوقت الإضافي (بدون ثوانٍ) */}
      <div className="text-sm font-semibold text-noir/70 dark:text-cotton/70 mt-2 mb-4">
        + <span id="hours-count">{hours}</span> ساعة : <span id="minutes-count">{minutes}</span> دقيقة
      </div>

      {/* شريط تقدم محطة الـ 90 يوماً المستمر */}
      <div className="w-full bg-noir/10 dark:bg-white/10 h-2.5 rounded-full overflow-hidden mb-2 relative shadow-inner">
        <div
          id="linear-progress"
          className="h-full bg-gradient-to-l from-[#E5E7EB] via-[#9CA3AF] to-[#374151] rounded-full transition-all duration-700 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* أرقام ونسب المحطات */}
      <div className="w-full flex items-center justify-between text-[11px] font-bold text-noir/50 dark:text-cotton/50 px-1">
        <span>اليوم 0</span>
        <span className="text-maroon dark:text-[#EDEBDE] px-2.5 py-0.5 bg-cherry/10 rounded-md border border-cherry/20">
          <span id="percent-count">{percentage}</span>% من الهدف
        </span>
        <span>المحطة {targetDays} يوم</span>
      </div>
    </div>
  );
}
