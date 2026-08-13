import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  Mail,
  KeyRound,
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  X,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { useT } from "@/lib/i18n";

export function AuthLanding({ onAuthenticate }: { onAuthenticate: () => void }) {
  const { state, set } = useApp();
  const tr = useT(state.lang);
  const lang = state.lang;
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const [modal, setModal] = useState<"anonymous" | "email" | "login" | null>(null);

  // Form states
  const [anonUsername, setAnonUsername] = useState("");
  const [anonPin, setAnonPin] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const handleCreateAnon = (e: React.FormEvent) => {
    e.preventDefault();
    const u = anonUsername.trim() || `hero_${Math.floor(1000 + Math.random() * 9000)}`;
    const p = anonPin.trim() || "1234";
    set({
      authenticated: true,
      authType: "anonymous",
      username: u,
      userPin: p,
      nickname: u,
    });
    setModal(null);
    onAuthenticate();
  };

  const handleCreateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    const u = email.split("@")[0] || "User";
    set({
      authenticated: true,
      authType: "email",
      userEmail: email.trim(),
      username: u,
      nickname: u,
    });
    setModal(null);
    onAuthenticate();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUser.trim()) return;
    set({
      authenticated: true,
      authType: loginUser.includes("@") ? "email" : "anonymous",
      username: loginUser.trim(),
      nickname: loginUser.trim(),
    });
    setModal(null);
    onAuthenticate();
  };

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-between px-5 py-12 text-foreground">
      {/* Top Branding Section */}
      <div className="flex w-full flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cherry/10 border border-cherry/20 text-cherry shadow-inner">
            <ShieldCheck size={36} strokeWidth={1.75} />
          </div>

          <h1 className="mt-5 font-thamanya text-5xl font-bold tracking-tight text-cherry">
            {tr("appName")}
          </h1>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-cherry/20 bg-cherry/10 px-4 py-2 text-xs font-semibold text-cherry shadow-sm">
            <Sparkles size={14} className="shrink-0" />
            <span>{tr("privacyBadge")}</span>
          </div>
        </motion.div>
      </div>

      {/* Main Action Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full space-y-4 my-8"
      >
        {/* Option A - Prominent One-Click Anonymous Auth */}
        <button
          type="button"
          onClick={() => setModal("anonymous")}
          className="group relative w-full overflow-hidden rounded-[28px] bg-cherry p-6 text-cotton shadow-[var(--shadow-float)] transition-all hover:bg-maroon hover:scale-[1.01] active:scale-[0.99] text-start"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold">{tr("anonAuthTitle")}</span>
                <span className="rounded-full bg-cotton/20 px-2 py-0.5 text-[10px] font-medium text-cotton">
                  {lang === "ar" ? "مُوصى به" : "Recommended"}
                </span>
              </div>
              <p className="text-xs text-cotton/80 leading-relaxed font-sans">
                {tr("anonAuthDesc")}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cotton/15 text-cotton group-hover:bg-cotton/25 transition-colors">
              <Arrow className="rtl:-scale-x-100" size={20} />
            </div>
          </div>
        </button>

        {/* Option B - Standard Email Registration */}
        <button
          type="button"
          onClick={() => setModal("email")}
          className="flex w-full items-center justify-between rounded-[24px] border border-noir/10 bg-card/80 p-5 text-maroon hover:border-cherry/40 hover:bg-card transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cherry/5 text-cherry">
              <Mail size={18} />
            </div>
            <span className="text-sm font-medium">{tr("emailAuthBtn")}</span>
          </div>
          <Arrow size={18} className="text-noir/40 rtl:-scale-x-100" />
        </button>
      </motion.div>

      {/* Existing Account Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <button
          type="button"
          onClick={() => setModal("login")}
          className="text-xs font-medium text-noir/60 hover:text-cherry underline underline-offset-4 transition-colors"
        >
          {tr("hasAccountBtn")}
        </button>
      </motion.div>

      {/* Auth Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-[32px] border border-noir/10 bg-card p-7 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setModal(null)}
                className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-noir/5 text-noir/60 hover:bg-noir/10 transition-colors"
              >
                <X size={16} />
              </button>

              {modal === "anonymous" && (
                <form onSubmit={handleCreateAnon} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="font-display text-xl font-bold text-maroon">
                      {tr("createAnonTitle")}
                    </h2>
                    <p className="text-xs text-noir/50 leading-relaxed font-sans">
                      {tr("createAnonSub")}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-noir/60 flex items-center gap-1.5">
                        <User size={14} className="text-cherry" />
                        {tr("usernameLabel")}
                      </label>
                      <input
                        type="text"
                        value={anonUsername}
                        onChange={(e) => setAnonUsername(e.target.value)}
                        placeholder="hero_2026"
                        required
                        className="w-full rounded-2xl border border-noir/10 bg-background px-4 py-3.5 text-sm text-maroon outline-none focus:border-cherry"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-noir/60 flex items-center gap-1.5">
                        <KeyRound size={14} className="text-cherry" />
                        {tr("pinLabel")}
                      </label>
                      <input
                        type="password"
                        value={anonPin}
                        onChange={(e) => setAnonPin(e.target.value)}
                        placeholder="••••"
                        required
                        className="w-full rounded-2xl border border-noir/10 bg-background px-4 py-3.5 text-sm text-maroon outline-none focus:border-cherry"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-cherry py-4 text-sm font-semibold text-cotton shadow-[var(--shadow-float)] transition-all hover:bg-maroon"
                  >
                    {tr("createAnonSubmit")}
                  </button>
                </form>
              )}

              {modal === "email" && (
                <form onSubmit={handleCreateEmail} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="font-display text-xl font-bold text-maroon">
                      {tr("createEmailTitle")}
                    </h2>
                    <p className="text-xs text-noir/50 leading-relaxed">
                      {lang === "ar"
                        ? "أدخل بريدك الإلكتروني وكلمة المرور للبدء."
                        : "Enter your email and password to begin."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-noir/60 flex items-center gap-1.5">
                        <Mail size={14} className="text-cherry" />
                        {tr("emailLabel")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full rounded-2xl border border-noir/10 bg-background px-4 py-3.5 text-sm text-maroon outline-none focus:border-cherry"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-noir/60 flex items-center gap-1.5">
                        <Lock size={14} className="text-cherry" />
                        {tr("passLabel")}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-2xl border border-noir/10 bg-background px-4 py-3.5 text-sm text-maroon outline-none focus:border-cherry"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-cherry py-4 text-sm font-semibold text-cotton shadow-[var(--shadow-float)] transition-all hover:bg-maroon"
                  >
                    {tr("createAnonSubmit")}
                  </button>
                </form>
              )}

              {modal === "login" && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="font-display text-xl font-bold text-maroon">
                      {tr("loginTitle")}
                    </h2>
                    <p className="text-xs text-noir/50 leading-relaxed">{tr("loginSub")}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-noir/60">
                        {lang === "ar" ? "اسم المستخدم / البريد الإلكتروني" : "Username or Email"}
                      </label>
                      <input
                        type="text"
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        placeholder="hero_2026 or name@example.com"
                        required
                        className="w-full rounded-2xl border border-noir/10 bg-background px-4 py-3.5 text-sm text-maroon outline-none focus:border-cherry"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-noir/60">
                        {lang === "ar" ? "رمز PIN / كلمة المرور" : "PIN / Password"}
                      </label>
                      <input
                        type="password"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="••••"
                        required
                        className="w-full rounded-2xl border border-noir/10 bg-background px-4 py-3.5 text-sm text-maroon outline-none focus:border-cherry"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-cherry py-4 text-sm font-semibold text-cotton shadow-[var(--shadow-float)] transition-all hover:bg-maroon"
                  >
                    {tr("loginSubmit")}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
