import { LocateFixed, RefreshCw, Sunrise, Sunset } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getPanchang, type Language } from "../utils/vedic";

type Props = { language: Language };
const DEFAULT_LOCATION = { latitude: 25.3176, longitude: 82.9739, label: "काशी, वाराणसी" };

export function Panchang({ language }: Props) {
  const [now, setNow] = useState(() => new Date());
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [notice, setNotice] = useState("");
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 60000); return () => window.clearInterval(timer); }, []);
  const data = useMemo(() => getPanchang(now, location.latitude, location.longitude, language), [now, location, language]);
  const dateLabel = new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-GB", { dateStyle: "full", timeZone: "Asia/Kolkata" }).format(now);
  const updateLocation = () => {
    if (!navigator.geolocation) { setNotice(language === "hi" ? "इस ब्राउज़र में स्थान सुविधा उपलब्ध नहीं है।" : "Location is not available in this browser."); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => { setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, label: language === "hi" ? "आपका स्थान" : "Your location" }); setNotice(language === "hi" ? "आपके स्थान के अनुसार पंचांग अद्यतन किया गया।" : "Panchang updated for your location."); },
      () => setNotice(language === "hi" ? "स्थान नहीं मिल पाया। काशी, वाराणसी का पंचांग दिखाया जा रहा है।" : "Location unavailable. Showing Kashi, Varanasi."),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 3600000 },
    );
  };
  const labels = language === "hi" ? { title: "आज का पंचांग", realtime: "स्थान और समय के अनुसार", useLocation: "मेरा स्थान उपयोग करें", sunrise: "सूर्योदय", sunset: "सूर्यास्त", rahu: "राहु काल", tithi: "तिथि", nakshatra: "नक्षत्र", yoga: "योग", karana: "करण", rashi: "चंद्र राशि", updated: "अद्यतन" } : { title: "Today’s Panchang", realtime: "Based on time and location", useLocation: "Use my location", sunrise: "Sunrise", sunset: "Sunset", rahu: "Rahu Kaal", tithi: "Tithi", nakshatra: "Nakshatra", yoga: "Yoga", karana: "Karana", rashi: "Moon sign", updated: "Updated" };
  return <section className="relative overflow-hidden border border-[#d8c298]/55 bg-[#fffaf0] p-5 shadow-[0_16px_44px_rgba(67,27,12,.08)] sm:p-7"><div className="absolute right-0 top-0 size-40 translate-x-14 -translate-y-14 rounded-full border border-[#b38a42]/25" /><div className="relative"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-[.16em] text-[#a65329]">{labels.realtime}</p><h2 className="deva-heading mt-1 text-3xl font-semibold text-[#431a13]">{labels.title}</h2><p className="mt-1 text-xs text-[#815d42]">{dateLabel} · {location.label}</p></div><button onClick={updateLocation} className="inline-flex items-center gap-2 border border-[#b38a42]/50 px-3 py-2 text-[11px] font-bold text-[#7d331b] hover:bg-[#fff2d5]"><LocateFixed size={14} />{labels.useLocation}</button></div>{notice ? <p className="mt-4 rounded-sm border border-[#d7c08f] bg-[#fff5da] px-3 py-2 text-xs text-[#6c4a31]">{notice}</p> : null}<div className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-[#ddcaa7] bg-[#ddcaa7] sm:grid-cols-3"><Metric label={labels.tithi} value={`${data.tithi} · ${data.paksha}`} /><Metric label={labels.nakshatra} value={data.nakshatra} /><Metric label={labels.yoga} value={data.yoga} /><Metric label={labels.karana} value={data.karana} /><Metric label={labels.rashi} value={data.moonRashi} /><Metric label={labels.rahu} value={data.rahu} /></div><div className="mt-5 grid gap-2 sm:grid-cols-2"><SmallMetric icon={Sunrise} label={labels.sunrise} value={data.sunrise} /><SmallMetric icon={Sunset} label={labels.sunset} value={data.sunset} /></div><p className="mt-5 flex items-center gap-1.5 text-[11px] text-[#8a6d5c]"><RefreshCw size={12} />{labels.updated}: {data.updated} IST · {language === "hi" ? "सूचनात्मक गणना; अनुष्ठानिक निर्णय हेतु परामर्श लें।" : "Indicative calculation; consult for ritual decisions."}</p></div></section>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="min-h-[90px] bg-[#fffdf8] px-4 py-4"><p className="text-[11px] font-bold text-[#9e774c]">{label}</p><p className="deva-heading mt-2 text-lg font-semibold leading-5 text-[#4e2018]">{value}</p></div>; }
function SmallMetric({ icon: Icon, label, value }: { icon: typeof Sunrise; label: string; value: string }) { return <div className="flex items-center gap-3 border border-[#ddcaa7] bg-[#fffdf8] px-4 py-3"><span className="grid size-8 place-items-center rounded-full bg-[#fff0ce] text-[#9b4b24]"><Icon size={16} /></span><span><b className="block text-[11px] text-[#74523c]">{label}</b><small className="block text-xs text-[#4e2018]">{value}</small></span></div>; }
