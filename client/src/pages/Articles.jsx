import { useTranslation } from "react-i18next";
import CallToAction from "../components/CallToAction";

export default function Articles() {
	const { t } = useTranslation();
	return (
		<div className="min-h-screen max-w-4xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
			<h1 className="text-3xl font-semibold">{t("articles")}</h1>
			<p className="text-md text-gray-400">{t("find-more-articles")}</p>
			<CallToAction />
		</div>
	);
}
