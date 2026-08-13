import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Play, FileText, BookMarked } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { useT } from "@/lib/i18n";
import { libraryItems, pick, type LibItem } from "@/lib/content";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — curated recovery content | Leave It" },
      {
        name: "description",
        content: "Videos, articles and books hand-picked to support your recovery journey.",
      },
      { property: "og:title", content: "Library — curated recovery content" },
      {
        property: "og:description",
        content: "Videos, articles and books to keep you moving forward.",
      },
    ],
  }),
  component: Library,
});

const icons = { video: Play, article: FileText, book: BookMarked };

function Library() {
  const { state } = useApp();
  const tr = useT(state.lang);
  const [filter, setFilter] = useState<"all" | LibItem["type"]>("all");

  const filters = [
    ["all", tr("all")],
    ["video", tr("videos")],
    ["article", tr("articles")],
    ["book", tr("books")],
  ] as const;

  const items = libraryItems.filter((i) => filter === "all" || i.type === filter);

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-36 pt-10">
      <h1 className="font-display text-2xl font-semibold text-maroon">{tr("library")}</h1>
      <p className="mt-1 text-sm text-noir/50">{tr("libSub")}</p>

      <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
        {filters.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm transition-all ${
              filter === key
                ? "border-cherry bg-cherry text-cotton"
                : "border-noir/10 bg-card/70 text-maroon"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => {
          const Icon = icons[item.type];
          return (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bento overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <img
                  src={item.img}
                  alt={pick(item.title, state.lang)}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 end-3 flex h-9 w-9 items-center justify-center rounded-full bg-cherry text-cotton">
                  <Icon size={16} />
                </span>
              </div>
              <div className="p-5">
                <h2 className="font-display text-base leading-snug text-maroon">
                  {pick(item.title, state.lang)}
                </h2>
                <p className="mt-2 text-xs text-noir/45">{pick(item.meta, state.lang)}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </main>
  );
}
