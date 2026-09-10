import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { navigation, services, siteConfig } from "../data/siteConfig";

export function Footer() {
  return <footer className="bg-[#260609] text-[#f9e6b8]"><div className="page-container py-16"><div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_.8fr_1fr]">
    <div><span className="display text-2xl font-semibold text-[#fff6e2]">{siteConfig.hindiName}</span><p className="mt-4 max-w-xs text-xs leading-6 text-[#dfc28e]">{siteConfig.hindiTagline}</p><Link to="/invite" className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#f0ca6a]">कथा हेतु संपर्क करें <ArrowUpRight size={15} /></Link></div>
    <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d7ac53]">Navigate</p><div className="mt-4 grid gap-2.5">{navigation.slice(0, 5).map((item) => <Link className="text-xs text-[#f2dca9]/85 hover:text-[#f2c85f]" key={item.to} to={item.to}>{item.label}</Link>)}</div></div>
    <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d7ac53]">सेवाएँ</p><div className="mt-4 grid gap-2.5">{services.slice(0, 4).map((service) => <Link className="text-xs text-[#f2dca9]/85 hover:text-[#f2c85f]" key={service.title} to="/contact">{service.title}</Link>)}</div></div>
    <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#d7ac53]">संपर्क</p><a href={`tel:${siteConfig.primaryPhone.replace(/\s/g, "")}`} className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#f2dca9]/85"><Phone size={14} className="mt-0.5 text-[#e5b755]" />{siteConfig.primaryPhone}<br />{siteConfig.alternatePhone}</a><p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#f2dca9]/85"><MapPin size={14} className="mt-0.5 shrink-0 text-[#e5b755]" />{siteConfig.hindiAddress}</p></div>
  </div><div className="mt-14 border-t border-[#f1ca6b]/15 pt-5 text-[10px] text-[#cbaa6e]">© {new Date().getFullYear()} {siteConfig.hindiName}. सर्वाधिकार सुरक्षित।</div></div></footer>;
}
