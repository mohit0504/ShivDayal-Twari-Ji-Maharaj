import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import type { Language } from "./utils/vedic";

export default function App() {
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem("shivdayal-language") === "en" ? "en" : "hi");
  const setPreferredLanguage = (next: Language) => { localStorage.setItem("shivdayal-language", next); setLanguage(next); };
  return <HomePage language={language} setLanguage={setPreferredLanguage} />;
}
