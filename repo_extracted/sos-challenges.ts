export type ChallengeIconKey =
  | "prayer"
  | "water"
  | "pushups"
  | "phoneOff"
  | "laundry"
  | "family"
  | "walk"
  | "book"
  | "sun"
  | "clean"
  | "tea"
  | "call"
  | "stairs"
  | "write"
  | "stretch"
  | "music"
  | "wind"
  | "shower"
  | "cook"
  | "plant"
  | "sleepReset"
  | "sport";

export type Challenge = {
  id: string;
  icon: ChallengeIconKey;
  action: string;
  hint: string;
};

export const CHALLENGES: Challenge[] = [
  {
    id: "wudu",
    icon: "water",
    action: "قم وتوضأ الآن بماء بارد",
    hint: "الماء البارد يقطع موجة الرغبة خلال ثوانٍ",
  },
  {
    id: "salah",
    icon: "prayer",
    action: "صلِّ ركعتين واطلب الثبات",
    hint: "أقوى مرساة روحية وقت الضعف",
  },
  {
    id: "pushups",
    icon: "pushups",
    action: "نفّذ 15 ضغطة الآن بدون توقف",
    hint: "المجهود البدني يحرق التوتر المتراكم",
  },
  {
    id: "phone",
    icon: "phoneOff",
    action: "ضع الهاتف في غرفة أخرى تماماً واخرج فوراً",
    hint: "إبعاد الأداة يقطع الحلقة تلقائياً",
  },
  {
    id: "laundry",
    icon: "laundry",
    action: "اطوِ ملابسك المتراكمة الآن",
    hint: "مهمة يدوية بسيطة تعيد ضبط الانتباه",
  },
  {
    id: "family",
    icon: "family",
    action: "اذهب واجلس مع أحد أفراد عائلتك وتحدث معه",
    hint: "الوجود الاجتماعي يكسر العزلة المحفّزة",
  },
  {
    id: "walk",
    icon: "walk",
    action: "امشِ خارج المنزل عشر دقائق",
    hint: "تغيير المكان يغيّر الحالة الذهنية",
  },
  {
    id: "book",
    icon: "book",
    action: "اقرأ صفحتين من كتاب ورقي",
    hint: "تركيز عميق بديل عن التحفيز السريع",
  },
  {
    id: "sun",
    icon: "sun",
    action: "اخرج للشرفة وتعرّض لضوء النهار",
    hint: "الضوء يعيد ضبط الجهاز العصبي",
  },
  {
    id: "clean",
    icon: "clean",
    action: "رتّب سريرك ومكتبك بالكامل",
    hint: "النظام الخارجي ينعكس نظاماً داخلياً",
  },
  {
    id: "tea",
    icon: "tea",
    action: "حضّر كوب شاي واشربه ببطء",
    hint: "طقس بطيء يخفض سرعة الاندفاع",
  },
  {
    id: "call",
    icon: "call",
    action: "اتصل بصديق تثق به الآن",
    hint: "الصوت البشري يقطع الدائرة المغلقة",
  },
  {
    id: "stairs",
    icon: "stairs",
    action: "اصعد وانزل الدرج ثلاث مرات",
    hint: "رفع النبض ثم تهدئته يفرّغ الشحنة",
  },
  {
    id: "write",
    icon: "write",
    action: "اكتب على ورقة سبب بدئك بهذا الطريق",
    hint: "الكتابة اليدوية تفعّل التفكير الواعي",
  },
  {
    id: "stretch",
    icon: "stretch",
    action: "قم بتمارين إطالة لمدة دقيقتين",
    hint: "إرخاء العضلات يخفض إشارة التوتر",
  },
  {
    id: "music",
    icon: "music",
    action: "استمع لتلاوة هادئة مع إغماض العينين",
    hint: "مدخل سمعي هادئ بدل التحفيز البصري",
  },
  {
    id: "wind",
    icon: "wind",
    action: "افتح النافذة وخذ عشرة أنفاس عميقة",
    hint: "الهواء البارد ينبّه العصب الحائر",
  },
  {
    id: "shower",
    icon: "shower",
    action: "خذ دُشاً بارداً سريعاً",
    hint: "صدمة حرارية تُنهي الرغبة فوراً",
  },
  {
    id: "cook",
    icon: "cook",
    action: "اذهب للمطبخ وحضّر لنفسك وجبة خفيفة",
    hint: "انشغال حسي متعدد يشتت المحفّز",
  },
  {
    id: "plant",
    icon: "plant",
    action: "اسقِ النباتات أو نظّف مكاناً مهملاً",
    hint: "فعل عناية صغير يعيد الشعور بالسيطرة",
  },
  {
    id: "sleepReset",
    icon: "sleepReset",
    action: "استلقِ على ظهرك وأغمض عينيك خمس دقائق",
    hint: "الراحة الواعية أفضل من المقاومة المتوترة",
  },
  {
    id: "sport",
    icon: "sport",
    action: "ارتدِ حذاءك واخرج للجري القصير",
    hint: "الحركة السريعة تستهلك طاقة الاندفاع",
  },
];

export function pickRandomChallenge(excludeId?: string): Challenge {
  const pool = excludeId ? CHALLENGES.filter((c) => c.id !== excludeId) : CHALLENGES;
  return pool[Math.floor(Math.random() * pool.length)]!;
}
