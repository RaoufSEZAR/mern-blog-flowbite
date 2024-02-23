import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useTranslation } from "react-i18next";

const Signup = () => {
	const { t } = useTranslation();
	const [formData, setFormData] = useState({});
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const navigate = useNavigate();
	const handleChanges = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.username || !formData.password || !formData.email) {
			return setErrorMessage("Please fill out all fields.");
		}
		try {
			setLoading(true);
			setErrorMessage(null);
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				return setErrorMessage(data.message);
			}
			setLoading(false);
			if (res.ok) {
				navigate("/sign-in");
			}
		} catch (error) {
			setErrorMessage(error.message);
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-5">
				{/* left */}
				<div className="flex-1">
					<Link to="/" className="w-full font-bold dark:text-white text-3xl">
						<span className="px-2 py-1 w-full bg-gradient-to-r text-pink-500 rounded-lg">
							{t("home-title")}
						</span>
					</Link>
					<p className="text-sm mt-5">{t("project-desc")}</p>
				</div>
				{/* right */}
				<div className="flex-1">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<Label value="Your Username" />
							<TextInput
								type="text"
								id="username"
								placeholder="Username"
								onChange={handleChanges}
							/>
						</div>
						<div>
							<Label value="Your Email" />
							<TextInput
								type="email"
								id="email"
								placeholder="raouf@company.com"
								onChange={handleChanges}
							/>
						</div>
						<div>
							<Label value="Your Password" />
							<TextInput
								type="password"
								id="password"
								placeholder="*********"
								onChange={handleChanges}
							/>
						</div>
						<Button
							gradientDuoTone="purpleToPink"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Spinner size="sm" /> <span className="pl-3">Loading...</span>
								</>
							) : (
								t("sign-up")
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 text-sm mt-3 justify-center">
						<span> {t("have-an-account")}</span>
						<Link to="/sign-in" className="text-blue-500">
							{t("sign-in")}
						</Link>
					</div>
					{errorMessage && (
						<Alert color="failure" className="mt-5">
							{errorMessage}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default Signup;
