import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowRight, RotateCw, CheckCircle2 } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { PledgeDocument } from "@/components/pledge-document";

interface PanicSOSProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = "inhale" | "hold" | "exhale";

interface Challenge {
  id: string;
  title: string;
  description: string;
  svg: React.ReactNode;
}

// 22 DYNAMIC CHALLENGES WITH SPECIFIC SVG SPECIFICATIONS
const CHALLENGES: Challenge[] = [
  {
    id: "wuzu_salat",
    title: "تحدي الوضوء والصلاة",
    description: "قم الآن وتوضأ بماء بارد وأدِّ ركعتين لله.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Hands / Palms receiving water */}
        <path d="M30 65 C25 60 20 50 25 42 C30 35 38 40 42 48" />
        <path d="M70 65 C75 60 80 50 75 42 C70 35 62 40 58 48" />
        {/* Water droplets */}
        <path
          d="M50 20 Q50 30 46 34 A4 4 0 0 0 54 34 Q50 30 50 20"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <path
          d="M40 25 Q40 32 37 35 A3 3 0 0 0 43 35 Q40 32 40 25"
          fill="currentColor"
          fillOpacity="0.3"
        />
        <path
          d="M60 25 Q60 32 57 35 A3 3 0 0 0 63 35 Q60 32 60 25"
          fill="currentColor"
          fillOpacity="0.3"
        />
        {/* Prayer mat outline glowing at bottom */}
        <path
          d="M25 80 L75 80 L70 90 L30 90 Z"
          fill="#810100"
          fillOpacity="0.4"
          stroke="#EDEBDE"
          strokeWidth="2"
        />
        <line x1="30" y1="90" x2="30" y2="94" />
        <line x1="40" y1="90" x2="40" y2="94" />
        <line x1="50" y1="90" x2="50" y2="94" />
        <line x1="60" y1="90" x2="60" y2="94" />
        <line x1="70" y1="90" x2="70" y2="94" />
      </svg>
    ),
  },
  {
    id: "clothes_fold",
    title: "تحدي ترتيب الملابس",
    description: "افتح خزانة ملابسك فوراً ورتب 5 قطع ملابس.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Hanger above */}
        <path d="M50 20 C50 15 54 12 57 15 C59 17 57 22 50 25" />
        <path d="M50 25 L25 40 L75 40 Z" fill="#810100" fillOpacity="0.2" />
        {/* Stacked folded shirts */}
        <rect x="20" y="48" width="60" height="12" rx="4" fill="currentColor" fillOpacity="0.15" />
        <rect x="22" y="62" width="56" height="12" rx="4" fill="currentColor" fillOpacity="0.25" />
        <rect
          x="18"
          y="76"
          width="64"
          height="12"
          rx="4"
          fill="#810100"
          fillOpacity="0.4"
          stroke="#EDEBDE"
        />
        {/* Fold lines */}
        <line x1="35" y1="54" x2="65" y2="54" />
        <line x1="35" y1="68" x2="65" y2="68" />
        <line x1="35" y1="82" x2="65" y2="82" />
      </svg>
    ),
  },
  {
    id: "leave_phone",
    title: "تحدي ترك الهاتف (قطع الاتصال)",
    description: "ضع الهاتف في غرفة أخرى تماماً واخرج فوراً.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Prohibited red circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="#810100"
          strokeWidth="5"
          fill="#810100"
          fillOpacity="0.15"
        />
        {/* Phone silhouette inside */}
        <rect
          x="36"
          y="28"
          width="28"
          height="44"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <line x1="46" y1="32" x2="54" y2="32" />
        <circle cx="50" cy="66" r="1.5" fill="currentColor" />
        {/* Diagonal slash overlay */}
        <line
          x1="22"
          y1="22"
          x2="78"
          y2="78"
          stroke="#810100"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="22"
          x2="78"
          y2="78"
          stroke="#EDEBDE"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    id: "family_sitting",
    title: "تحدي الجلوس مع العائلة",
    description: "اترك الغرفة واخرج للجلوس مع أهلك أو الحديث معهم.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Protective warm ring */}
        <circle
          cx="50"
          cy="52"
          r="38"
          stroke="#810100"
          strokeWidth="2.5"
          strokeDasharray="4 4"
          fill="#810100"
          fillOpacity="0.1"
        />
        {/* Central parent avatar */}
        <circle cx="50" cy="38" r="8" fill="currentColor" fillOpacity="0.3" />
        <path d="M36 58 C36 48 64 48 64 58" />
        {/* Left avatar */}
        <circle cx="30" cy="44" r="6" />
        <path d="M18 64 C18 55 42 55 42 64" />
        {/* Right avatar */}
        <circle cx="70" cy="44" r="6" />
        <path d="M58 64 C58 55 82 55 82 64" />
      </svg>
    ),
  },
  {
    id: "pushups",
    title: "تحدي تمارين الضغط",
    description: "قم وأدِّ 15 تكراراً من تمرين الضغط (Push-ups) بأقصى سرعة.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Floor line */}
        <line x1="10" y1="80" x2="90" y2="80" stroke="#810100" strokeWidth="3" />
        {/* Plank/Pushup figure */}
        <circle cx="22" cy="48" r="6" fill="currentColor" />
        <path d="M26 52 L58 58 L82 78" strokeWidth="3.5" />
        {/* Arms bent in pushup */}
        <path d="M38 55 L38 78" strokeWidth="3" />
        <path d="M46 56 L48 78" strokeWidth="3" />
        {/* Upward movement arrows */}
        <path d="M30 36 L30 22 M25 27 L30 22 L35 27" stroke="#810100" strokeWidth="3" />
        <path d="M50 36 L50 22 M45 27 L50 22 L55 27" stroke="#810100" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: "cold_water_face",
    title: "تحدي صدمة الماء البارد",
    description: "اغسل وجهك بماء بارد جداً أو ضع قطعة ثلج على يدك.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Face profile */}
        <path d="M35 20 C45 20 52 28 52 38 C52 42 48 46 52 50 C55 53 60 52 62 56 C64 60 58 66 52 70 C46 74 38 75 30 72" />
        {/* Water splashes hitting cheeks */}
        <path
          d="M68 40 C75 35 82 42 75 50 C82 58 75 65 68 60"
          stroke="#810100"
          strokeWidth="3"
          fill="#810100"
          fillOpacity="0.2"
        />
        <path d="M58 32 Q64 30 62 24" />
        <path d="M64 62 Q72 65 68 72" />
        {/* Ice cube icon */}
        <rect
          x="15"
          y="65"
          width="20"
          height="20"
          rx="3"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="#EDEBDE"
          strokeWidth="2"
        />
        <line x1="15" y1="72" x2="35" y2="72" strokeOpacity="0.5" />
        <line x1="25" y1="65" x2="25" y2="85" strokeOpacity="0.5" />
      </svg>
    ),
  },
  {
    id: "balcony_fresh_air",
    title: "تحدي الخروج للشرفة/الشارع",
    description: "اخرج فوراً للشرفة أو الشارع وتنفس الهواء النقي.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Balcony Frame / Door */}
        <rect x="20" y="15" width="60" height="70" rx="4" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="15" x2="50" y2="85" strokeDasharray="3 3" />
        {/* Balcony Railing */}
        <rect
          x="15"
          y="60"
          width="70"
          height="25"
          fill="#810100"
          fillOpacity="0.3"
          stroke="#EDEBDE"
          strokeWidth="2"
        />
        <line x1="30" y1="60" x2="30" y2="85" />
        <line x1="42" y1="60" x2="42" y2="85" />
        <line x1="58" y1="60" x2="58" y2="85" />
        <line x1="70" y1="60" x2="70" y2="85" />
        {/* Glowing Sun above */}
        <circle cx="70" cy="30" r="8" fill="#810100" stroke="#EDEBDE" strokeWidth="2" />
        {/* Wind lines */}
        <path d="M26 30 Q36 26 44 32" stroke="#EDEBDE" strokeWidth="2" />
        <path d="M22 40 Q32 36 40 42" stroke="#EDEBDE" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "glass_water",
    title: "تحدي شرب الماء",
    description: "اشرب كأساً كاملاً من الماء البارد دفعة واحدة.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Tall glass vessel */}
        <path
          d="M30 20 L35 85 L65 85 L70 20 Z"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="3"
        />
        {/* Water fill level */}
        <path
          d="M32 40 Q50 44 68 40 L64 82 L36 82 Z"
          fill="#810100"
          fillOpacity="0.5"
          stroke="#EDEBDE"
          strokeWidth="1.5"
        />
        {/* Ice Cubes inside */}
        <rect
          x="42"
          y="48"
          width="12"
          height="12"
          rx="2"
          fill="currentColor"
          fillOpacity="0.4"
          stroke="#EDEBDE"
          strokeWidth="1.5"
        />
        <rect
          x="48"
          y="62"
          width="10"
          height="10"
          rx="2"
          fill="currentColor"
          fillOpacity="0.4"
          stroke="#EDEBDE"
          strokeWidth="1.5"
        />
        {/* Bubbles */}
        <circle cx="38" cy="55" r="2" fill="currentColor" />
        <circle cx="60" cy="50" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "walk_house",
    title: "تحدي المشي داخل البيت",
    description: "امشِ 100 خطوة في الممر مع عدّ الخطوات بصوت مرتفع.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Footprint Left */}
        <g transform="translate(28, 25) rotate(-15)">
          <ellipse
            cx="10"
            cy="20"
            rx="7"
            ry="12"
            fill="currentColor"
            fillOpacity="0.3"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle cx="6" cy="4" r="2" fill="currentColor" />
          <circle cx="10" cy="3" r="2" fill="currentColor" />
          <circle cx="14" cy="4" r="1.8" fill="currentColor" />
          <circle cx="17" cy="6" r="1.5" fill="currentColor" />
        </g>
        {/* Footprint Right */}
        <g transform="translate(52, 45) rotate(15)">
          <ellipse
            cx="10"
            cy="20"
            rx="7"
            ry="12"
            fill="#810100"
            fillOpacity="0.6"
            stroke="#EDEBDE"
            strokeWidth="2"
          />
          <circle cx="6" cy="4" r="2" fill="#EDEBDE" />
          <circle cx="10" cy="3" r="2" fill="#EDEBDE" />
          <circle cx="14" cy="4" r="1.8" fill="#EDEBDE" />
          <circle cx="17" cy="6" r="1.5" fill="#EDEBDE" />
        </g>
        {/* Step counter grid lines */}
        <line x1="15" y1="85" x2="85" y2="85" stroke="#810100" strokeWidth="3" />
        <text
          x="50"
          y="96"
          textAnchor="middle"
          fontSize="10"
          fill="#EDEBDE"
          fontWeight="bold"
          fontFamily="monospace"
        >
          100 STEPS
        </text>
      </svg>
    ),
  },
  {
    id: "plank",
    title: "تحدي تمرين الثبات (Plank)",
    description: "اثبت في وضعية البلانك لمدة 45 ثانية دون استسلام.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Floor */}
        <line x1="10" y1="80" x2="90" y2="80" stroke="#810100" strokeWidth="3" />
        {/* Rigid Forearm Plank Figure */}
        <circle cx="80" cy="52" r="6" fill="currentColor" />
        <path d="M76 56 L30 62 L15 80" strokeWidth="3.5" />
        <path d="M60 58 L60 80 L52 80" strokeWidth="3" strokeLinejoin="miter" />
        {/* Stopwatch timer SVG overlay */}
        <circle
          cx="35"
          cy="32"
          r="14"
          fill="#810100"
          fillOpacity="0.5"
          stroke="#EDEBDE"
          strokeWidth="2"
        />
        <line x1="35" y1="18" x2="35" y2="21" strokeWidth="2" />
        <line x1="35" y1="32" x2="35" y2="24" strokeWidth="2" />
        <line x1="35" y1="32" x2="41" y2="32" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "make_bed",
    title: "تحدي ترتيب السرير/المكتب",
    description: "رتب سريرك أو نظف سطح مكتبك بالكامل الآن.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bed frame */}
        <rect
          x="15"
          y="45"
          width="70"
          height="35"
          rx="4"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line x1="15" y1="65" x2="85" y2="65" stroke="#810100" strokeWidth="2" />
        <line x1="20" y1="80" x2="20" y2="90" strokeWidth="3" />
        <line x1="80" y1="80" x2="80" y2="90" strokeWidth="3" />
        {/* Smoothed Pillow */}
        <rect
          x="22"
          y="50"
          width="24"
          height="12"
          rx="3"
          fill="#810100"
          fillOpacity="0.5"
          stroke="#EDEBDE"
          strokeWidth="1.5"
        />
        {/* Sparkling clean lines */}
        <path
          d="M60 25 L64 33 L72 37 L64 41 L60 49 L56 41 L48 37 L56 33 Z"
          fill="#EDEBDE"
          stroke="none"
        />
        <path
          d="M30 20 L32 24 L36 26 L32 28 L30 32 L28 28 L24 26 L28 24 Z"
          fill="#810100"
          stroke="none"
        />
      </svg>
    ),
  },
  {
    id: "read_book",
    title: "تحدي القراءة الورقية",
    description: "افتح كتاباً ورقية واقرأ صفحة واحدة بصوت مرتفع.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Open Hardcover Book */}
        <path
          d="M50 35 C40 28 25 28 12 34 L12 78 C25 72 40 72 50 78 C60 72 75 72 88 78 L88 34 C75 28 60 28 50 35 Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <line x1="50" y1="35" x2="50" y2="78" stroke="#810100" strokeWidth="3" />
        {/* Text lines on pages */}
        <line x1="20" y1="44" x2="42" y2="44" strokeOpacity="0.5" />
        <line x1="20" y1="52" x2="42" y2="52" strokeOpacity="0.5" />
        <line x1="20" y1="60" x2="38" y2="60" strokeOpacity="0.5" />
        <line x1="58" y1="44" x2="80" y2="44" strokeOpacity="0.5" />
        <line x1="58" y1="52" x2="80" y2="52" strokeOpacity="0.5" />
        <line x1="58" y1="60" x2="76" y2="60" strokeOpacity="0.5" />
        {/* Speech soundwaves emitting above */}
        <path d="M42 18 A12 12 0 0 1 58 18" stroke="#810100" strokeWidth="2" />
        <path d="M36 12 A20 20 0 0 1 64 12" stroke="#EDEBDE" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "visual_focus",
    title: "تحدي التركيز البصري",
    description: "انظر من النافذة وسجل في عقلك 5 أشياء تراها بالخارج.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Wide Window Frame */}
        <rect
          x="18"
          y="20"
          width="64"
          height="60"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="currentColor"
          fillOpacity="0.05"
        />
        <line x1="50" y1="20" x2="50" y2="80" stroke="#810100" strokeWidth="2" />
        <line x1="18" y1="50" x2="82" y2="50" stroke="#810100" strokeWidth="2" />
        {/* Pupil / Eye looking through */}
        <path
          d="M30 50 Q50 30 70 50 Q50 70 30 50 Z"
          fill="#810100"
          fillOpacity="0.4"
          stroke="#EDEBDE"
          strokeWidth="2"
        />
        <circle cx="50" cy="50" r="7" fill="currentColor" />
        <circle cx="52" cy="48" r="2.5" fill="#1B1716" />
      </svg>
    ),
  },
  {
    id: "jumping_jacks",
    title: "تحدي القفز الرياضي",
    description: "أدِّ 20 قفزة رياضية (Jumping Jacks) لتنشيط الدورة الدموية.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Dynamic Jumping Figure */}
        <circle cx="50" cy="22" r="7" fill="currentColor" />
        <line x1="50" y1="29" x2="50" y2="58" strokeWidth="3.5" />
        {/* Arms raised up in star pose */}
        <path d="M20 28 L50 42 L80 28" strokeWidth="3.5" />
        {/* Legs spread wide in star pose */}
        <path d="M22 82 L50 58 L78 82" strokeWidth="3.5" />
        {/* Star motion trails around */}
        <path d="M15 22 L20 28" stroke="#810100" strokeWidth="3" />
        <path d="M85 22 L80 28" stroke="#810100" strokeWidth="3" />
        <path d="M15 88 L22 82" stroke="#810100" strokeWidth="3" />
        <path d="M85 88 L78 82" stroke="#810100" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: "countdown_brain",
    title: "تحدي العد التنازلي الصعب",
    description: "عُد تنازلياً من 100 إلى 0 بطرح الرقم 7 (100، 93، 86...).",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Brain outline */}
        <path
          d="M50 25 C38 25 30 32 30 42 C24 45 22 55 26 62 C22 70 30 78 40 78 C45 78 48 76 50 74 C52 76 55 78 60 78 C70 78 78 70 74 62 C78 55 76 45 70 42 C70 32 62 25 50 25 Z"
          fill="#810100"
          fillOpacity="0.25"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Gears inside */}
        <circle cx="42" cy="48" r="6" stroke="#EDEBDE" strokeDasharray="3 2" strokeWidth="2" />
        <circle cx="58" cy="52" r="8" stroke="#810100" strokeDasharray="4 2" strokeWidth="2" />
        {/* Floating Numbers around */}
        <text x="18" y="32" fontSize="11" fill="#EDEBDE" fontWeight="bold" fontFamily="monospace">
          100
        </text>
        <text x="74" y="32" fontSize="11" fill="#EDEBDE" fontWeight="bold" fontFamily="monospace">
          93
        </text>
        <text x="14" y="70" fontSize="11" fill="#EDEBDE" fontWeight="bold" fontFamily="monospace">
          86
        </text>
        <text x="76" y="70" fontSize="11" fill="#EDEBDE" fontWeight="bold" fontFamily="monospace">
          79
        </text>
      </svg>
    ),
  },
  {
    id: "home_help",
    title: "تحدي المساعدة المنزلية",
    description: "اذهب للمطبخ واسكب عصيراً أو ساعد في عمل منزل سريع.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Tray / Bowl vector */}
        <path
          d="M20 55 C20 75 80 75 80 55 L85 45 L15 45 Z"
          fill="#810100"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Two hands holding tray */}
        <path d="M12 65 C12 55 20 50 25 55" strokeWidth="3" />
        <path d="M88 65 C88 55 80 50 75 55" strokeWidth="3" />
        {/* Steam / aroma lines rising */}
        <path d="M38 35 Q42 25 38 18" stroke="#EDEBDE" strokeWidth="2" />
        <path d="M50 35 Q54 22 50 15" stroke="#810100" strokeWidth="2" />
        <path d="M62 35 Q66 25 62 18" stroke="#EDEBDE" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "write_oath",
    title: "تحدي كتابة العهد الورقي",
    description: "احضر ورقة وقلم واكتب بيدك: (هذا الشعور مؤقت وسيختفي).",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Paper sheet */}
        <rect
          x="25"
          y="18"
          width="50"
          height="64"
          rx="4"
          fill="currentColor"
          fillOpacity="0.1"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Text lines */}
        <line x1="33" y1="30" x2="67" y2="30" strokeOpacity="0.5" />
        <line x1="33" y1="40" x2="67" y2="40" strokeOpacity="0.5" />
        <line x1="33" y1="50" x2="55" y2="50" strokeOpacity="0.5" />
        {/* Hand holding Pen */}
        <path
          d="M78 35 L52 61 L45 65 L49 58 L75 32 Z"
          fill="#810100"
          fillOpacity="0.6"
          stroke="#EDEBDE"
          strokeWidth="2"
        />
        {/* Glowing Checkmark */}
        <circle cx="40" cy="66" r="6" fill="#810100" stroke="#EDEBDE" strokeWidth="1.5" />
        <path d="M37 66 L39 68 L43 64" stroke="#EDEBDE" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "change_posture",
    title: "تحدي تغيير وضعية الجسد",
    description: "افصل الشاحن وانتقل فوراً للجلوس على كرسي خشبي.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Bed icon left */}
        <rect
          x="12"
          y="52"
          width="28"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="2"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <line x1="12" y1="70" x2="12" y2="76" strokeWidth="2" />
        <line x1="40" y1="70" x2="40" y2="76" strokeWidth="2" />
        {/* Chair icon right */}
        <path
          d="M68 35 L68 76 M68 55 L85 55 L85 76"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="square"
        />
        <line x1="68" y1="35" x2="85" y2="35" stroke="currentColor" strokeWidth="3" />
        {/* Transition Arrow between */}
        <path d="M42 45 Q52 35 62 45 M56 40 L62 45 L58 51" stroke="#810100" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: "stretch_relax",
    title: "تحدي التمدد والاسترخاء",
    description: "استلقِ على الأرض وشُد عضلاتك لـ 5 ثوانٍ ثم أطلقها.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Floor */}
        <line x1="10" y1="75" x2="90" y2="75" stroke="#810100" strokeWidth="3" />
        {/* Flat stretch figure */}
        <circle cx="20" cy="65" r="5" fill="currentColor" />
        <line x1="25" y1="67" x2="75" y2="67" strokeWidth="3.5" />
        <line x1="75" y1="67" x2="88" y2="67" strokeWidth="3" />
        <line x1="12" y1="67" x2="20" y2="67" strokeWidth="3" />
        {/* Tension/release ripple waves */}
        <path d="M30 55 Q50 42 70 55" stroke="#810100" strokeWidth="2" />
        <path d="M22 45 Q50 32 78 45" stroke="#EDEBDE" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "quick_chat",
    title: "تحدي التواصل السريع",
    description: "أرسل رسالة نصية لأحد أصدقائك أو أقاربك اسأل عنه.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Chat message bubble */}
        <path
          d="M20 25 C20 20 25 15 32 15 L68 15 C75 15 80 20 80 25 L80 55 C80 60 75 65 68 65 L40 65 L25 78 L28 65 L20 65 Z"
          fill="#810100"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        {/* Heart icon inside */}
        <path
          d="M50 48 C50 48 38 40 38 33 C38 29 41 27 45 27 C48 27 50 30 50 30 C50 30 52 27 55 27 C59 27 62 29 62 33 C62 40 50 48 50 48 Z"
          fill="#810100"
          stroke="#EDEBDE"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    id: "quick_shower",
    title: "تحدي الاستحمام السريع",
    description: "ادخل واستحم بماء فاتر/بارد لتجديد طاقتك فوراً.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Shower head */}
        <path d="M20 20 L50 20 C50 20 50 35 50 40" strokeWidth="3" />
        <path d="M35 40 L65 40" stroke="#810100" strokeWidth="4" strokeLinecap="round" />
        {/* Water streaming lines */}
        <path d="M38 48 L34 85" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M44 48 L42 88" stroke="#810100" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M50 48 L50 90" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 4" />
        <path d="M56 48 L58 88" stroke="#810100" strokeWidth="2" strokeDasharray="6 4" />
        <path d="M62 48 L66 85" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
      </svg>
    ),
  },
  {
    id: "perfume_mist",
    title: "تحدي العطر والترطيب",
    description: "اغسل يديك ورشّ قليلاً من العطر المنعش.",
    svg: (
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 text-[#EDEBDE]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Perfume bottle body */}
        <rect
          x="32"
          y="45"
          width="36"
          height="42"
          rx="6"
          fill="#810100"
          fillOpacity="0.3"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <rect
          x="42"
          y="32"
          width="16"
          height="13"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        <rect
          x="40"
          y="24"
          width="20"
          height="8"
          rx="2"
          fill="#810100"
          stroke="#EDEBDE"
          strokeWidth="2"
        />
        {/* Spray button */}
        <path d="M40 24 L28 20" stroke="currentColor" strokeWidth="2" />
        {/* Mist particles spraying out */}
        <circle cx="22" cy="18" r="2" fill="currentColor" />
        <circle cx="16" cy="24" r="1.5" fill="#810100" />
        <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        <circle cx="24" cy="10" r="1.5" fill="currentColor" />
        <path d="M30 18 Q15 15 8 20" stroke="#EDEBDE" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    ),
  },
];

export function PanicSOS({ isOpen, onClose }: PanicSOSProps) {
  const { state } = useApp();
  const isAr = state.lang === "ar";

  const [currentStage, setCurrentStage] = useState<1 | 2 | 3>(1);

  // Stage 1: Breathing 4-4-6
  const [phase, setPhase] = useState<BreathingPhase>("inhale");
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Stage 2: Dynamic Challenges
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(CHALLENGES[0]);

  // Pick random challenge ensuring it changes
  const pickRandomChallenge = () => {
    const available = CHALLENGES.filter((c) => c.id !== currentChallenge.id);
    const randomIndex = Math.floor(Math.random() * available.length);
    setCurrentChallenge(available[randomIndex] || CHALLENGES[0]);
  };

  // Reset when SOS opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStage(1);
      setPhase("inhale");
      setPhaseSecondsLeft(4);
      setCyclesCompleted(0);
      // Pick random initial challenge
      const initialIndex = Math.floor(Math.random() * CHALLENGES.length);
      setCurrentChallenge(CHALLENGES[initialIndex]);
    }
  }, [isOpen]);

  // Breathing timer logic (4-4-6)
  useEffect(() => {
    if (!isOpen || currentStage !== 1) return;

    const interval = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Switch phase when seconds reach 0
        if (phase === "inhale") {
          setPhase("hold");
          return 4;
        } else if (phase === "hold") {
          setPhase("exhale");
          return 6;
        } else {
          // Exhale finished -> increment cycle count
          setCyclesCompleted((c) => {
            const nextCycles = c + 1;
            if (nextCycles >= 3) {
              // Automatically transition to Stage 2 after 3 cycles
              setTimeout(() => setCurrentStage(2), 300);
            }
            return nextCycles;
          });
          setPhase("inhale");
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, currentStage, phase]);

  if (!isOpen) return null;

  const getPhaseTitle = () => {
    switch (phase) {
      case "inhale":
        return isAr ? "شهيق عميق (4 ثوانٍ)" : "Deep Inhale (4s)";
      case "hold":
        return isAr ? "حبس الأنفاس (4 ثوانٍ)" : "Hold Breath (4s)";
      case "exhale":
        return isAr ? "زفير بطيء (6 ثوانٍ)" : "Slow Exhale (6s)";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ touchAction: "manipulation" }}
        className="fixed inset-0 z-50 w-screen h-screen flex flex-col justify-between p-6 sm:p-10 bg-[#1B1716] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#810100]/25 via-[#1B1716] to-[#1B1716] text-[#EDEBDE] font-sans overflow-y-auto selection:bg-[#810100] selection:text-[#EDEBDE]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-[#810100] animate-ping" />
            <span className="font-bold text-xs sm:text-sm tracking-wider uppercase text-[#EDEBDE]/80">
              {isAr ? "طوارئ الإنقاذ الفوري" : "Emergency SOS Intervention"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-[#EDEBDE] transition-all hover:bg-[#810100] hover:border-[#810100]"
          >
            <span>{isAr ? "خروج / إلغاء" : "Exit / Cancel"}</span>
            <X size={16} />
          </button>
        </div>

        {/* Wizard Progress Bar Header */}
        <div className="mx-auto my-4 w-full max-w-xl shrink-0">
          <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold">
            <div
              className={`rounded-full py-2 px-3 border transition-all ${
                currentStage === 1
                  ? "bg-[#810100] text-[#EDEBDE] border-[#810100] shadow-lg shadow-[#810100]/40"
                  : "bg-white/5 text-[#EDEBDE]/40 border-white/10"
              }`}
            >
              {isAr ? "1. التأريض والتنفس" : "1. Grounding"}
            </div>
            <div
              className={`rounded-full py-2 px-3 border transition-all ${
                currentStage === 2
                  ? "bg-[#810100] text-[#EDEBDE] border-[#810100] shadow-lg shadow-[#810100]/40"
                  : "bg-white/5 text-[#EDEBDE]/40 border-white/10"
              }`}
            >
              {isAr ? "2. التحدي الحركي" : "2. Dynamic Action"}
            </div>
            <div
              className={`rounded-full py-2 px-3 border transition-all ${
                currentStage === 3
                  ? "bg-[#810100] text-[#EDEBDE] border-[#810100] shadow-lg shadow-[#810100]/40"
                  : "bg-white/5 text-[#EDEBDE]/40 border-white/10"
              }`}
            >
              {isAr ? "3. العهد والتوقيع" : "3. Pledge Oath"}
            </div>
          </div>
        </div>

        {/* Main Stage Content Container */}
        <div className="my-auto mx-auto w-full max-w-2xl flex-1 flex flex-col items-center justify-center py-4">
          <AnimatePresence mode="wait">
            {/* STAGE 1: BREATHING GROUNDING */}
            {currentStage === 1 && (
              <motion.div
                key="stage1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center text-center space-y-8 w-full"
              >
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#EDEBDE]">
                    {isAr
                      ? "خذ نفساً عميقاً مع الدائرة المضيئة.. ابقَ هادئاً"
                      : "Take a deep breath with the pulsing ring.. Stay calm"}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#EDEBDE]/60 max-w-md mx-auto">
                    {isAr
                      ? "إلغاء التفكير التلقائي وإعادة توجيه الأوكسجين إلى الدماغ لتقليل شدة الرغبة."
                      : "Interrupt automatic urges by restoring oxygen flow to the brain."}
                  </p>
                </div>

                {/* Animated Concentric Glowing Ring */}
                <div className="relative flex h-64 w-64 items-center justify-center my-4">
                  {/* Outer pulsating aura */}
                  <motion.div
                    animate={{
                      scale: phase === "inhale" ? [1, 1.4] : phase === "hold" ? 1.4 : [1.4, 1],
                      opacity:
                        phase === "inhale" ? [0.2, 0.6] : phase === "hold" ? 0.6 : [0.6, 0.2],
                    }}
                    transition={{
                      duration: phase === "inhale" ? 4 : phase === "hold" ? 4 : 6,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-[#810100] blur-2xl"
                  />

                  {/* Concentric Border Ring */}
                  <motion.div
                    animate={{
                      scale:
                        phase === "inhale" ? [0.8, 1.25] : phase === "hold" ? 1.25 : [1.25, 0.8],
                    }}
                    transition={{
                      duration: phase === "inhale" ? 4 : phase === "hold" ? 4 : 6,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full border-4 border-[#810100] bg-[#810100]/20 shadow-[0_0_50px_rgba(129,1,0,0.6)]"
                  />

                  {/* Inner Seconds & Phase Display */}
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                    <span className="text-5xl font-black font-mono text-[#EDEBDE]">
                      {phaseSecondsLeft}
                    </span>
                    <span className="text-sm font-bold text-[#EDEBDE] bg-[#810100]/60 px-4 py-1 rounded-full border border-[#810100]">
                      {getPhaseTitle()}
                    </span>
                    <span className="text-2xs text-[#EDEBDE]/60 font-mono">
                      {isAr
                        ? `الدورة ${cyclesCompleted + 1} من 3`
                        : `Cycle ${cyclesCompleted + 1} of 3`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStage(2)}
                  className="inline-flex items-center gap-3 rounded-full bg-[#810100] px-8 py-4 text-base font-bold text-[#EDEBDE] shadow-xl shadow-[#810100]/50 hover:bg-[#810100]/80 transition-all active:scale-95"
                >
                  <span>{isAr ? "جاهز للتحدي ←" : "Ready for Challenge →"}</span>
                </button>
              </motion.div>
            )}

            {/* STAGE 2: DYNAMIC VISUAL CHALLENGES */}
            {currentStage === 2 && (
              <motion.div
                key="stage2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-xl"
              >
                {/* Top Visual Icon Container */}
                <div className="w-32 h-32 md:w-40 md:h-40 mb-2 flex items-center justify-center bg-white/5 rounded-full border border-white/10 shadow-2xl relative group">
                  <div className="absolute inset-0 rounded-full bg-[#810100]/20 blur-xl group-hover:bg-[#810100]/30 transition-all" />
                  <div className="relative z-10">{currentChallenge.svg}</div>
                </div>

                {/* Middle Task Description */}
                <div className="space-y-3">
                  <span className="inline-block rounded-full bg-[#810100]/40 px-4 py-1 text-xs font-bold text-[#EDEBDE] border border-[#810100]">
                    {currentChallenge.title}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-center text-[#EDEBDE] leading-relaxed">
                    {currentChallenge.description}
                  </h2>
                </div>

                {/* Bottom Action Control Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStage(3)}
                    className="w-full flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#810100] px-8 py-4 text-base font-bold text-[#EDEBDE] shadow-xl shadow-[#810100]/50 hover:bg-[#810100]/80 transition-all active:scale-95"
                  >
                    <span>{isAr ? "نفذت التحدي بنجاح ←" : "Challenge Completed →"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={pickRandomChallenge}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold text-[#EDEBDE] hover:bg-white/10 transition-all active:scale-95"
                  >
                    <RotateCw size={16} />
                    <span>{isAr ? "تحدي آخر 🔄" : "Another Challenge 🔄"}</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: PLEDGE & SIGNATURE REMINDER */}
            {currentStage === 3 && (
              <motion.div
                key="stage3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center text-center space-y-6 w-full"
              >
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#EDEBDE]">
                    {isAr
                      ? "تذكّر العهد الذي قطعتَه على نفسك"
                      : "Remember the solemn oath you signed"}
                  </h2>
                  <p className="text-xs text-[#EDEBDE]/60">
                    {isAr
                      ? "لحظة ضعف طارئة لن تهدم كل ما بنيته."
                      : "A temporary urge cannot destroy your commitment."}
                  </p>
                </div>

                {/* Parchment Continuous Pledge Document */}
                <div className="w-full max-h-[420px] overflow-y-auto text-start rounded-2xl border border-white/10">
                  <PledgeDocument
                    reasons={state.pledgeReasons || state.damage.join("، ")}
                    impacts={state.pledgeImpacts || state.postEmotions.join("، ")}
                    goals={state.pledgeGoals || state.motivation}
                    emergencyPlan={state.pledgeEmergencyPlan}
                    nickname={state.nickname}
                    initialSignature={state.pledgeSignature}
                    readOnly={true}
                    lang={state.lang}
                  />
                </div>

                {/* Final Action Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-[#810100] py-4 px-8 text-base font-bold text-[#EDEBDE] shadow-xl shadow-[#810100]/60 hover:bg-[#810100]/80 transition-all active:scale-95"
                >
                  <CheckCircle2 size={22} />
                  <span>
                    {isAr
                      ? "تجاوزت الرغبة بنجاح.. العودة للرئيسية"
                      : "I Overcame the Urge.. Back to Home"}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Subtle Footer */}
        <div className="text-center text-2xs text-[#EDEBDE]/40 pt-2 shrink-0">
          {isAr ? "أنت أقوى من هذه الموجة المؤقتة." : "You are stronger than this temporary wave."}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
