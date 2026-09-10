import { BookMarked } from "lucide-react";
import { PageHero } from "../components/PageHero";
import { teachingTopics } from "../data/siteConfig";

export function TeachingsPage() {
  return <>
    <PageHero eyebrow="Timeless teachings" title={<>चिंतन, संवाद और <span className="text-[#ae5028]">संस्कार</span></>} copy="भक्ति, धर्म, कर्म, सेवा, परिवार और सनातन जीवन-मूल्यों पर आधारित लेख एवं विचार यहाँ प्रकाशित किए जाएँगे।" />
    <section className="section-space bg-[#fffdf8]"><div className="page-container"><div className="grid gap-4 md:grid-cols-2">{teachingTopics.map((topic) => <article key={topic.number} className="group relative overflow-hidden border border-[#d8c5a1]/65 bg-[#fffaf0] p-7 md:p-9"><span className="display absolute right-6 top-1 text-8xl font-semibold text-[#b38a42]/10">{topic.number}</span><p className="relative text-[10px] font-bold uppercase tracking-[.18em] text-[#a26a32]">{topic.en}</p><h2 className="deva-heading relative mt-3 text-4xl font-semibold text-[#481b14]">{topic.title}</h2><p className="relative mt-3 max-w-sm text-sm leading-7 text-[#755d52]">{topic.description}</p><div className="relative mt-8 flex items-center gap-2 text-[11px] font-bold text-[#91431f]"><BookMarked size={15} /> सामग्री शीघ्र जोड़ी जाएगी</div></article>)}</div><div className="mt-12 border-l-2 border-[#b85e2a] bg-[#f9f0df] p-6"><p className="text-sm leading-7 text-[#684634]">यह अनुभाग वास्तविक लेख, प्रवचन और अध्ययन सामग्री जोड़ने के लिए तैयार है। सामग्री को <code className="rounded bg-white px-1.5 py-0.5 text-xs">src/data</code> में व्यवस्थित तरीके से प्रबंधित किया जा सकता है।</p></div></div></section>
  </>;
}
