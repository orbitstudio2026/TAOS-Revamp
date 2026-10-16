import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { welcome } from "@/content/site";
import { LogoMark } from "@/components/ui/Ornaments";
import { EASE } from "@/lib/utils";

const KEY = "welcomePopupDismissed";
const ENDPOINT = import.meta.env.VITE_NEWSLETTER_ENDPOINT as string | undefined;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
}

/** "Stay Connected" invitation — a quiet slide-in card rather than a blocking modal. */
export function Newsletter() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  useEffect(() => {
    if (read(KEY) === "1" || pathname === "/booking") return;
    // Invite only engaged readers: after 40% of the page, or 25s of reading.
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max > 0.4) setOpen(true);
    };
    const t = setTimeout(() => setOpen(true), 25000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const dismiss = () => {
    setOpen(false);
    write(KEY, "1");
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      return;
    }
    setState("sending");
    const lead = { name: name.trim().slice(0, 100), email: email.trim().slice(0, 255), at: new Date().toISOString() };
    try {
      if (ENDPOINT) {
        await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
      }
      const prev = JSON.parse(read("welcomeLeads") || "[]");
      write("welcomeLeads", JSON.stringify([...prev, lead]));
    } finally {
      setState("done");
      setTimeout(dismiss, 2600);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="dialog"
          aria-labelledby="welcome-title"
          initial={{ opacity: 0, y: 40, clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 1, ease: EASE }}
          className="fixed bottom-4 left-4 z-[70] w-[calc(100vw-2rem)] max-w-[400px] overflow-hidden border border-ink/10 bg-paper p-5 md:p-7 shadow-[0_30px_80px_-30px_rgba(36,26,35,0.45)] md:bottom-8 md:left-8"
        >
          <button type="button" onClick={dismiss} aria-label="Close" className="absolute top-3 right-3 grid size-9 cursor-pointer place-items-center rounded-full text-taupe transition-colors hover:bg-mist hover:text-ink">
            <X className="size-4" strokeWidth={1.5} />
          </button>
          <LogoMark className="mb-3 size-8 text-plum md:mb-4 md:size-9" />
          {state === "done" ? (
            <div aria-live="polite">
              <p id="welcome-title" className="font-display text-2xl text-ink">{welcome.thanksTitle}</p>
              <p className="mt-2 text-sm text-taupe">{welcome.thanksBody}</p>
            </div>
          ) : (
            <>
              <p id="welcome-title" className="pr-6 font-display text-[0.98rem] leading-snug text-ink italic md:text-[1.08rem]">
                {welcome.intro}
              </p>
              <form onSubmit={submit} className="mt-4 space-y-3 md:mt-6 md:space-y-4" noValidate>
                <label className="block">
                  <span className="eyebrow text-taupe">{welcome.nameLabel}</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    placeholder={welcome.namePlaceholder}
                    className="mt-1 w-full border-b border-ink/20 bg-transparent py-2 text-ink outline-none placeholder:text-taupe focus:border-plum"
                  />
                </label>
                <label className="block">
                  <span className="eyebrow text-taupe">
                    {welcome.emailLabel} <span className="text-plum-deep">*</span>
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state === "error") setState("idle");
                    }}
                    maxLength={255}
                    placeholder={welcome.emailPlaceholder}
                    aria-invalid={state === "error"}
                    aria-describedby={state === "error" ? "welcome-error" : undefined}
                    className="mt-1 w-full border-b border-ink/20 bg-transparent py-2 text-ink outline-none placeholder:text-taupe focus:border-plum aria-[invalid=true]:border-[#a33a3a]"
                  />
                  {state === "error" && (
                    <span id="welcome-error" className="mt-1 block text-xs text-[#a33a3a]">
                      {welcome.invalid}
                    </span>
                  )}
                </label>
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="eyebrow w-full cursor-pointer bg-plum-deep py-3.5 md:py-4 text-ivory transition-colors duration-500 hover:bg-dusk disabled:opacity-60"
                >
                  {state === "sending" ? welcome.sending : welcome.submit}
                </button>
              </form>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
