import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [imageFile, setImageFile] = useState(null);
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [imageFileUploadingProgress, setImageFileUploadingProgress] =
		useState(null);
	const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
	const filePickerRef = useRef();
	const handleUserInfo = () => {};
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setImageFile(file);
			setImageFileUrl(URL.createObjectURL(file));
		}
	};
	useEffect(() => {
		if (imageFile) {
			uploadImage();
		}
	}, [imageFile]);

	const uploadImage = async () => {
		// write this in rules part in firebase storage
		// service firebase.storage {
		// 	match /b/{bucket}/o {
		// 	  match /{allPaths=**} {
		// 		allow read;
		// 		allow write: if
		// 		request.resource.size<1024 * 2 * 1024 &&
		// 		request.resource.contentType.matches('image/.*')
		// 	  }
		// 	}
		//   }
		if (imageFile) {
			setImageFileUploadingError(null);
			const storage = getStorage(app);
			const fileName = new Date().getTime() + imageFile.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, imageFile);
			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress =
						(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setImageFileUploadingProgress(progress.toFixed(0));
				},
				(error) => {
					console.log(error);
					setImageFileUploadingError(
						"Could't upload the image(file must be less than 2MB)"
					);
					setImageFileUploadingProgress(null);
					setImageFile(null);
					setImageFileUrl(null);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
						setImageFileUrl(downloadUrl);
					});
				}
			);
		}
	};

	return (
		<div className="max-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 font-semibold text-3xl text-center">Profile</h1>
			<form className="flex flex-col gap-3">
				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					ref={filePickerRef}
					hidden
				/>
				<div
					className="relative w-32 h-32 cursor-pointer shadow-md rounded-full overflow-hidden self-center"
					onClick={() => filePickerRef.current.click()}
				>
					{imageFileUploadingProgress && (
						<CircularProgressbar
							value={imageFileUploadingProgress || 0}
							text={`${imageFileUploadingProgress}%`}
							strokeWidth={5}
							styles={{
								root: {
									width: "100%",
									height: "100%",
									position: "absolute",
									left: 0,
									top: 0,
								},
								path: {
									stroke: `rgba(62,192,199,${
										imageFileUploadingProgress / 100
									})`,
								},
							}}
						/>
					)}

					<img
						src={imageFileUrl || currentUser.profilePicture}
						alt="user image"
						className={`rounded-full w-full h-full border-8 border-[lightgray] object-cover ${
							imageFileUploadingProgress &&
							imageFileUploadingProgress < 100 &&
							"opacity-60"
						}`}
					/>
				</div>
				{imageFileUploadingError && (
					<Alert color="failure">{imageFileUploadingError}</Alert>
				)}
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
