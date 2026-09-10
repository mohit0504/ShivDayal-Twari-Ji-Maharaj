import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "../data/siteConfig";

type Props = { open: boolean; onClose: () => void };
const eventTypes = ["कथा", "सत्संग", "भजन", "आध्यात्मिक प्रवचन", "मीडिया / सहयोग", "अन्य"];

export function EnquiryModal({ open, onClose }: Props) {
  const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <AnimatePresence>{open ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center bg-[#260609]/65 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Katha enquiry">
    <motion.div initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }} className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-[#fffaf0] p-6 shadow-2xl md:p-9">
      <button onClick={() => { setSent(false); onClose(); }} className="absolute right-4 top-4 grid size-9 place-items-center text-[#6b4030]" aria-label="Close"><X size={20} /></button>
      {sent ? <div className="grid min-h-80 place-items-center text-center"><div><span className="mx-auto grid size-14 place-items-center rounded-full bg-[#edf4e8] text-[#477541]"><Check /></span><h2 className="deva-heading mt-5 text-4xl text-[#3c1913]">धन्यवाद</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#755d52]">आपकी जानकारी सुरक्षित रूप से तैयार है। आगे बढ़ने के लिए व्हाट्सऐप पर संदेश खोलें या हमारी टीम को कॉल करें।</p><a className="button button-primary mt-7" target="_blank" rel="noreferrer" href={`https://wa.me/${siteConfig.whatsapp}`}>व्हाट्सऐप पर आगे बढ़ें</a></div></div> : <><p className="eyebrow">Event enquiry</p><h2 className="deva-heading mt-4 text-4xl text-[#3c1913] md:text-5xl">कथा हेतु आमंत्रित करें</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#755d52]">अपने आयोजन का संक्षिप्त विवरण साझा करें। यह फॉर्म API/CRM से जोड़ने के लिए तैयार है।</p><form onSubmit={submit} className="mt-7 grid gap-4 sm:grid-cols-2">{[["नाम", "name", "text"], ["फोन नंबर", "phone", "tel"], ["ईमेल", "email", "email"], ["शहर", "city", "text"]].map(([label, name, type]) => <label key={name} className="grid gap-1.5 text-[11px] font-bold text-[#69402b]">{label}<input required name={name} type={type} className="h-11 border border-[#d9c8ad] bg-white px-3 text-sm font-normal outline-none focus:border-[#b85e2a]" /></label>)}<label className="grid gap-1.5 text-[11px] font-bold text-[#69402b]">आयोजन का प्रकार<select required name="eventType" className="h-11 border border-[#d9c8ad] bg-white px-3 text-sm font-normal outline-none focus:border-[#b85e2a]"><option value="">चुनें</option>{eventTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label className="grid gap-1.5 text-[11px] font-bold text-[#69402b]">पसंदीदा तिथि<input name="date" type="date" className="h-11 border border-[#d9c8ad] bg-white px-3 text-sm font-normal outline-none focus:border-[#b85e2a]" /></label><label className="sm:col-span-2 grid gap-1.5 text-[11px] font-bold text-[#69402b]">स्थान / अपेक्षित श्रोता<textarea name="message" rows={3} className="border border-[#d9c8ad] bg-white p-3 text-sm font-normal outline-none focus:border-[#b85e2a]" /></label><button className="button button-primary sm:col-span-2 mt-1" type="submit">अनुरोध भेजें</button></form></>}
    </motion.div>
  </motion.div> : null}</AnimatePresence>;
}
