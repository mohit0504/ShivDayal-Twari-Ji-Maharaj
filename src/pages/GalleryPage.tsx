import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { PageHero } from "../components/PageHero";
import { gallery } from "../data/gallery";

export function GalleryPage() {
  const [active, setActive] = useState<number | null>(null);
  const image = active === null ? null : gallery[active];
  const move = (step: number) => setActive((current) => current === null ? 0 : (current + step + gallery.length) % gallery.length);
  return <>
    <PageHero eyebrow="Photo gallery" title={<>स्मृतियों का <span className="text-[#ae5028]">संग्रह</span></>} copy="प्रवचन और आध्यात्मिक अवसरों के छायाचित्र। नए सत्यापित चित्र समय के साथ इस गैलरी में जोड़े जा सकते हैं।" />
    <section className="section-space bg-[#fffdf8]"><div className="page-container"><div className="mb-8 flex flex-wrap gap-2">{["सभी", "प्रवचन", "कथा", "सत्संग", "आयोजन"].map((item, index) => <button className={`border px-4 py-2 text-[11px] font-bold ${index === 0 ? "border-[#4e1016] bg-[#4e1016] text-[#fff5df]" : "border-[#d7c4a5] text-[#6b4030]"}`} key={item}>{item}</button>)}</div><div className="grid gap-5 md:grid-cols-2">{gallery.map((item, index) => <motion.button whileHover={{ y: -4 }} key={item.src} onClick={() => setActive(index)} className="group relative overflow-hidden bg-[#180808] text-left"><img src={item.src} alt={item.alt} className="h-[480px] w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]" /><span className="absolute bottom-0 left-0 bg-[#fff7e5] px-4 py-2 text-[10px] font-bold text-[#6e311c]">{item.category}</span></motion.button>)}</div></div></section>
    <AnimatePresence>{image ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-black/90 p-4"><button onClick={() => setActive(null)} className="absolute right-5 top-5 text-white" aria-label="Close image"><X /></button><button onClick={() => move(-1)} className="absolute left-4 text-white md:left-9" aria-label="Previous image"><ChevronLeft size={35} /></button><img src={image.src} alt={image.alt} className="max-h-[82vh] max-w-[78vw] object-contain" /><button onClick={() => move(1)} className="absolute right-4 text-white md:right-9" aria-label="Next image"><ChevronRight size={35} /></button><p className="absolute bottom-6 text-xs text-[#f0d58d]">{(active ?? 0) + 1} / {gallery.length}</p></motion.div> : null}</AnimatePresence>
  </>;
}
