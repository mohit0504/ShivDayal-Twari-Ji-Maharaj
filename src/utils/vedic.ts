export type Language = "hi" | "en";

const rashis = [
  ["मेष", "Aries"], ["वृषभ", "Taurus"], ["मिथुन", "Gemini"], ["कर्क", "Cancer"],
  ["सिंह", "Leo"], ["कन्या", "Virgo"], ["तुला", "Libra"], ["वृश्चिक", "Scorpio"],
  ["धनु", "Sagittarius"], ["मकर", "Capricorn"], ["कुंभ", "Aquarius"], ["मीन", "Pisces"],
];
const nakshatras = [
  ["अश्विनी", "Ashwini"], ["भरणी", "Bharani"], ["कृत्तिका", "Krittika"], ["रोहिणी", "Rohini"], ["मृगशिरा", "Mrigashira"], ["आर्द्रा", "Ardra"], ["पुनर्वसु", "Punarvasu"], ["पुष्य", "Pushya"], ["आश्लेषा", "Ashlesha"], ["मघा", "Magha"], ["पूर्वाफाल्गुनी", "Purva Phalguni"], ["उत्तराफाल्गुनी", "Uttara Phalguni"], ["हस्त", "Hasta"], ["चित्रा", "Chitra"], ["स्वाती", "Swati"], ["विशाखा", "Vishakha"], ["अनुराधा", "Anuradha"], ["ज्येष्ठा", "Jyeshtha"], ["मूल", "Mula"], ["पूर्वाषाढ़ा", "Purva Ashadha"], ["उत्तराषाढ़ा", "Uttara Ashadha"], ["श्रवण", "Shravana"], ["धनिष्ठा", "Dhanishta"], ["शतभिषा", "Shatabhisha"], ["पूर्वाभाद्रपद", "Purva Bhadrapada"], ["उत्तराभाद्रपद", "Uttara Bhadrapada"], ["रेवती", "Revati"],
];
const tithis = [
  ["प्रतिपदा", "Pratipada"], ["द्वितीया", "Dwitiya"], ["तृतीया", "Tritiya"], ["चतुर्थी", "Chaturthi"], ["पंचमी", "Panchami"], ["षष्ठी", "Shashthi"], ["सप्तमी", "Saptami"], ["अष्टमी", "Ashtami"], ["नवमी", "Navami"], ["दशमी", "Dashami"], ["एकादशी", "Ekadashi"], ["द्वादशी", "Dwadashi"], ["त्रयोदशी", "Trayodashi"], ["चतुर्दशी", "Chaturdashi"], ["पूर्णिमा", "Purnima"], ["प्रतिपदा", "Pratipada"], ["द्वितीया", "Dwitiya"], ["तृतीया", "Tritiya"], ["चतुर्थी", "Chaturthi"], ["पंचमी", "Panchami"], ["षष्ठी", "Shashthi"], ["सप्तमी", "Saptami"], ["अष्टमी", "Ashtami"], ["नवमी", "Navami"], ["दशमी", "Dashami"], ["एकादशी", "Ekadashi"], ["द्वादशी", "Dwadashi"], ["त्रयोदशी", "Trayodashi"], ["चतुर्दशी", "Chaturdashi"], ["अमावस्या", "Amavasya"],
];
const yogas = [
  ["विष्कम्भ", "Vishkambha"], ["प्रीति", "Priti"], ["आयुष्मान", "Ayushman"], ["सौभाग्य", "Saubhagya"], ["शोभन", "Shobhana"], ["अतिगण्ड", "Atiganda"], ["सुकर्मा", "Sukarma"], ["धृति", "Dhriti"], ["शूल", "Shoola"], ["गण्ड", "Ganda"], ["वृद्धि", "Vriddhi"], ["ध्रुव", "Dhruva"], ["व्याघात", "Vyaghata"], ["हर्षण", "Harshana"], ["वज्र", "Vajra"], ["सिद्धि", "Siddhi"], ["व्यतीपात", "Vyatipata"], ["वरीयान", "Variyana"], ["परिघ", "Parigha"], ["शिव", "Shiva"], ["सिद्ध", "Siddha"], ["साध्य", "Sadhya"], ["शुभ", "Shubha"], ["शुक्ल", "Shukla"], ["ब्रह्म", "Brahma"], ["इन्द्र", "Indra"], ["वैधृति", "Vaidhriti"],
];
const karanas = [["किंस्तुघ्न", "Kimstughna"], ["बव", "Bava"], ["बालव", "Balava"], ["कौलव", "Kaulava"], ["तैतिल", "Taitila"], ["गर", "Gara"], ["वणिज", "Vanija"], ["विष्टि", "Vishti"], ["शकुनि", "Shakuni"], ["चतुष्पद", "Chatushpada"], ["नाग", "Naga"]];

const deg = Math.PI / 180;
const norm = (value: number) => ((value % 360) + 360) % 360;
const sin = (value: number) => Math.sin(value * deg);
const cos = (value: number) => Math.cos(value * deg);

export function julianDate(date: Date) { return date.getTime() / 86400000 + 2440587.5; }
function sunLongitude(date: Date) {
  const d = julianDate(date) - 2451545;
  const l = norm(280.46 + .9856474 * d);
  const g = norm(357.528 + .9856003 * d);
  return norm(l + 1.915 * sin(g) + .02 * sin(2 * g));
}
function moonLongitude(date: Date) {
  const d = julianDate(date) - 2451543.5;
  const n = norm(125.1228 - .0529538083 * d);
  const i = 5.1454;
  const w = norm(318.0634 + .1643573223 * d);
  const a = 60.2666;
  const e = .0549;
  const m = norm(115.3654 + 13.0649929509 * d);
  const ecc = m + (180 / Math.PI) * e * sin(m) * (1 + e * cos(m));
  const x = a * (cos(ecc) - e);
  const y = a * Math.sqrt(1 - e * e) * sin(ecc);
  const r = Math.sqrt(x * x + y * y);
  const v = Math.atan2(y, x) / deg;
  const lon = Math.atan2(r * (sin(n) * cos(v + w) + cos(n) * sin(v + w) * cos(i)), r * (cos(n) * cos(v + w) - sin(n) * sin(v + w) * cos(i))) / deg;
  const sun = sunLongitude(date);
  const ms = norm(356.047 + .9856002585 * d);
  const mm = m;
  const lm = norm(n + w + m);
  const dm = norm(lm - sun);
  const f = norm(lm - n);
  // Principal lunar perturbations; adequate for a client-side indicative Panchang.
  return norm(lon - 1.274 * sin(mm - 2 * dm) + .658 * sin(2 * dm) - .186 * sin(ms) - .059 * sin(2 * mm - 2 * dm) - .057 * sin(mm - 2 * dm + ms) + .053 * sin(mm + 2 * dm) + .046 * sin(2 * dm - ms) + .041 * sin(mm - ms) - .035 * sin(dm) - .031 * sin(mm + ms) - .015 * sin(2 * f - 2 * dm));
}
function sidereal(longitude: number, date: Date) { return norm(longitude - (24.0 + .000039 * ((julianDate(date) - 2451545) / 365.25))); }
function nameAt(items: string[][], index: number, language: Language) { return items[(index + items.length) % items.length][language === "hi" ? 0 : 1]; }
function formatTime(value: Date, language: Language) { return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-GB", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(value); }

function sunriseSunset(date: Date, latitude: number, longitude: number) {
  const day = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000);
  const lngHour = longitude / 15;
  const calculate = (rise: boolean) => {
    const t = day + ((rise ? 6 : 18) - lngHour) / 24;
    const m = .9856 * t - 3.289;
    let l = norm(m + 1.916 * sin(m) + .02 * sin(2 * m) + 282.634);
    let ra = norm(Math.atan(.91764 * Math.tan(l * deg)) / deg);
    const lQuadrant = Math.floor(l / 90) * 90;
    const raQuadrant = Math.floor(ra / 90) * 90;
    ra = (ra + lQuadrant - raQuadrant) / 15;
    const sinDec = .39782 * sin(l);
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH = (cos(90.833) - sinDec * sin(latitude)) / (cosDec * cos(latitude));
    if (cosH > 1 || cosH < -1) return null;
    const h = (rise ? 360 - Math.acos(cosH) / deg : Math.acos(cosH) / deg) / 15;
    const ut = norm((h + ra - .06571 * t - 6.622 - lngHour) * 15) / 15;
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, Math.round(ut * 60)));
  };
  return { sunrise: calculate(true), sunset: calculate(false) };
}

function rahuKaal(date: Date, sunrise: Date | null, sunset: Date | null, language: Language) {
  if (!sunrise || !sunset) return "—";
  const slots = [8, 2, 7, 5, 6, 4, 3];
  const duration = (sunset.getTime() - sunrise.getTime()) / 8;
  const start = new Date(sunrise.getTime() + duration * (slots[date.getDay()] - 1));
  const end = new Date(start.getTime() + duration);
  return `${formatTime(start, language)} – ${formatTime(end, language)}`;
}

export type PanchangData = { vara: string; tithi: string; paksha: string; nakshatra: string; yoga: string; karana: string; sunrise: string; sunset: string; rahu: string; moonRashi: string; updated: string };

export function getPanchang(date: Date, latitude: number, longitude: number, language: Language): PanchangData {
  const sun = sidereal(sunLongitude(date), date);
  const moon = sidereal(moonLongitude(date), date);
  const phase = norm(moon - sun);
  const tithiIndex = Math.floor(phase / 12);
  const tithi = nameAt(tithis, tithiIndex, language);
  const weekday = new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-GB", { weekday: "long", timeZone: "Asia/Kolkata" }).format(date);
  const { sunrise, sunset } = sunriseSunset(date, latitude, longitude);
  return {
    vara: weekday,
    tithi,
    paksha: tithiIndex < 15 ? language === "hi" ? "शुक्ल पक्ष" : "Shukla Paksha" : language === "hi" ? "कृष्ण पक्ष" : "Krishna Paksha",
    nakshatra: nameAt(nakshatras, Math.floor(moon / (360 / 27)), language),
    yoga: nameAt(yogas, Math.floor(norm(sun + moon) / (360 / 27)), language),
    karana: nameAt(karanas, Math.min(10, Math.floor(phase / 6)), language),
    sunrise: sunrise ? formatTime(sunrise, language) : "—",
    sunset: sunset ? formatTime(sunset, language) : "—",
    rahu: rahuKaal(date, sunrise, sunset, language),
    moonRashi: nameAt(rashis, Math.floor(moon / 30), language),
    updated: formatTime(date, language),
  };
}

function ascendant(date: Date, latitude: number, longitude: number) {
  const jd = julianDate(date);
  const d = jd - 2451545;
  const gmst = norm(280.46061837 + 360.98564736629 * d + .000387933 * (d / 36525) ** 2);
  const lst = norm(gmst + longitude) * deg;
  const eps = (23.439291 - .0000004 * d) * deg;
  const lat = latitude * deg;
  return norm(Math.atan2(-Math.cos(lst), Math.sin(eps) * Math.tan(lat) + Math.cos(eps) * Math.sin(lst)) / deg);
}

export type KundliSnapshot = { lagna: string; moonRashi: string; sunRashi: string; nakshatra: string; tithi: string; chart: Array<{ house: number; sign: string; occupants: string[] }> };

export function getKundliSnapshot(date: Date, latitude: number, longitude: number, language: Language): KundliSnapshot {
  const sun = sidereal(sunLongitude(date), date);
  const moon = sidereal(moonLongitude(date), date);
  const asc = ascendant(date, latitude, longitude);
  const sunSign = Math.floor(sun / 30);
  const moonSign = Math.floor(moon / 30);
  const lagnaSign = Math.floor(asc / 30);
  const house = (sign: number) => ((sign - lagnaSign + 12) % 12) + 1;
  const chart = Array.from({ length: 12 }, (_, index) => ({ house: index + 1, sign: nameAt(rashis, lagnaSign + index, language), occupants: [] as string[] }));
  chart[house(sunSign) - 1].occupants.push(language === "hi" ? "सूर्य" : "Sun");
  chart[house(moonSign) - 1].occupants.push(language === "hi" ? "चंद्र" : "Moon");
  return { lagna: nameAt(rashis, lagnaSign, language), moonRashi: nameAt(rashis, moonSign, language), sunRashi: nameAt(rashis, sunSign, language), nakshatra: nameAt(nakshatras, Math.floor(moon / (360 / 27)), language), tithi: nameAt(tithis, Math.floor(norm(moon - sun) / 12), language), chart };
}
