import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { navigation, siteConfig } from "../data/siteConfig";

type Props = { onEnquire: () => void };

export function Navbar({ onEnquire }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const links = navigation.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => `text-[11px] font-bold transition ${isActive ? "text-[#b85e2a]" : "text-[#5c382d] hover:text-[#b85e2a]"}`}>{item.label}</NavLink>);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition duration-500 ${scrolled ? "border-b border-[#b38a42]/15 bg-[#fffaf1]/90 shadow-[0_7px_24px_rgba(52,18,10,.06)] backdrop-blur-xl" : "bg-[#fffaf1]/75 backdrop-blur-md"}`}>
        <div className="page-container flex h-[74px] items-center justify-between gap-6">
          <NavLink to="/" className="flex items-center gap-3 text-[#3d1512]">
            <span className="display grid size-10 place-items-center rounded-full border border-[#b38a42] text-xl font-semibold text-[#7e2e19] shadow-[inset_0_0_0_4px_rgba(179,138,66,.09)]">शि</span>
            <span><b className="display block text-base leading-none">{siteConfig.hindiName}</b><small className="mt-1 block text-[8px] font-bold uppercase tracking-[.19em] text-[#9b6530]">Kashi • Varanasi</small></span>
          </NavLink>
          <nav className="hidden items-center gap-5 lg:flex">{links}</nav>
          <div className="hidden lg:block"><button className="button button-dark !min-h-10 !px-4 !py-2.5" onClick={onEnquire}>कथा हेतु आमंत्रित करें</button></div>
          <button className="grid size-10 place-items-center border border-[#b38a42]/45 text-[#5a2017] lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
        </div>
      </header>
      <AnimatePresence>
        {open ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#4e1016] text-[#fff6e1]">
          <div className="page-container flex h-[74px] items-center justify-between"><span className="display text-lg">{siteConfig.hindiName}</span><button className="grid size-10 place-items-center border border-[#e1bc66]/45 text-[#f6d68a]" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button></div>
          <motion.nav initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .08 } } }} className="page-container mt-12 grid gap-2">
            {navigation.map((item) => <motion.div key={item.to} variants={{ hidden: { opacity: 0, x: -22 }, visible: { opacity: 1, x: 0 } }}><NavLink to={item.to} onClick={() => setOpen(false)} className="display block border-b border-[#f6d68a]/20 py-5 text-4xl font-semibold">{item.label}</NavLink></motion.div>)}
          </motion.nav>
          <div className="page-container mt-10"><button onClick={() => { setOpen(false); onEnquire(); }} className="button w-full !bg-[#efc965] !text-[#4e1016]">कथा हेतु आमंत्रित करें</button></div>
        </motion.div> : null}
      </AnimatePresence>
    </>
  );
}
