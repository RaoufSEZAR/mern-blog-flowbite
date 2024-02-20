import {
	getDownloadURL,
	getStorage,
	ref,
	uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";

const CreatePost = () => {
	const categories = ["Nextjs", "Angular", "React", "Nodejs", "Javascript"];
	const [file, setFile] = useState(null);
	const [imageFileUploadingProgress, setImageFileUploadingProgress] =
		useState(null);
	const [imageFileUploadingError, setImageFileUploadingError] = useState(null);
	const [formData, setFormData] = useState({});
	const [value, setValue] = useState("");

	const handleUploadImage = async () => {
		try {
			if (!file) {
				setImageFileUploadingError("Please select an image");
				return;
			}
			setImageFileUploadingError(null);
			const storage = getStorage(app);
			const fileName = new Date().getTime() + file.name;
			const storageRef = ref(storage, fileName);
			const uploadTask = uploadBytesResumable(storageRef, file);
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
					setFile(null);
					// setImageFileUrl(null);
					// setImageFileUploading(false);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
						setImageFileUploadingProgress(null);
						setImageFileUploadingError(false);
						setFormData({ ...formData, image: downloadUrl });
					});
				}
			);
		} catch (error) {
			setImageFileUploadingError(
				"Could't upload the image(file must be less than 2MB)"
			);
			setImageFileUploadingProgress(null);

			console.log(error);
		}
	};
	return (
		<div className="p-3 max-w-3xl mx-auto min-h-screen">
			<h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
			<form action="" className="flex flex-col gap-4">
				<div className="flex flex-col gap-4 sm:flex-row justify-between">
					<TextInput
						required
						type="text"
						id="title"
						placeholder="title"
						className="flex-1"
					/>
					<Select>
						<option disabled>Select a category</option>
						{categories.map((item, index) => (
							<option value={item} key={index}>
								{item}
							</option>
						))}
					</Select>
				</div>
				<div className="relative flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
					<FileInput
						type="file"
						accept="image/*"
						onChange={(e) => setFile(e.target.files[0])}
					/>
					<Button
						type="button"
						gradientDuoTone="purpleToBlue"
						size="sm"
						outline
						onClick={handleUploadImage}
						disabled={imageFileUploadingProgress}
					>
						{imageFileUploadingProgress &&
						imageFileUploadingProgress !== 100 ? (
							<div className="w-16 h-16">
								<CircularProgressbar
									value={imageFileUploadingProgress || 0}
									text={`${imageFileUploadingProgress}%`}
								/>
							</div>
						) : (
							"Upload Image"
						)}
					</Button>
				</div>
				{imageFileUploadingError && (
					<Alert color="failure">{imageFileUploadingError}</Alert>
				)}

				{formData.image && (
					<img
						src={formData.image}
						alt="upload"
						className="h-72 mb-12 object-cover"
					/>
				)}
				<ReactQuill
					theme="snow"
					value={value}
					onChange={setValue}
					placeholder="Write something..."
					className="h-72 mb-12"
					required
				/>
				<Button type="submit" gradientDuoTone="purpleToPink">
					Publish
				</Button>
			</form>
		</div>
	);
};

export default CreatePost;
