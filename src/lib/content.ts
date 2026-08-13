import type { Lang } from "./app-state";

export type Waeth = { short: [string, string]; long: [string, string]; source: [string, string] };

export const waethDeck: Waeth[] = [
  {
    short: [
      "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
      "Whoever is mindful of God, He makes a way out for them",
    ],
    long: [
      "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا • وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ. كل لحظة تمسك فيها نفسك عن العادة هي تقوى صغيرة، ومنها يفتح الله بابًا لم تكن تنتظره. لا تستهن باللحظة الواحدة؛ الطريق كله مبني من لحظات.",
      '"Whoever is mindful of God, He will make a way out for them, and provide for them from where they never expected." Every moment you hold yourself back is a small act of mindfulness — and from it a door opens you never expected. Never underestimate a single moment; the whole road is built from them.',
    ],
    source: ["سورة الطلاق ٢-٣", "Surah At-Talaq 2–3"],
  },
  {
    short: ["إِنَّ مَعَ الْعُسْرِ يُسْرًا", "Indeed, with hardship comes ease"],
    long: [
      "الرغبة موجة: ترتفع، تشتد، ثم تنكسر. متوسط عمر الموجة لا يتجاوز عشرين دقيقة. لا تحاربها بكل قوتك، فقط اجلس على الشاطئ وانتظرها حتى تمر. مع كل موجة تمر دون استجابة، يضعف الطريق العصبي القديم.",
      "Craving is a wave: it rises, peaks, then breaks. The average wave lasts under twenty minutes. Don't fight it with all your strength — sit on the shore and let it pass. Each wave you let pass weakens the old neural path.",
    ],
    source: ["سورة الشرح ٦", "Surah Ash-Sharh 6"],
  },
  {
    short: [
      "ما تركتَ شيئًا لله إلا عوّضك خيرًا منه",
      "You never leave a thing for God without being given better",
    ],
    long: [
      "التعافي ليس حرمانًا، بل استبدال. كل دقيقة كنت تنفقها في العادة يمكن أن تتحول إلى مشي، أو صفحة كتاب، أو مكالمة مع من تحب. اسأل نفسك اليوم: بماذا سأستبدلها؟",
      "Recovery is not deprivation — it is replacement. Every minute the habit used to take can become a walk, a page of a book, a call to someone you love. Ask yourself today: what will I replace it with?",
    ],
    source: ["أثر", "Prophetic tradition"],
  },
];

export type LibItem = {
  id: string;
  type: "video" | "article" | "book";
  title: [string, string];
  meta: [string, string];
  img: string;
};

export const libraryItems: LibItem[] = [
  {
    id: "1",
    type: "video",
    title: ["كيف يعيد دماغك بناء نفسه", "How your brain rewires itself"],
    meta: ["١٢ دقيقة", "12 min"],
    img: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "2",
    type: "article",
    title: ["قاعدة العشرين دقيقة", "The twenty minute rule"],
    meta: ["٦ دقائق قراءة", "6 min read"],
    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "3",
    type: "book",
    title: ["العادات الذرية", "Atomic Habits"],
    meta: ["جيمس كلير", "James Clear"],
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "4",
    type: "video",
    title: ["النوم كسلاح للتعافي", "Sleep as a recovery weapon"],
    meta: ["٩ دقائق", "9 min"],
    img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "5",
    type: "article",
    title: ["لماذا تنتكس بعد النجاح؟", "Why we relapse after success"],
    meta: ["٤ دقائق قراءة", "4 min read"],
    img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "6",
    type: "book",
    title: ["قوة الآن", "The Power of Now"],
    meta: ["إيكهارت تول", "Eckhart Tolle"],
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "7",
    type: "video",
    title: ["تنفّس أربعة-سبعة-ثمانية", "The 4-7-8 breath"],
    meta: ["٥ دقائق", "5 min"],
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=70",
  },
  {
    id: "8",
    type: "article",
    title: ["بناء بيئة خالية من المحفزات", "Designing a trigger-free space"],
    meta: ["٧ دقائق قراءة", "7 min read"],
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=70",
  },
];

export const pick = <T>(pair: [T, T], lang: Lang) => (lang === "ar" ? pair[0] : pair[1]);
