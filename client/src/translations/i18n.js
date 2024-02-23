import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import en from "./en/translation.json";
import tr from "./tr/translation.json";
i18n
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		debug: true,
		detection: {
			order: ["queryString", "cookie"],
			cache: ["cookie"],
		},
		resources: {
			en: {
				translation: en,
			},
			tr: {
				translation: tr,
			},
		},
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
