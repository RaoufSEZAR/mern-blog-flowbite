import { Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
	const categories = ["Nextjs", "Angular", "React", "Nodejs", "Javascript"];
	const [value, setValue] = useState("");
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
				<div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
					<FileInput type="file" accept="image/*" />
					<Button
						type="button"
						gradientDuoTone="purpleToBlue"
						size="sm"
						outline
					>
						Upload image
					</Button>
				</div>
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
