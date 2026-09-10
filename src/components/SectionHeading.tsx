import { motion } from "framer-motion";

type Props = { eyebrow: string; title: React.ReactNode; copy?: string; centered?: boolean; light?: boolean };

export function SectionHeading({ eyebrow, title, copy, centered = false, light = false }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55 }}
      className={centered ? "mx-auto text-center" : ""}
    >
      <p className={`eyebrow ${centered ? "justify-center" : ""} ${light ? "!text-[#e6c87e]" : ""}`}>{eyebrow}</p>
      <h2 className={`deva-heading mt-4 max-w-3xl text-4xl font-semibold md:text-[3.35rem] ${centered ? "mx-auto" : ""} ${light ? "text-[#fff7e6]" : "text-[#351411]"}`}>{title}</h2>
      {copy ? <p className={`mt-5 max-w-2xl text-sm leading-7 ${centered ? "mx-auto" : ""} ${light ? "text-[#f7e5b9]" : "text-[#755d52]"}`}>{copy}</p> : null}
    </motion.div>
  );
}
