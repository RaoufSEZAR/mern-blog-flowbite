import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	signInFailure,
	signInStart,
	signInSuccess,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
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
			return useDispatch(signInFailure("Please fill out all fields."));
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
		<div className="min-h-screem mt-20">
			<div className="flex p-3 mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-5">
				{/* left */}
				<div className="flex-1">
					<Link to="/" className=" font-bold dark:text-white text-4xl">
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-pink-500 rounded-lg text-white">
							Raouf's
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">
						This is a MERN Project. You can sign in with your email and password
						or with your google account
					</p>
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
								"Sign In"
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 text-sm mt-3 justify-center">
						<span>Don't have an account?</span>
						<Link to="/sign-up" className="text-blue-500">
							Sign Up
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
