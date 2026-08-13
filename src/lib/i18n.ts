import type { Lang } from "./app-state";

type Dict = Record<string, [string, string]>; // [ar, en]

const D: Dict = {
  appName: ["اتركها", "Leave It"],
  start: ["ابدأ", "Start"],
  next: ["التالي", "Next"],
  back: ["رجوع", "Back"],
  skip: ["تخطي", "Skip"],
  finish: ["ابدأ رحلتي", "Begin my journey"],
  home: ["الرئيسية", "Home"],
  hakeem: ["حكيم", "Hakeem"],
  library: ["المكتبة", "Library"],
  profile: ["حسابي", "Profile"],

  // Landing & Auth (Page 0)
  privacyBadge: [
    "مساحتك الآمنة.. لا نطلب هويتك الحقيقية أبداً.",
    "Your safe space.. We never ask for your real identity.",
  ],
  anonAuthTitle: ["دخول بنقرة واحدة (حساب مجهول)", "One-Click Entrance (Anonymous Account)"],
  anonAuthDesc: [
    "احفظ تقدّمك باسم مستخدم ورمز PIN بسيط دون الحاجة لإدخال بريدك الإلكتروني.",
    "Save your progress with a username and simple PIN without needing an email.",
  ],
  emailAuthBtn: ["التسجيل بالبريد الإلكتروني", "Register with Email"],
  hasAccountBtn: ["لدي حساب بالفعل؟ تسجيل الدخول", "Already have an account? Log in"],
  createAnonTitle: ["إنشاء حساب مجهول", "Create Anonymous Account"],
  createAnonSub: [
    "اختر اسم مستخدم ورمز PIN للوصول لحسابك من أي جهاز بحرية وأمان.",
    "Choose a username and PIN to access your account freely and securely from any device.",
  ],
  usernameLabel: ["اسم المستخدم (مثال: hero_2026)", "Username (e.g. hero_2026)"],
  pinLabel: ["رمز PIN أو كلمة السر السريعة", "PIN Code or Fast Password"],
  createAnonSubmit: ["إنشاء الحساب والمتابعة ←", "Create Account & Continue ←"],
  createEmailTitle: ["التسجيل بالبريد الإلكتروني", "Email Registration"],
  emailLabel: ["البريد الإلكتروني", "Email Address"],
  passLabel: ["كلمة المرور", "Password"],
  loginTitle: ["تسجيل الدخول", "Account Login"],
  loginSub: [
    "أدخل بيانات حسابك المجهول (اسم المستخدم ورمز PIN) أو بريدك الإلكتروني",
    "Enter your anonymous credentials (username & PIN) or email",
  ],
  loginSubmit: ["دخول الحساب", "Log In"],

  chooseLang: ["اختر لغتك", "Choose your language"],
  welcome: ["مرحباً بك في اتركها", "Welcome to Leave It"],
  welcomeSub: ["خذ نفساً عميقاً، واقرأ هذا بتمهّل.", "Take a deep breath, and read this slowly."],
  welcomeQuote: [
    "انهض، وابدأ رحلتك نحو حياة أفضل، فكل رحلة عظيمة تبدأ بخطوة واحدة.\nأنت الآن أخذت أول خطوة، وصعدت أول درجة في طريق التغيير، وهذه بحد ذاتها بداية تستحق أن تفتخر بها.\nلا تفكر في الطريق كله، ولا تنشغل بما مضى؛ ركّز على خطوتك القادمة، وخذها بثبات.\nابدأ من اليوم، وامشِ خطوة بخطوة، حتى تصل إلى الحياة التي طالما أردت أن تعيشها.",
    "Stand up and begin your journey towards a better life, for every great journey begins with a single step.\nYou have now taken the first step and climbed the first stair on the path of change, and that in itself is a beginning to be proud of.\nDo not dwell on the whole path or obsess over the past; focus on your next step and take it with resolve.\nStart today, walk step by step, until you reach the life you have always wanted to live.",
  ],
  welcomeQuoteSrc: [
    "علم النفس السلوكي — مبدأ ركوب الموجة",
    "Behavioural psychology — urge surfing",
  ],

  // Milestone Message
  milestoneTitle: ["الخطوة الأولى في طريق التغيير", "First Step on the Path of Change"],
  milestoneMessage: [
    "اعترافك وتحديدك لمواطن التحدي هو أول انتصار حقيقي لك اليوم. لقد بدأت الفعل بدلاً من التأجيل، وهذه أول خطوة في صياغة نسختك الجديدة الخالية من العادة. مساحتك جاهزة الآن.",
    "Acknowledging and defining your challenge is your first true victory today. You have taken action instead of postponing, and this is the first step in forging your new, habit-free self. Your space is ready now.",
  ],
  milestoneAction: ["الذهاب للرئيسية ←", "Go to Dashboard ←"],

  gender: ["الجنس", "Gender"],
  male: ["ذكر", "Male"],
  female: ["أنثى", "Female"],
  age: ["كم عمرك؟", "How old are you?"],
  agePh: ["أدخل عمرك", "Enter your age"],
  targetTitle: ["ما العادة التي تريد التخلص منها؟", "Which habit do you want to break?"],
  targetOptPorn: ["مشاهدة الإباحية", "Watching Pornography"],
  targetOptMasturbation: ["العادة السرية", "Masturbation"],
  targetOptBoth: ["كلاهما (الإباحية والعادة السرية)", "Both (Pornography & Masturbation)"],

  duration: ["منذ متى وأنت تعاني منها؟", "How long has it lasted?"],
  d1: ["أقل من سنة", "Less than 1 year"],
  d2: ["١ - ٣ سنوات", "1 – 3 years"],
  d3: ["٣ - ٥ سنوات", "3 – 5 years"],
  d4: ["أكثر من ٥ سنوات", "More than 5 years"],
  freq: ["كم مرة في اليوم؟", "How many times per day?"],
  freqHint: ["كن صادقًا، لا أحد يحكم عليك.", "Be honest — no one is judging you."],
  weekly: ["أسبوعيًا", "Weekly"],
  monthly: ["شهريًا", "Monthly"],
  yearly: ["سنويًا", "Yearly"],
  shockTitle: ["هذا هو حجم الرقم", "This is the real number"],
  shockSub: ["تخيل ما يمكن استبداله بهذا الوقت.", "Imagine what this time could become."],
  triggers: ["ما الذي يحفزك؟", "What triggers you?"],
  preEmotions: ["ما تشعر به قبلها", "How you feel before"],
  postEmotions: ["ما تشعر به بعدها", "How you feel after"],
  damage: ["الأثر المتراكم", "Cumulative damage"],
  attempts: ["محاولاتك السابقة", "Previous attempts"],
  motivation: ["دافعك الأساسي", "Core motivation"],
  tasks: ["مهامك اليومية", "Your daily tasks"],
  tasksSub: ["اختر مهمتين ثابتتين، وأضف ما تشاء.", "Pick 2 locked habits, then add your own."],
  addCustom: ["أضف عادة مخصصة", "Add a custom habit"],
  add: ["إضافة", "Add"],
  nickname: ["اختر لقبك", "Choose your nickname"],
  nicknameSub: ["سيناديك حكيم به.", "Hakeem will call you by it."],
  customName: ["أو اكتب لقبًا خاصًا", "Or write your own"],
  multiHint: ["يمكنك اختيار أكثر من إجابة", "You can pick more than one"],

  streak: ["مدة تعافيك", "Your recovery streak"],
  days: ["يوم", "Days"],
  hours: ["ساعة", "Hours"],
  minutes: ["دقيقة", "Min"],
  seconds: ["ثانية", "Sec"],
  waeth: ["واعظ", "Wa'eth"],
  readMore: ["اقرأ المزيد", "Read more"],
  dailyHabits: ["عادات اليوم", "Today's habits"],
  relapse: ["لقد انتكست", "I relapsed"],
  relapseTitle: ["كلنا نتعثر.", "We all stumble."],
  relapseBody: [
    "سنخصم قلبًا واحدًا، لكن وقتك لن يعود للصفر. استمر.",
    "You'll lose one heart, but your timer keeps running. Keep going.",
  ],
  confirm: ["تأكيد", "Confirm"],
  cancel: ["إلغاء", "Cancel"],
  noLives: ["لا توجد قلوب متبقية", "No hearts left"],
  greeting: ["أهلًا", "Hello"],

  hakeemSub: ["رفيقك الهادئ", "Your calm companion"],
  typeMsg: ["اكتب رسالتك...", "Type a message..."],
  quick1: ["أشعر بمحفّز الآن", "I feel a trigger"],
  quick2: ["كدت أنتكس", "I almost relapsed"],
  quick3: ["أحتاج تذكيرًا", "I need a reminder"],
  quick4: ["لا أستطيع النوم", "I can't sleep"],
  quick5: ["أشعر بالذنب", "I feel guilty"],

  all: ["الكل", "All"],
  videos: ["مرئيات", "Videos"],
  articles: ["مقالات", "Articles"],
  books: ["كتب", "Books"],
  libSub: ["محتوى مختار بعناية لرحلتك.", "Hand-picked content for your journey."],

  calendar: ["مسار التعافي والحرية", "Recovery & Freedom Journey"],
  settings: ["الإعدادات", "Settings"],
  language: ["اللغة", "Language"],
  theme: ["المظهر", "Theme"],
  light: ["فاتح", "Light"],
  dark: ["داكن", "Dark"],
  tone: ["نبرة حكيم", "Hakeem tone"],
  empathetic: ["متعاطف", "Empathetic"],
  scientific: ["علمي", "Scientific"],
  strict: ["حازم", "Strict"],
  hakeemLength: ["طول إجابة حكيم", "Hakeem response length"],
  lengthShort: ["مختصر", "Concise"],
  lengthMedium: ["متوسط", "Balanced"],
  lengthDetailed: ["شامل", "Detailed"],
  logout: ["تسجيل الخروج", "Log out"],
  livesLeft: ["القلوب المتبقية", "Hearts left"],
  xp: ["نقاط", "XP"],
  level: ["المستوى", "Level"],
  toNextLevel: ["للمستوى التالي", "to next level"],
  addHabit: ["أضف عادة", "Add habit"],
  habitPh: ["اكتب عادة جديدة...", "Write a new habit..."],
  locked: ["ثابتة", "Locked"],
  resetTitle: ["نفدت القلوب — إعادة ضبط", "Hearts depleted — full reset"],
  resetBody: [
    "استهلكت قلوبك الثلاثة. سيعود العدّاد إلى الصفر وتبدأ دورة جديدة بثلاثة قلوب.",
    "You've used all three hearts. The timer returns to zero and a new cycle restarts with three hearts.",
  ],
  resetConfirm: ["ابدأ من جديد", "Restart"],
  perfectDay: ["يوم كامل", "Perfect day"],
  checkIn: ["سجّل حضورك اليوم", "Claim daily check-in"],
  checkedIn: ["تم تسجيل حضورك اليوم", "Checked in today"],
  checkInXp: ["+٥٠ نقطة", "+50 XP"],
  rateDay: ["كيف كان يومك؟", "How was your day?"],
  rExcellent: ["ممتاز", "Excellent"],
  rGood: ["جيد", "Good"],
  rStruggling: ["أعاني", "Struggling"],
  rRelapsed: ["انتكست", "Relapsed"],
  attemptHistory: ["سجل المحاولات", "Attempt history"],
  attemptLabel: ["محاولة", "Attempt"],
  lasted: ["استمرت", "Lasted"],
  dayUnit: ["يوم", "days"],
  noRating: ["بدون تقييم", "Not rated"],
  shockNext: ["فهمت، تابع", "I understand — continue"],

  // Onboarding Step 7 & 8 (Frequency & Session Duration)
  freqDailyLabel: ["عدد المرات يومياً", "Times per day"],
  freqTimeLabel: ["مدة المرة الواحدة (بالدقائق)", "Session duration (minutes)"],
  sessionDurationTitle: [
    "كم الوقت الذي تستغرقه في المرة الواحدة؟",
    "How much time does each session take?",
  ],
  sessionDurationHint: [
    "حدد أو أدخل متوسط الوقت بالدقائق.",
    "Select or enter the average duration in minutes.",
  ],

  // Pledge Document
  pledgeTitle: ["العهد", "The Pledge"],
  pledgeSub: [
    "وقع بأصبعك على العهد لتوثيق انطلاقتك نحو الحرية.",
    "Sign the pledge with your finger to document your leap toward freedom.",
  ],
  pledgeDefaultReasons: [
    "استعادة حريتي وكرامتي وصحتي",
    "Regaining my freedom, dignity, and health",
  ],
  pledgeDefaultImpacts: [
    "الندم والإنهاك وضياع الوقت",
    "Regret, physical exhaustion, and lost time",
  ],
  pledgeDefaultGoals: [
    "الوصول لحياة أفضل وبناء مستقبل مشرق",
    "Reaching a better life and building a bright future",
  ],
  pledgeDefaultEmergency: [
    "الوضوء، التغيير الفوري للمكان، واستخدام زر الفزعة",
    "Cold water/wudu, changing location immediately, and using the SOS button",
  ],

  // Time Loss Calculator (Shock Modal)
  timeLossTitle: ["حقيقة الأرقام والوقت المهدور", "The Reality of Numbers and Wasted Time"],
  timeLossYearlyLabel: ["الساعات الضائعة سنوياً", "Hours wasted per year"],
  timeLossYearlyUnit: ["ساعة/سنة", "hours/year"],
  timeLossFutureHeader: ["توقع المستقبل حتى سن 80", "Future Projection Until Age 80"],
  timeLossFutureBodyPrefix: [
    "إذا استمررت بنفس المعدل حتى سن الـ 80، ستضيع",
    "If you continue at the same rate until age 80, you will lose",
  ],
  timeLossFutureNetYears: ["سنوات كاملة صافية", "full net years"],
  timeLossFutureBodySuffix: [
    "من باقي عمرك أمام الشاشات والممارسة.",
    "of your remaining life in front of screens and practicing.",
  ],
  timeLossButton: ["استوعبت ذلك.. لنبدأ التغيير", "I understand.. Let's start changing"],

  // Oath Check-In Modal
  oathButtonLabel: ["القسم والحضور اليومي", "Oath & Daily Check-in"],
  oathTitle: ["قسم الصمود اليومي", "Daily Resilience Oath"],
  oathSub: ["العهد الصارم لثباتك اليوم", "Your strict pledge for staying steadfast today"],
  oathText: [
    "«أقر وأقسم بالله العظيم أنني صمدت اليوم ولم أمارس العادة السرية أو أراقب المحرمات»",
    "“I solemnly pledge that I stood firm today and did not practice masturbation or look at prohibited content.”",
  ],
  oathCheckbox: [
    "أؤكد قسمي الصادق بالله العظيم وأتحمل مسئولية كلمتي.",
    "I confirm my honest pledge and take full responsibility for my word.",
  ],
  oathConfirm: ["تأكيد الحضور (+50 XP)", "Confirm Check-in (+50 XP)"],

  // Emergency SOS Modal & Multi-Step Wizard
  sosButton: ["زر الفزعة", "Emergency SOS"],
  sosTitle: ["زر الفزعة (طوارئ الإنقاذ الفوري)", "Emergency SOS Wizard"],
  sosSub: [
    "توقف فوراً، اتبع هذه الخطوات الـ3 لكسر الرغبة واستعادة الوعي الكامل",
    "Stop immediately, follow these 3 steps to break the urge and regain full awareness",
  ],
  sosStep1Title: ["1. التنفس وتثبيت الوعي (4-4-6)", "1. Grounding Breathing (4-4-6)"],
  sosStep2Title: ["2. تغيير البيئة والمكان", "2. Environment Shift"],
  sosStep3Title: ["3. العهد والالتزام", "3. Commitment & Pledge"],
  sosInhale: ["شهيق عميق", "Deep Inhale"],
  sosHold: ["حبس الأنفاس", "Hold Breath"],
  sosExhale: ["زفير بطيء", "Slow Exhale"],
  sosCycle: ["دورة التنفس", "Breathing Cycle"],
  sosDirectiveTitle: [
    "غير مكانك الآن، واغسل وجهك بماء بارد",
    "Change your environment now, and wash your face with cold water",
  ],
  sosDirectiveSub: [
    "اكسر النمط التلقائي فوراً بقطع الاتصال البصري وإعادة ضبط جهازك العصبي:",
    "Break the automatic cycle immediately by severing visual focus and resetting your nervous system:",
  ],
  sosShift1: [
    "غادر الغرفة أو الفراش فوراً واذهب لمكان فيه حركة أو إضاءة.",
    "Leave the room or bed immediately and go to an open or lit area.",
  ],
  sosShift2: [
    "افتح صنبور الماء البارد واغسل وجهك ورقبتك جيداً بماء مثلج.",
    "Turn on cold water and wash your face and neck thoroughly with icy water.",
  ],
  sosShift3: [
    "اترك الهاتف أو الأجهزة الشاشة في مكان بعيد عن متناول يدك.",
    "Leave your phone or screens completely out of reach.",
  ],
  sosNextButton: ["التالي", "Next"],
  sosPrevButton: ["السابق", "Previous"],
  sosFinishButton: ["لقد تجاوزت الموجة بنجاح", "I passed the wave successfully"],
};

export const t = (key: keyof typeof D, lang: Lang) => D[key]![lang === "ar" ? 0 : 1]!;

export const useT = (lang: Lang) => (key: keyof typeof D) => t(key, lang);

export const list = (lang: Lang, ar: string[], en: string[]) => (lang === "ar" ? ar : en);
