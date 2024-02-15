import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const Signup = () => {
	return (
		<div className="min-h-screem mt-20">
			<div className="flex p-3 mx-auto max-w-3xl flex-col md:flex-row md:items-center gap-5">
				{/* left */}
				<div className="flex-1">
					<Link to="/" className=" font-bold dark:text-white text-4xl">
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
							Raouf's
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">
						This is a MERN Project. You can sign up with your email and password
						or with your google account
					</p>
				</div>
				{/* right */}
				<div className="flex-1">
					<form className="flex flex-col gap-4">
						<div>
							<Label value="Your Username" />
							<TextInput type="text" id="username" placeholder="Username" />
						</div>
						<div>
							<Label value="Your Email" />
							<TextInput
								type="text"
								id="email"
								placeholder="raouf@company.com"
							/>
						</div>
						<div>
							<Label value="Your Password" />
							<TextInput type="password" id="password" placeholder="password" />
						</div>
						<Button gradientDuoTone="purpleToPink" type="submit">
							Sign Up
						</Button>
					</form>
					<div className="flex gap-2 text-sm mt-3 justify-center">
						<span>Have an account?</span>
						<Link to="/sign-in" className="text-blue-500">
							Sign In
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Signup;
