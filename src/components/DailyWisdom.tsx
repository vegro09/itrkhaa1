import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

export interface WisdomItem {
  id: number;
  category: string;
  text: string;
  explanation: string;
}

export const wisdomData: WisdomItem[] = [
  {
    id: 1,
    category: "آية قرآنية",
    text: "إِنَّ اللَّهَ لا يُغَيِّرُ مَا بِقَوْمٍ حَتَّى يُغَيِّرُوا مَا بِأَنْفُسِهِمْ",
    explanation:
      "التغيير الحقيقي يبدأ من قرارك الداخلي. التعافي ليس شيئاً يحدث لك، بل هو استحقاق تصنعه بيدك عبر ترك العادات المدمرة واستبدالها بما يبنيك.",
  },
  {
    id: 2,
    category: "حديث شريف",
    text: "المُجَاهِدُ مَنْ جَاهَدَ نَفْسَهُ فِي طَاعَةِ اللَّهِ",
    explanation:
      "أعظم المعارك ليست التي تخوضها مع الآخرين، بل تلك التي تخوضها ضد رغباتك اللحظية وانفعالاتك. انتصارك اليوم على محفزاتك هو أعلى مراتب القوة.",
  },
  {
    id: 3,
    category: "حكمة اليوم",
    text: "التعافي ليس خطاً مستقيماً، بل هو قرار يتجدد كل صباح.",
    explanation:
      "لا تبتئس إذا شعرت بصعوبة في بعض الأيام، التذبذب طبيعي جداً في مسار إعادة ضبط الدماغ (الدوبامين). استمرارك رغم الصعوبة هو ما يصنع الفارق.",
  },
  {
    id: 4,
    category: "آية قرآنية",
    text: "وَاصْبِرْ وَمَا صَبْرُكَ إِلَّا بِاللَّهِ",
    explanation:
      "الصبر على ألم الانسحاب والمحفزات يحتاج إلى استعانة مستمرة. تذكر أن كل دقيقة تصبر فيها تعيد برمجة مساراتك العصبية نحو الاستشفاء التام.",
  },
  {
    id: 5,
    category: "حديث شريف",
    text: "احْرِصْ عَلَى مَا يَنْفَعُكَ، وَاسْتَعِنْ بِاللَّهِ وَلا تَعْجِزْ",
    explanation:
      "توجيه نبوي مباشر للتركيز على الأفعال الإيجابية (الرياضة، العمل، التعلم) بدلاً من التركيز فقط على 'عدم الانتكاس'. املأ وقتك بالنافع ولن تجد العادة مكاناً لتعود.",
  },
];

export function DailyWisdom() {
  const [isOpen, setIsOpen] = useState(false);

  // Daily rotation logic based on universal epoch date (flips at midnight)
  const today = new Date();
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const dailyIndex = daysSinceEpoch % wisdomData.length;
  const currentWisdom = wisdomData[dailyIndex] || wisdomData[0];

  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }}
      className="w-full bg-white/80 dark:bg-card/80 backdrop-blur-md border border-[#D4A373]/20 shadow-sm rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-md text-start dir-rtl select-none"
    >
      {/* Header Row: Category with subtle separator line */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold text-[#D4A373] tracking-wide">
          {currentWisdom.category}
        </span>
        <div className="h-px flex-1 bg-[#D4A373]/15" />
      </div>

      {/* Main Text: Classic Serif / Thamanya in Cherry Red */}
      <p className="font-thamanya text-lg sm:text-xl leading-relaxed text-[#810100] dark:text-[#EDEBDE]">
        {currentWisdom.text}
      </p>

      {/* Expandable Explanation Accordion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-[#D4A373]/20 pt-3">
              <p className="text-sm leading-relaxed text-[#2B2523]/80 dark:text-cotton/80 font-sans">
                {currentWisdom.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chevron indicator icon at bottom center */}
      <div className="mt-3 flex justify-center items-center">
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-[#D4A373]"
        >
          <ChevronDown size={18} strokeWidth={2} />
        </motion.div>
      </div>
    </div>
  );
}

export default DailyWisdom;
