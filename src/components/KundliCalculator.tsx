import { AlertCircle, CalendarDays, Clock3, Crosshair, LoaderCircle, Orbit, ShieldCheck, Sparkles, Stars } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { Language } from "../utils/vedic";

type Props = { language: Language };
type Occupant = { planet: string; degree: number; retrograde: boolean; combust: boolean; vargottama: boolean };
type KundliChart = { houses: { house: number; rashiNumber: number; occupants: Occupant[] }[] };
type PlanetRow = { planet: string; rashiNumber: number; degree: number; longitude: number; retrograde: boolean; combust: boolean; vargottama: boolean };
type KundliResult = { source: string; birth: { name: string; place: string; datetime: string }; charts: { lagna: KundliChart; chandra: KundliChart; navamsa: KundliChart }; planets: PlanetRow[] };
type ChartKey = keyof KundliResult["charts"];

const copyByLanguage = {
  hi: { label: "प्रामाणिक जन्म कुंडली", title: "अपनी विस्तृत कुंडली बनाएं", intro: "सही जन्म विवरण के आधार पर लग्न, चंद्र और नवमांश कुंडली के साथ ग्रहों की राशि और अंश देखें।", name: "नाम", place: "जन्म स्थान", placeHint: "शहर, राज्य और देश लिखें", date: "जन्म तिथि", time: "जन्म समय", timezone: "समय क्षेत्र", calculate: "विस्तृत कुंडली बनाएं", preparing: "ग्रहों की गणना हो रही है", precise: "सटीक परिणाम के लिए जन्म समय और जन्म स्थान सही भरें", private: "जन्म विवरण केवल कुंडली गणना के लिए उपयोग होता है", results: "आपकी जन्म कुंडली", generated: "प्रामाणिक गणना", lagna: "लग्न कुंडली", chandra: "चंद्र कुंडली", navamsa: "नवमांश कुंडली", positions: "ग्रह स्थिति एवं अंश", planet: "ग्रह", rashi: "राशि", degree: "अंश", status: "स्थिति", retrograde: "वक्री", combust: "अस्त", vargottama: "वर्गोत्तम", direct: "मार्गी", source: "Navamsha Astrology Engine (लाहिरी) द्वारा गणना", apiError: "कुंडली अभी नहीं बन सकी। जन्म विवरण जांचें और फिर प्रयास करें।", placeholder: "उदा. वाराणसी, उत्तर प्रदेश, भारत", chartHint: "हर भाव में उस राशि का अंक और ग्रह-अंश उसी भाव की सुरक्षित सीमा में हैं। * वक्री, ^ अस्त, ° वर्गोत्तम।" },
  en: { label: "Verified birth Kundli", title: "Generate your detailed Kundli", intro: "View Lagna, Chandra and Navamsha Kundlis, with every planet’s Rashi and degree from your precise birth details.", name: "Name", place: "Birth place", placeHint: "Enter city, state and country", date: "Birth date", time: "Birth time", timezone: "Time zone", calculate: "Generate detailed Kundli", preparing: "Calculating planetary positions", precise: "For accurate results, enter the exact birth time and birth place.", private: "Birth details are used only to calculate this Kundli.", results: "Your birth Kundli", generated: "Verified calculation", lagna: "Lagna Kundli", chandra: "Chandra Kundli", navamsa: "Navamsha Kundli", positions: "Planet positions & degrees", planet: "Planet", rashi: "Rashi", degree: "Degree", status: "Status", retrograde: "Retrograde", combust: "Combust", vargottama: "Vargottama", direct: "Direct", source: "Calculated with Navamsha Astrology Engine · Lahiri", apiError: "The Kundli could not be generated. Check your birth details and try again.", placeholder: "e.g. Varanasi, Uttar Pradesh, India", chartHint: "Every compartment shows its Rashi number and planet details inside its own safe area. * Retrograde, ^ Combust, ° Vargottama." },
} as const;

const planetShortNames: Record<Language, Record<string, string>> = {
  en: { Ascendant: "La", Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke", Uranus: "Ur", Neptune: "Ne", Pluto: "Pl" },
  hi: { Ascendant: "ल", Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के", Uranus: "यू", Neptune: "ने", Pluto: "प्ल" },
};
const planetFullNames: Record<Language, Record<string, string>> = {
  en: { Ascendant: "Ascendant", Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mercury", Jupiter: "Jupiter", Venus: "Venus", Saturn: "Saturn", Rahu: "Rahu", Ketu: "Ketu", Uranus: "Uranus", Neptune: "Neptune", Pluto: "Pluto" },
  hi: { Ascendant: "लग्न", Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "बृहस्पति", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु", Uranus: "यूरेनस", Neptune: "नेपच्यून", Pluto: "प्लूटो" },
};
const rashiNames: Record<Language, string[]> = {
  en: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  hi: ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"],
};

type HouseLayout = { house: number; centerX: number; centerY: number; narrow: boolean; safePolygon: [number, number][] };
const houseLayouts: HouseLayout[] = [
  { house: 1, centerX: 500, centerY: 250, narrow: false, safePolygon: [[500, 70], [680, 250], [500, 430], [320, 250]] },
  { house: 2, centerX: 250, centerY: 83, narrow: false, safePolygon: [[75, 25], [425, 25], [250, 200]] },
  { house: 3, centerX: 83, centerY: 250, narrow: true, safePolygon: [[31, 95], [188, 250], [31, 405]] },
  { house: 4, centerX: 250, centerY: 500, narrow: false, safePolygon: [[70, 500], [250, 320], [430, 500], [250, 680]] },
  { house: 5, centerX: 83, centerY: 750, narrow: true, safePolygon: [[31, 595], [188, 750], [31, 905]] },
  { house: 6, centerX: 250, centerY: 917, narrow: false, safePolygon: [[75, 975], [425, 975], [250, 800]] },
  { house: 7, centerX: 500, centerY: 750, narrow: false, safePolygon: [[500, 570], [680, 750], [500, 930], [320, 750]] },
  { house: 8, centerX: 750, centerY: 917, narrow: false, safePolygon: [[575, 975], [925, 975], [750, 800]] },
  { house: 9, centerX: 917, centerY: 750, narrow: true, safePolygon: [[969, 595], [969, 905], [812, 750]] },
  { house: 10, centerX: 750, centerY: 500, narrow: false, safePolygon: [[930, 500], [750, 320], [570, 500], [750, 680]] },
  { house: 11, centerX: 917, centerY: 250, narrow: true, safePolygon: [[969, 95], [969, 405], [812, 250]] },
  { house: 12, centerX: 750, centerY: 83, narrow: false, safePolygon: [[575, 25], [925, 25], [750, 200]] },
];

export function KundliCalculator({ language }: Props) {
  const [result, setResult] = useState<KundliResult | null>(null);
  const [activeChart, setActiveChart] = useState<ChartKey>("lagna");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const initialDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const copy = copyByLanguage[language];

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError(""); setResult(null);
    const form = new FormData(event.currentTarget);
    const payload = { name: String(form.get("name") || ""), place: String(form.get("place") || ""), date: String(form.get("date") || ""), time: String(form.get("time") || ""), timezone: String(form.get("timezone") || "+05:30"), language };
    try {
      const response = await fetch("/api/kundli", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json() as KundliResult & { error?: string };
      if (!response.ok || data.error) throw new Error(data.error || copy.apiError);
      setResult(data); setActiveChart("lagna");
    } catch (reason) { setError(reason instanceof Error ? reason.message : copy.apiError); }
    finally { setLoading(false); }
  };

  return <section id="kundli" className="relative overflow-hidden bg-[#2d070b] py-16 text-[#fff7e5] sm:py-24">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(190,119,42,.34),transparent_29%),radial-gradient(circle_at_91%_76%,rgba(131,32,39,.62),transparent_27%)]" />
    <div className="absolute left-[8%] top-12 text-8xl text-[#f0c86c]/10">ॐ</div><div className="absolute bottom-5 right-[7%] text-7xl text-[#f0c86c]/10">☾</div>
    <div className="page-container relative grid items-start gap-10 lg:grid-cols-[.78fr_1.22fr]">
      <div className="lg:sticky lg:top-8"><div className="inline-flex items-center gap-2 border border-[#edc66d]/35 bg-[#6d1e1e]/45 px-3 py-1.5 text-xs font-bold uppercase tracking-[.14em] text-[#f4d58a]"><Stars size={14} />{copy.label}</div><h2 className="deva-heading mt-5 max-w-xl text-4xl font-semibold leading-[1.12] sm:text-6xl">{copy.title}</h2><p className="mt-5 max-w-lg text-base leading-8 text-[#f5dfb0]">{copy.intro}</p><div className="mt-8 space-y-3 text-sm text-[#f2d99d]"><Feature icon={Crosshair} text={copy.precise} /><Feature icon={ShieldCheck} text={copy.private} /></div><div className="mt-10 hidden grid-cols-3 gap-px overflow-hidden border border-[#eac66d]/30 bg-[#eac66d]/30 sm:grid"><ChartTeaser symbol="☉" label={copy.lagna} /><ChartTeaser symbol="☾" label={copy.chandra} /><ChartTeaser symbol="⌘" label={copy.navamsa} /></div></div>
      <div className="relative border border-[#ecc96d]/45 bg-[linear-gradient(145deg,rgba(102,23,24,.96),rgba(58,8,13,.98))] p-3 shadow-[0_25px_70px_rgba(0,0,0,.32)] sm:p-8"><div className="absolute -right-px -top-px h-16 w-16 border-l border-b border-[#f0ca6c]/65" /><div className="absolute -bottom-px -left-px h-16 w-16 border-r border-t border-[#f0ca6c]/65" /><div className="relative"><div className="flex items-center justify-between gap-4 border-b border-[#edca78]/25 px-1 pb-5"><div><p className="text-sm font-bold uppercase tracking-[.14em] text-[#f3d486]">{copy.results}</p><p className="mt-1 text-base text-[#f1ddb1]">{language === "hi" ? "जन्म विवरण भरें" : "Enter birth details"}</p></div><span className="grid size-11 place-items-center rounded-full border border-[#efca72]/40 bg-[#3e0a0d] text-[#f3cc72]"><Orbit size={19} /></span></div><form onSubmit={submit} className="mt-6 grid gap-5 px-1 sm:grid-cols-2"><Label label={copy.name}><input required name="name" className="kundli-input" placeholder={copy.name} /></Label><Label label={copy.place}><input required name="place" className="kundli-input" placeholder={copy.placeholder} /><span className="text-xs font-medium normal-case text-[#e9cc95]">{copy.placeHint}</span></Label><Label label={copy.date}><span className="relative block"><CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a66b3f]" size={17} /><input required name="date" type="date" defaultValue={initialDate} className="kundli-input !pl-10" /></span></Label><Label label={copy.time}><span className="relative block"><Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a66b3f]" size={17} /><input required name="time" type="time" defaultValue="12:00" className="kundli-input !pl-10" /></span></Label><Label label={copy.timezone}><input required name="timezone" pattern="[+-][0-9]{2}:[0-9]{2}" defaultValue="+05:30" className="kundli-input" placeholder="+05:30" /></Label><button className="mt-1 inline-flex min-h-14 items-center justify-center gap-2 bg-[#efc35d] px-5 text-base font-bold text-[#4b1112] shadow-[0_12px_28px_rgba(224,164,43,.27)] transition hover:-translate-y-0.5 hover:bg-[#ffda7d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffe3a3] sm:col-span-2" type="submit" disabled={loading}>{loading ? <LoaderCircle className="animate-spin" size={18} /> : <Sparkles size={18} />}{loading ? copy.preparing : copy.calculate}</button></form>{error && <p role="alert" className="mx-1 mt-5 flex gap-2 border border-[#d88972]/55 bg-[#6b1719] p-3 text-base leading-6 text-[#ffe1d5]"><AlertCircle className="mt-0.5 shrink-0" size={17} />{error}</p>}{result ? <KundliResultView result={result} activeChart={activeChart} setActiveChart={setActiveChart} copy={copy} language={language} /> : null}</div></div>
    </div>
  </section>;
}

function Label({ label, children }: { label: string; children: React.ReactNode }) { return <label className="grid gap-2 text-sm font-bold text-[#f0d389]">{label}{children}</label>; }
function Feature({ icon: Icon, text }: { icon: typeof Crosshair; text: string }) { return <p className="flex items-start gap-2"><Icon className="mt-0.5 shrink-0 text-[#e9c468]" size={16} />{text}</p>; }
function ChartTeaser({ symbol, label }: { symbol: string; label: string }) { return <div className="bg-[#4a0e13] py-4 text-center"><b className="deva-heading block text-2xl font-normal text-[#edcc79]">{symbol}</b><span className="mt-1 block text-[11px] font-bold text-[#f5deb0]">{label}</span></div>; }

function KundliResultView({ result, activeChart, setActiveChart, copy, language }: { result: KundliResult; activeChart: ChartKey; setActiveChart: (key: ChartKey) => void; copy: typeof copyByLanguage.hi | typeof copyByLanguage.en; language: Language }) {
  const options: { key: ChartKey; label: string }[] = [{ key: "lagna", label: copy.lagna }, { key: "chandra", label: copy.chandra }, { key: "navamsa", label: copy.navamsa }];
  const chartTitle = options.find((option) => option.key === activeChart)?.label || copy.lagna;
  return <div className="mt-8 border-t border-[#efcc78]/25 px-1 pt-6"><div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between"><p className="text-sm font-bold uppercase tracking-[.14em] text-[#f1ce7a]">{copy.generated}</p><span className="inline-flex break-words text-xs font-bold leading-5 text-[#f0d695] sm:text-sm"><ShieldCheck className="mr-1.5 mt-0.5 shrink-0" size={16} />{result.source}</span></div><p className="mt-2 text-base leading-6 text-[#f5dfb2]">{result.birth.name} · {result.birth.place}</p><div className="mt-5 grid gap-2 min-[430px]:grid-cols-3">{options.map((option) => <button key={option.key} onClick={() => setActiveChart(option.key)} className={`min-h-12 border px-3 text-base font-bold transition ${activeChart === option.key ? "border-[#efc668] bg-[#efc668] text-[#4d1013]" : "border-[#efc668]/40 text-[#f7dfab] hover:bg-[#7a211f]"}`}>{option.label}</button>)}</div><NorthIndianKundliChart chart={result.charts[activeChart]} title={chartTitle} language={language} hint={copy.chartHint} /><PlanetPositions rows={result.planets} copy={copy} language={language} /></div>;
}

type ChartTextItem = { text: string; fill: string };
type ChartTextRow = { items: ChartTextItem[]; desiredFont: number; weight: number; fontSize: number; y: number; itemWidth: number };

function NorthIndianKundliChart({ chart, title, language, hint }: { chart: KundliChart; title: string; language: Language; hint: string }) {
  return <div className="mt-6"><p className="text-base font-bold text-[#f9e4b4]">{title}</p><div className="mt-3 overflow-hidden border border-[#e5be62] bg-[#fff7df] p-1 shadow-[0_10px_25px_rgba(0,0,0,.16)] sm:max-w-2xl sm:p-2"><svg className="block h-auto w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" role="img" aria-label={title}><defs>{houseLayouts.map((layout) => <clipPath key={layout.house} id={`kundli-safe-house-${layout.house}`}><polygon points={polygonPoints(layout.safePolygon)} /></clipPath>)}</defs><rect x="3" y="3" width="994" height="994" fill="#fff7df" stroke="#bd5a29" strokeWidth="6" /><path d="M0 0 1000 1000M1000 0 0 1000M500 0 1000 500 500 1000 0 500Z" fill="none" stroke="#bd5a29" strokeWidth="5" strokeLinejoin="round" />{houseLayouts.map((layout) => { const house = chart.houses.find((entry) => entry.house === layout.house); const rows = fitHouseText(layout, house, language); return <g key={layout.house} clipPath={`url(#kundli-safe-house-${layout.house})`} textAnchor="middle">{rows.map((row, rowIndex) => row.items.map((item, itemIndex) => { const columnGap = 14; const offset = row.items.length === 1 ? 0 : (itemIndex - (row.items.length - 1) / 2) * (row.itemWidth + columnGap); const estimatedWidth = measureText(item.text, row.fontSize); return <text key={`${rowIndex}-${item.text}`} x={layout.centerX + offset} y={row.y} fill={item.fill} fontSize={row.fontSize} fontWeight={row.weight} textLength={estimatedWidth > row.itemWidth ? row.itemWidth : undefined} lengthAdjust="spacingAndGlyphs">{item.text}</text>; }))}</g>; })}</svg></div><ChartLegend copy={copyByLanguage[language]} /><p className="mt-3 text-sm leading-6 text-[#ead2a0]">{hint}</p></div>;
}

function fitHouseText(layout: HouseLayout, house: KundliChart["houses"][number] | undefined, language: Language) {
  const occupants = house?.occupants || [];
  const twoColumns = !layout.narrow && occupants.length > 3;
  const detailRows: ChartTextItem[][] = [];
  for (let index = 0; index < occupants.length; index += twoColumns ? 2 : 1) detailRows.push(occupants.slice(index, index + (twoColumns ? 2 : 1)).map((planet) => ({ text: `${planetMark(planet, language)} ${dms(planet.degree, language)}`, fill: planetColor(planet.planet) })));
  const size = layout.narrow ? { rashi: 38, planet: 27 } : { rashi: 44, planet: 31 };
  const rows: ChartTextRow[] = [{ items: [{ text: localizedNumber(house?.rashiNumber || "", language), fill: "#a44922" }], desiredFont: size.rashi, weight: 800, fontSize: size.rashi, y: 0, itemWidth: 0 }, ...detailRows.map((items) => ({ items, desiredFont: size.planet, weight: 750, fontSize: size.planet, y: 0, itemWidth: 0 }))];
  const [minY, maxY] = verticalBounds(layout.safePolygon); const safeHeight = Math.max(42, 2 * Math.min(layout.centerY - minY - 8, maxY - layout.centerY - 8)); const initialHeight = rows.reduce((total, row) => total + row.fontSize * 1.18, 0); const heightScale = Math.min(1, safeHeight / initialHeight); rows.forEach((row) => { row.fontSize *= heightScale; });
  placeRows(rows, layout.centerY);
  for (let pass = 0; pass < 2; pass += 1) { rows.forEach((row) => { const available = rowWidthAt(layout.safePolygon, row.y, row.fontSize); const widthPerItem = Math.max(24, (available - (row.items.length - 1) * 14) / row.items.length); const fitted = Math.min(row.fontSize, ...row.items.map((item) => fontThatFits(item.text, row.fontSize, widthPerItem))); row.fontSize = fitted; row.itemWidth = widthPerItem; }); placeRows(rows, layout.centerY); }
  return rows;
}

function placeRows(rows: ChartTextRow[], centerY: number) { const totalHeight = rows.reduce((total, row) => total + row.fontSize * 1.18, 0); let cursor = centerY - totalHeight / 2; rows.forEach((row) => { row.y = cursor + row.fontSize * 0.8; cursor += row.fontSize * 1.18; }); }
function rowWidthAt(polygon: [number, number][], baseline: number, fontSize: number) { const samples = [baseline - fontSize * 0.78, baseline + fontSize * 0.22]; const widths = samples.map((y) => { const [min, max] = horizontalBounds(polygon, y); return Math.max(0, max - min); }); return Math.max(28, Math.min(...widths) - 16); }
function horizontalBounds(polygon: [number, number][], y: number) { const minY = Math.min(...polygon.map((point) => point[1])); const maxY = Math.max(...polygon.map((point) => point[1])); const clampedY = Math.max(minY + 0.1, Math.min(maxY - 0.1, y)); const intersections: number[] = []; polygon.forEach((point, index) => { const next = polygon[(index + 1) % polygon.length]; if (point[1] === next[1]) { if (Math.abs(clampedY - point[1]) < 1) intersections.push(point[0], next[0]); return; } if (clampedY >= Math.min(point[1], next[1]) && clampedY <= Math.max(point[1], next[1])) intersections.push(point[0] + ((clampedY - point[1]) * (next[0] - point[0])) / (next[1] - point[1])); }); return [Math.min(...intersections), Math.max(...intersections)]; }
function verticalBounds(polygon: [number, number][]) { return [Math.min(...polygon.map((point) => point[1])), Math.max(...polygon.map((point) => point[1]))]; }
function polygonPoints(points: [number, number][]) { return points.map(([x, y]) => `${x},${y}`).join(" "); }
function measureText(text: string, fontSize: number) { return Array.from(text).reduce((width, character) => width + fontSize * (/\s/.test(character) ? 0.32 : /[ilI1]/.test(character) ? 0.33 : character.charCodeAt(0) > 127 ? 0.67 : 0.58), 0); }
function fontThatFits(text: string, preferred: number, maxWidth: number) { const measured = measureText(text, preferred); return measured <= maxWidth ? preferred : Math.max(9, preferred * (maxWidth / measured)); }
function ChartLegend({ copy }: { copy: typeof copyByLanguage.hi | typeof copyByLanguage.en }) { return <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-[#f0d695]"><span>* {copy.retrograde}</span><span>^ {copy.combust}</span><span>° {copy.vargottama}</span></div>; }
function PlanetPositions({ rows, copy, language }: { rows: KundliResult["planets"]; copy: typeof copyByLanguage.hi | typeof copyByLanguage.en; language: Language }) { return <div className="mt-8"><p className="text-sm font-bold uppercase tracking-[.14em] text-[#f1ce7a]">{copy.positions}</p><div className="mt-3 overflow-x-auto border border-[#e6c675]/35"><table className="w-full min-w-[540px] text-left text-sm"><thead className="bg-[#4a0e13] text-[#f2d18a]"><tr><th className="px-4 py-3.5">{copy.planet}</th><th className="px-4 py-3.5">{copy.rashi}</th><th className="px-4 py-3.5">{copy.degree}</th><th className="px-4 py-3.5">{copy.status}</th></tr></thead><tbody>{rows.map((planet) => <tr key={planet.planet} className="border-t border-[#e6c675]/20 text-[#fff0d0]"><td className="px-4 py-3.5 font-bold">{planetFullNames[language][planet.planet] || planet.planet}</td><td className="px-4 py-3.5">{rashiNames[language][planet.rashiNumber - 1] || ""} <span className="font-bold text-[#f1ce7a]">({localizedNumber(planet.rashiNumber, language)})</span></td><td className="px-4 py-3.5">{dms(planet.degree, language)}</td><td className="px-4 py-3.5">{planetStatus(planet, copy)}</td></tr>)}</tbody></table></div></div>; }
function localizedNumber(value: number | string, language: Language) { const text = String(value); return language === "hi" ? text.replace(/\d/g, (digit) => "०१२३४५६७८९"[Number(digit)]) : text; }
function planetMark(planet: Occupant, language: Language) { return `${planetShortNames[language][planet.planet] || planet.planet}${planet.retrograde ? "*" : ""}${planet.combust ? "^" : ""}${planet.vargottama ? "°" : ""}`; }
function planetColor(planet: string) { return ({ Ascendant: "#3b2b28", Sun: "#c93f32", Moon: "#6576a5", Mars: "#c23f36", Mercury: "#417552", Jupiter: "#75489e", Venus: "#2d7f85", Saturn: "#425a88", Rahu: "#8b3a71", Ketu: "#9d5a26", Uranus: "#567093", Neptune: "#376f92", Pluto: "#815747" } as Record<string, string>)[planet] || "#71331f"; }
function planetStatus(planet: PlanetRow, copy: typeof copyByLanguage.hi | typeof copyByLanguage.en) { const statuses = [planet.retrograde ? `* ${copy.retrograde}` : "", planet.combust ? `^ ${copy.combust}` : "", planet.vargottama ? `° ${copy.vargottama}` : ""].filter(Boolean); return statuses.join(" · ") || copy.direct; }
function dms(value: number, language: Language) { let degrees = Math.floor(value); let minutes = Math.round((value - degrees) * 60); if (minutes === 60) { degrees += 1; minutes = 0; } return localizedNumber(`${degrees}°${String(minutes).padStart(2, "0")}′`, language); }
