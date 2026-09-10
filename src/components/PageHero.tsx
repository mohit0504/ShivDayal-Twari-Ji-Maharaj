import { motion } from "framer-motion";

export function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: React.ReactNode; copy: string }) {
  return <section className="grain relative overflow-hidden bg-[#f8efde] pb-16 pt-36 md:pb-24 md:pt-44"><div className="lotus-line absolute -right-20 -top-48 size-[540px] opacity-60" /><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }} className="page-container relative"><p className="eyebrow">{eyebrow}</p><h1 className="deva-heading mt-5 max-w-4xl text-5xl font-semibold text-[#3f1813] md:text-7xl">{title}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-[#755d52]">{copy}</p></motion.div></section>;
}
