import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

type Props = { index: number; icon: LucideIcon; title: string; english: string; description: string; onEnquire: () => void };

export function ServiceCard({ index, icon: Icon, title, english, description, onEnquire }: Props) {
  return (
    <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: Math.min(index * .04, .24) }} className="group relative overflow-hidden border border-[#d8c5a1]/65 bg-[#fffdf8] p-6 transition hover:-translate-y-1 hover:shadow-[0_19px_42px_rgba(75,31,16,.10)]">
      <span className="display absolute right-5 top-3 text-6xl font-semibold text-[#b38a42]/10">0{index + 1}</span>
      <span className="relative grid size-11 place-items-center rounded-full border border-[#b38a42]/55 bg-[#fff4d6] text-[#8e431f]"><Icon size={19} strokeWidth={1.45} /></span>
      <p className="relative mt-7 text-[10px] font-bold uppercase tracking-[.14em] text-[#af7941]">{english}</p>
      <h3 className="deva-heading relative mt-2 text-[1.52rem] font-semibold text-[#4b1e16]">{title}</h3>
      <p className="relative mt-3 text-xs leading-6 text-[#795f53]">{description}</p>
      <button onClick={onEnquire} className="relative mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#9a4822] transition group-hover:gap-2.5">परामर्श लें <ArrowUpRight size={14} /></button>
    </motion.article>
  );
}
