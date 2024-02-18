import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { app } from "./../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
	deleteUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	signoutSuccess,
	updateUserFailure,
	updateUserStart,
	updateUserSuccess,
} from "../redux/user/userSlice";

const DashProfile = () => {
	const { currentUser, error } = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const [imageFile, setImageFile] = useState(null);
	const [formData, setFormData] = useState({});
	const [imageFileUrl, setImageFileUrl] = useState(null);
	const [updateUserErrorHook, setUpdateUserErrorHook] = useState(null);
	const [imageFileUploadingProgress, setImageFileUploadingProgress] =
		useState(null);
	const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
	const [imageFileUploading, setImageFileUploading] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [updateUserSuccessHook, setUpdateUserSuccessHook] = useState(null);
	const filePickerRef = useRef();
	const handleUserInfo = async (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

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
			setImageFileUploading(true);
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
					setImageFileUploading(false);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
						setImageFileUrl(downloadUrl);
						setFormData({ ...formData, profilePicture: downloadUrl });
						// remove the progressbar after completing
						setImageFileUploadingProgress(100);
						setImageFileUploading(false);
					});
				}
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setUpdateUserErrorHook(null);
		setUpdateUserSuccessHook(null);
		if (Object.keys(formData).length === 0) {
			setUpdateUserErrorHook("No changes made");
			return;
		}
		if (imageFileUploading) {
			setUpdateUserErrorHook("Please wait for image to upload");
			return;
		}
		try {
			dispatch(updateUserStart());
			const res = await fetch(`/api/user/update/${currentUser._id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			if (!res.ok) {
				dispatch(updateUserFailure(data.message));
				setUpdateUserErrorHook(data.message);
			} else {
				dispatch(updateUserSuccess(data));
				setUpdateUserSuccessHook("User's profile updated successfully.");
			}
		} catch (error) {
			dispatch(updateUserFailure(error.message));
			setUpdateUserErrorHook(error.message);
		}
	};

	const handleDeleteUser = async () => {
		setShowModal(false);
		try {
			dispatch(deleteUserStart());
			const res = await fetch(`/api/user/delete/${currentUser._id}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) {
				dispatch(deleteUserFailure(data.message));
			} else {
				dispatch(deleteUserSuccess(data));
			}
		} catch (error) {
			dispatch(deleteUserFailure(error.message));
		}
	};

	const signout = async () => {
		try {
			const res = await fetch("/api/user/signout", {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signoutSuccess());
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="max-w-lg mx-auto p-3 w-full">
			<h1 className="my-7 font-semibold text-3xl text-center">Profile</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
					{imageFileUploadingProgress && imageFileUploadingProgress !== 100 && (
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
				<span className="cursor-pointer" onClick={() => setShowModal(true)}>
					Delete Account
				</span>
				<span className="cursor-pointer" onClick={signout}>
					Sign Out
				</span>
			</div>

			{updateUserSuccessHook && (
				<Alert color={"success"} className="mt-5">
					{updateUserSuccessHook}
				</Alert>
			)}
			{updateUserErrorHook && (
				<Alert color={"failure"} className="mt-5">
					{updateUserErrorHook}
				</Alert>
			)}
			{error && (
				<Alert color={"failure"} className="mt-5">
					{error}
				</Alert>
			)}

			<Modal
				show={showModal}
				onClose={() => setShowModal(false)}
				popup
				size="md"
			>
				<Modal.Header />
				<Modal.Body>
					<div className="text-center">
						<HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
						<h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
							Are you sure you want to delete your account?
						</h3>
						<div className="flex justify-center gap-4">
							<Button color="failure" onClick={handleDeleteUser}>
								Yes, I'm sure
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								No, cancel
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default DashProfile;
