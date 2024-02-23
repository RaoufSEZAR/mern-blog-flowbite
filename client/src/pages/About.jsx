import { useTranslation } from "react-i18next";

export default function About() {
	const { t } = useTranslation();

	return (
		<div className="min-h-screen flex flex-col justify-center  items-center my-5">
			<h1 className="text-3xl font font-semibold text-center mb-7 text-pink-500">
				{t("about-blog")}
			</h1>
			<div className="flex flex-col sm:flex-row-reverse max-w-2xl p-3 m-6 border border-pink-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
				<div className="max-w-2xl mx-auto p-3 text-center">
					<div>
						<div className="text-md text-gray-400 flex flex-col gap-6">
							<p>{t("about-desc-1")}</p>

							<p>{t("about-desc-2")}</p>

							<p>{t("about-desc-3")}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
