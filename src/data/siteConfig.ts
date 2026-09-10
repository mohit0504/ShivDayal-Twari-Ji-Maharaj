import {
  BookOpenCheck,
  Building2,
  CalendarHeart,
  CircleDot,
  HeartHandshake,
  House,
  Sparkles,
  SunMedium,
} from "lucide-react";

export const siteConfig = {
  name: "Shri Shivdayal Tiwari Ji Maharaj",
  hindiName: "श्री शिवदयाल तिवारी जी महाराज",
  designation: "Manaskinkar • Kathavachak • Jyotishvid",
  hindiDesignation: "मानसकिंकर • कथावाचक • ज्योतिषविद",
  tagline: "Ancient wisdom. Timeless values. Modern guidance.",
  hindiTagline: "प्राचीन ज्ञान • शाश्वत मूल्य • आधुनिक मार्गदर्शन",
  description: "Jyotish consultation, Shri Ram Katha, spiritual discourses and Vedic rituals from Kashi, Varanasi.",
  primaryPhone: "+91 94790 58751",
  alternatePhone: "+91 91095 90369",
  whatsapp: "919479058751",
  address: "Kashi, Varanasi, Uttar Pradesh, India",
  hindiAddress: "काशी, वाराणसी, उत्तर प्रदेश, भारत",
  email: "",
  socialLinks: {},
  heroImage: "/src/assets/shivdayal-red.png",
  aboutImage: "/src/assets/shivdayal-gold.png",
  primaryColor: "#B85E2A",
  secondaryColor: "#4E1016",
};

export const navigation = [
  { label: "होम", to: "/" },
  { label: "परिचय", to: "/about" },
  { label: "कथा एवं आयोजन", to: "/events" },
  { label: "शिक्षाएँ", to: "/teachings" },
  { label: "मीडिया", to: "/media" },
  { label: "गैलरी", to: "/gallery" },
  { label: "संपर्क", to: "/contact" },
];

export const services = [
  { icon: BookOpenCheck, title: "जन्म कुंडली विश्लेषण", en: "Birth chart analysis", description: "जन्म कुंडली के विस्तृत अध्ययन के लिए व्यक्तिगत परामर्श।", enDescription: "Personal guidance through a detailed reading of the birth chart." },
  { icon: CircleDot, title: "ग्रह दोष निवारण", en: "Planetary remedies", description: "ग्रहों के प्रतिकूल प्रभावों के लिए वैदिक उपाय एवं शांतिपूर्ण मार्गदर्शन।", enDescription: "Vedic remedies and thoughtful guidance for challenging planetary influences." },
  { icon: HeartHandshake, title: "विवाह एवं संबंध", en: "Marriage & relationships", description: "विवाह योग, विलंब और पारिवारिक सामंजस्य के लिए परामर्श।", enDescription: "Guidance for marriage prospects, delays, and family harmony." },
  { icon: House, title: "वास्तु एवं रत्न", en: "Vastu & gemstones", description: "घर, कार्यस्थल एवं उचित रत्न धारण के लिए मार्गदर्शन।", enDescription: "Advice for home, workplace, and appropriate gemstones." },
  { icon: CalendarHeart, title: "श्रीराम कथा", en: "Shri Ram Katha", description: "श्रीराम कथा के पावन आयोजन हेतु आमंत्रण और संपर्क।", enDescription: "Enquiries and invitations for a sacred Shri Ram Katha gathering." },
  { icon: SunMedium, title: "विशेष पूजा एवं अनुष्ठान", en: "Puja & anushthan", description: "वैदिक परंपरा के अनुसार विशेष पूजा एवं धार्मिक अनुष्ठान।", enDescription: "Special worship and religious rituals conducted in the Vedic tradition." },
  { icon: Sparkles, title: "शिक्षा, करियर एवं व्यापार", en: "Education, career & business", description: "शिक्षा, करियर और व्यवसाय से जुड़ी जिज्ञासाओं के लिए मार्गदर्शन।", enDescription: "Guidance for questions around education, career, and business." },
  { icon: Building2, title: "सत्संग एवं प्रवचन", en: "Satsang & discourses", description: "आस्था और सनातन मूल्यों से जुड़े विशेष आध्यात्मिक सत्र।", enDescription: "Special spiritual sessions rooted in faith and Sanatan values." },
];

export const teachingTopics = [
  { number: "01", title: "भक्ति", en: "Bhakti", description: "श्रद्धा और समर्पण की दिशा में चिंतन के विषय।" },
  { number: "02", title: "धर्म", en: "Dharma", description: "जीवन में मर्यादा, कर्तव्य और सदाचार के विषय।" },
  { number: "03", title: "सेवा", en: "Seva", description: "समाज और परिवार के प्रति निःस्वार्थ भाव।" },
  { number: "04", title: "संस्कार", en: "Values", description: "पीढ़ियों तक भारतीय मूल्यों को आगे ले जाने का संवाद।" },
];

// Empty by design until the owner provides verified dates, links, files, or consent to publish.
export const events: Array<unknown> = [];
export const videos: Array<unknown> = [];
export const audios: Array<unknown> = [];
export const testimonials: Array<unknown> = [];
