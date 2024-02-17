import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
const DashProfile = () => {
	const { currentUser } = useSelector((state) => state.user);
	const handleUserInfo = () => {};
	return (
		<div className="max-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 font-semibold text-3xl text-center">Profile</h1>
			<form className="flex flex-col gap-3">
				<div className="w-32 h-32 cursor-pointer shadow-md rounded-full overflow-hidden self-center">
					<img
						src={currentUser.profilePicture}
						alt="user image"
						className="rounded-full w-full h-full border-8 border-[lightgray] object-cover"
					/>
				</div>
				<TextInput
					defaultValue={currentUser.username}
					onChange={handleUserInfo}
					type="text"
					id="username"
					placeholder="username"
				/>
				<TextInput
					defaultValue={currentUser.email}
					onChange={handleUserInfo}
					type="email"
					id="email"
					placeholder="email"
				/>
				<TextInput
					onChange={handleUserInfo}
					type="password"
					id="password"
					placeholder="pasword"
				/>
				<Button type="submit" gradientDuoTone="purpleToBlue" outline>
					Update
				</Button>
			</form>
			<div className="flex justify-between mt-4 text-red-500">
				<span className="cursor-pointer">Delete Account</span>
				<span className="cursor-pointer">Sign Out</span>
			</div>
		</div>
	);
};

export default DashProfile;
