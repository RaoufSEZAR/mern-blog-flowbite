import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	signInFailure,
	signInStart,
	signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { useTranslation } from "react-i18next";

const Signin = () => {
	const { t } = useTranslation();
	const [formData, setFormData] = useState({});
	const { loading, error: errorMessage } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleChanges = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.password || !formData.email) {
			return dispatch(signInFailure("Please fill out all fields."));
		}
		try {
			dispatch(signInStart());
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (data.success === false) {
				dispatch(signInFailure(data.message));
			}
			if (res.ok) {
				dispatch(signInSuccess(data));

				navigate("/");
			}
		} catch (error) {
			dispatch(signInFailure(error.message));
		}
	};

	return (
		<div className="min-h-screen mt-20">
			<div className="flex p-3 mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-5">
				{/* left */}
				<div className="flex-1">
					<Link to="/" className=" font-bold dark:text-white text-3xl">
						<span className="px-2 py-1 bg-gradient-to-r text-pink-500 rounded-lg">
							{t("home-title")}
						</span>
					</Link>
					<p className="text-sm mt-5">{t("project-desc")}</p>
				</div>
				{/* right */}
				<div className="flex-1">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
								t("sign-in")
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 text-sm mt-3 justify-center">
						<span>{t("have-account")}</span>
						<Link to="/sign-up" className="text-blue-500">
							{t("sign-up")}
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

export default Signin;
