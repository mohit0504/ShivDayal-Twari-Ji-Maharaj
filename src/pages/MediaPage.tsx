import { Headphones, type LucideIcon, Play, Youtube } from "lucide-react";
import { PageHero } from "../components/PageHero";

export function MediaPage() {
  return <>
    <PageHero eyebrow="Media library" title={<>मन को छूने वाले <span className="text-[#ae5028]">शब्द</span></>} copy="प्रवचन, कथा-अंश, भजन, ऑडियो और आध्यात्मिक संदेशों का संग्रह। सत्यापित YouTube अथवा ऑडियो लिंक मिलने पर वे यहाँ प्रकाशित किए जाएँगे।" />
    <section className="section-space bg-[#fffdf8]"><div className="page-container grid gap-6 lg:grid-cols-2"><MediaEmpty icon={Youtube} title="वीडियो प्रवचन" text="कथा, प्रवचन, भजन, लघु संदेश और साक्षात्कार के वीडियो लिंक यहाँ जोड़े जा सकते हैं।" /><MediaEmpty icon={Headphones} title="सुनें और जुड़ें" text="भजन, मंत्र, कीर्तन और प्रवचन की सत्यापित ऑडियो फ़ाइलें जोड़ने के लिए यह सेक्शन तैयार है।" /></div></section>
    <section className="bg-[#4e1016] py-16"><div className="page-container grid place-items-center text-center"><span className="grid size-14 place-items-center rounded-full border border-[#e7c568]/60 text-[#e7c568]"><Play size={21} /></span><h2 className="deva-heading mt-5 text-4xl font-semibold text-[#fff7e7]">मीडिया का पावन संग्रह</h2><p className="mt-3 max-w-lg text-sm leading-7 text-[#f3dcaa]">मनोरथ है कि प्रत्येक साझा की गई रिकॉर्डिंग सत्यापित, सम्मानजनक और प्रसंग-सहित हो।</p></div></section>
  </>;
}

function MediaEmpty({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <article className="group relative min-h-[330px] overflow-hidden bg-[#321014] p-8 text-[#fff6df]"><div className="lotus-line absolute inset-0 opacity-25" /><div className="relative"><span className="grid size-12 place-items-center rounded-full border border-[#e2bd67]/55 text-[#efcc72]"><Icon size={20} /></span><h2 className="deva-heading mt-8 text-4xl font-semibold">{title}</h2><p className="mt-4 max-w-sm text-sm leading-7 text-[#f4dfb1]">{text}</p><p className="mt-10 inline-flex items-center gap-2 text-[11px] font-bold text-[#eac76e]">सामग्री शीघ्र <span>→</span></p></div></article>;
}
