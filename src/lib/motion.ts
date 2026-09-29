import type { Variants } from "framer-motion";

/* ── Shared viewport config ── */
export const viewportOnce = { once: true, amount: 0.15 as const };

/* ── Section header: fade up ── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ── Stagger container ── */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

/* ── Stagger child: card / list item ── */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ── Scale fade for modals / overlays ── */
export const scaleFade: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

/* ── Backdrop fade ── */
export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

/* ── Interactive element: hover + tap spring ── */
export const hoverTap = {
  whileHover: { y: -4, transition: { type: "spring" as const, stiffness: 400, damping: 25 } },
  whileTap: { scale: 0.98 },
};

/* ── Button press ── */
export const buttonPress = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
};

/* ── Card lift — subtle y + shadow boost ── */
export const cardLift = {
  whileHover: {
    y: -6,
    transition: { type: "spring" as const, stiffness: 300, damping: 20 },
  },
  whileTap: { scale: 0.98 },
};

/* ── Icon pop on parent hover — use inside motion.div with group ── */
export const iconPop = {
  whileHover: {
    scale: 1.1,
    rotate: 3,
    transition: { type: "spring" as const, stiffness: 400, damping: 15 },
  },
};

/* ── Fade-in from left (for contact info stagger) ── */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};
