import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "dist");
const server = resolve(output, "server");
const worker = String.raw`
const placeCache = new Map();

const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const classicalPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const englishSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const planetOrder = ["Ascendant", "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
const combustionLimits = { Mercury: 14, Venus: 10, Mars: 17, Jupiter: 11, Saturn: 15 };

async function navamsha(path, body, env) {
  if (!env.NAVAMSHA_API_KEY) throw new Error("Astrology service is not configured.");
  const response = await fetch("https://api.navamsha.in/api/v1/" + path, { method: "POST", headers: { "content-type": "application/json", "x-api-key": env.NAVAMSHA_API_KEY, accept: "application/json" }, body: JSON.stringify(body) });
  const payload = await response.json();
  if (!response.ok || Number(payload.statusCode) >= 400 || !payload.output) throw new Error(payload.detail || payload.message || "The astrology service could not calculate this Kundli.");
  return payload.output;
}

function signIndex(sign) { const numeric = Number(sign); if (Number.isInteger(numeric) && numeric >= 1 && numeric <= 12) return numeric; const value = String(sign || "").toLowerCase(); return englishSigns.findIndex((name) => name.toLowerCase() === value) + 1; }
function degreeInSign(longitude, divisor = 1) { return ((Number(longitude) % 30) * divisor) % 30; }
function isTrue(value) { return value === true || value === 1 || String(value).toLowerCase() === "true" || String(value) === "1"; }
function explicitBoolean(position, keys) { for (const key of keys) if (Object.prototype.hasOwnProperty.call(position || {}, key)) return isTrue(position[key]); return null; }
function angularDistance(left, right) { const difference = Math.abs(left - right) % 360; return Math.min(difference, 360 - difference); }
function combustionStatuses(planets) { const sunLongitude = Number(planets?.Sun?.fullDegree); return Object.fromEntries(planetOrder.map((name) => { const position = planets?.[name]; const explicit = explicitBoolean(position, ["isCombust", "is_combust", "combust", "isCombustion"]); if (explicit !== null) return [name, explicit]; const limit = combustionLimits[name]; const longitude = Number(position?.fullDegree); return [name, Boolean(limit && Number.isFinite(sunLongitude) && Number.isFinite(longitude) && angularDistance(sunLongitude, longitude) <= limit)]; })); }
function rashiFromPlacement(position, referenceSign) { const baseSign = signIndex(referenceSign); const house = Number(position?.house); if (!baseSign || !Number.isInteger(house) || house < 1 || house > 12) return 0; return ((baseSign + house - 2) % 12) + 1; }
function positionSign(position) { return position?.zodiac_sign_name ?? position?.current_sign ?? position?.sign; }
function vargottamaStatuses(planets, placements, referenceSign) { return Object.fromEntries(planetOrder.map((name) => { const d1Sign = signIndex(positionSign(planets?.[name])); const d9Sign = rashiFromPlacement(placements?.[name], referenceSign); return [name, Boolean(d1Sign && d9Sign && d1Sign === d9Sign)]; })); }
function canonicalPlanet(name) { return name === "Lagna" ? "Ascendant" : name; }

function chartFromPlacements(placements, referenceSign, retrogrades, combustions, vargottamas, divisor = 1) {
  const baseSign = signIndex(referenceSign);
  if (!baseSign) throw new Error("The astrology service returned an invalid chart reference sign.");
  const houses = Array.from({ length: 12 }, (_, index) => ({ house: index + 1, rashiNumber: ((baseSign + index - 1) % 12) + 1, occupants: [] }));
  for (const [rawName, position] of Object.entries(placements || {})) {
    const name = canonicalPlanet(rawName);
    const house = Number(position?.house);
    if (!Number.isInteger(house) || house < 1 || house > 12) continue;
    houses[house - 1].occupants.push({ planet: name, degree: degreeInSign(position.longitude, divisor), retrograde: Boolean(retrogrades[name]), combust: Boolean(combustions[name]), vargottama: Boolean(vargottamas[name]) });
  }
  for (const house of houses) house.occupants.sort((left, right) => planetOrder.indexOf(left.planet) - planetOrder.indexOf(right.planet));
  return { houses };
}

function validInput(input) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(input.date)) || !/^\d{2}:\d{2}$/.test(String(input.time))) return null;
  const zone = String(input.timezone || "").match(/^([+-])(\d{2}):(\d{2})$/);
  if (!zone || Number(zone[2]) > 14 || Number(zone[3]) > 59) return null;
  const place = String(input.place || "").trim();
  if (!place) return null;
  const [year, month, date] = String(input.date).split("-").map(Number);
  const [hours, minutes] = String(input.time).split(":").map(Number);
  const timezone = (zone[1] === "-" ? -1 : 1) * (Number(zone[2]) + Number(zone[3]) / 60);
  return { place, year, month, date, hours, minutes, timezone };
}

async function resolvePlace(place, language) {
  const key = place.toLowerCase();
  const cached = placeCache.get(key);
  if (cached) return cached;
  const url = "https://nominatim.openstreetmap.org/search?" + new URLSearchParams({ q: place, format: "jsonv2", limit: "1", "accept-language": language === "hi" ? "hi" : "en" });
  const response = await fetch(url, { headers: { accept: "application/json", "user-agent": "Shivdayal-Tiwari-Kundli/1.0" } });
  const matches = await response.json();
  const match = Array.isArray(matches) ? matches[0] : null;
  const latitude = Number(match?.lat); const longitude = Number(match?.lon);
  if (!response.ok || !Number.isFinite(latitude) || !Number.isFinite(longitude)) throw new Error(language === "hi" ? "जन्म स्थान नहीं मिल सका। कृपया शहर, राज्य और देश के साथ फिर से लिखें।" : "Birth place could not be found. Please enter city, state and country.");
  const resolved = { latitude, longitude, place: String(match.display_name || place) };
  placeCache.set(key, resolved);
  return resolved;
}

async function kundli(request, env) {
  const input = await request.json();
  const birth = validInput(input);
  if (!birth) return json({ error: input.language === "hi" ? "कृपया जन्म स्थान, जन्म तिथि, समय और समय क्षेत्र सही भरें।" : "Enter a valid birth place, date, time and time zone." }, 400);
  const datetime = String(input.date) + "T" + String(input.time) + ":00" + String(input.timezone);
  try {
    const coordinates = await resolvePlace(birth.place, input.language);
    const navamshaInput = { year: birth.year, month: birth.month, date: birth.date, hours: birth.hours, minutes: birth.minutes, seconds: 0, latitude: coordinates.latitude, longitude: coordinates.longitude, timezone: birth.timezone, settings: { observation_point: "topocentric" } };
    const [basic, chandra, d9] = await Promise.all([navamsha("kundali/basic", navamshaInput, env), navamsha("kundali/chandra-chart", navamshaInput, env), navamsha("divisional/d9", navamshaInput, env)]);
    const d1Planets = basic.planets || {};
    const ascendant = basic.ascendant;
    if (!ascendant || !d1Planets.Moon) throw new Error("The required Lagna or Moon position was not returned.");
    const retrogrades = Object.fromEntries(Object.entries(d1Planets).map(([name, position]) => [name, isTrue(position.isRetro)]));
    const combustions = combustionStatuses(d1Planets);
    const lagnaPlacements = { ...Object.fromEntries(classicalPlanets.filter((name) => d1Planets[name]).map((name) => [name, { house: d1Planets[name].house_number, longitude: d1Planets[name].fullDegree }])), Ascendant: { house: 1, longitude: ascendant.fullDegree } };
    const d9Placements = { ...(d9.placements || {}), ...(!d9.placements?.Ascendant && !d9.placements?.Lagna && d9.ascendant ? { Ascendant: { house: 1, longitude: d9.ascendant.fullDegree ?? d9.ascendant.longitude } } : {}) };
    const vargottamas = vargottamaStatuses({ ...d1Planets, Ascendant: ascendant }, d9Placements, d9.reference_sign);
    const planetRows = planetOrder.filter((name) => name === "Ascendant" || d1Planets[name]).map((name) => { const position = name === "Ascendant" ? ascendant : d1Planets[name]; return { planet: name, rashiNumber: signIndex(positionSign(position)), degree: degreeInSign(position.fullDegree), longitude: Number(position.fullDegree), retrograde: Boolean(retrogrades[name]), combust: Boolean(combustions[name]), vargottama: Boolean(vargottamas[name]) }; });
    return json({ source: "Navamsha Astrology Engine · Lahiri", birth: { name: String(input.name || ""), place: coordinates.place, datetime }, charts: { lagna: chartFromPlacements(lagnaPlacements, ascendant.zodiac_sign_name, retrogrades, combustions, vargottamas), chandra: chartFromPlacements(chandra.placements, chandra.reference_sign, retrogrades, combustions, vargottamas), navamsa: chartFromPlacements(d9Placements, d9.reference_sign, retrogrades, combustions, vargottamas, 9) }, planets: planetRows });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Kundli could not be generated." }, 502); }
}

export default { async fetch(request, env) { const url = new URL(request.url); if (url.pathname === "/api/kundli") { if (request.method !== "POST") return json({ error: "Method not allowed." }, 405); return kundli(request, env); } return env.ASSETS.fetch(request); } };
`;

await mkdir(server, { recursive: true });
await mkdir(resolve(output, ".openai"), { recursive: true });
await writeFile(resolve(server, "index.js"), worker);
await writeFile(resolve(server, "wrangler.json"), JSON.stringify({ main: "index.js", compatibility_date: "2025-09-01", assets: { directory: "../client", binding: "ASSETS", not_found_handling: "single-page-application" } }, null, 2));
await writeFile(resolve(output, ".openai", "hosting.json"), await readFile(resolve(root, ".openai", "hosting.json")));
