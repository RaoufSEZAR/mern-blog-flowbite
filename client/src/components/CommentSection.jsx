import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/prop-types
const CommentSection = ({ postId }) => {
	const { t } = useTranslation();

	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [commentError, setCommentError] = useState(null);
	const [comments, setComments] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [commentToDelete, setCommentToDelete] = useState(null);
	const navigate = useNavigate();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (comment && comment.length > 200) {
			return;
		}
		try {
			const res = await fetch("/api/comment/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					postId,
					content: comment,
					userId: currentUser._id,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				setCommentError(data.message);
				return;
			}
			setComment("");
			setCommentError(null);
			setComments([data, ...comments]);
		} catch (error) {
			setCommentError(error.message);
		}
	};

	useEffect(() => {
		const getComments = async () => {
			try {
				const res = await fetch(`/api/comment/getPostComments/${postId}`);
				if (res.ok) {
					const data = await res.json();
					setComments(data);
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		getComments();
	}, [postId]);

	const handleLike = async (commentId) => {
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/comment/likeComment/${commentId}`, {
				method: "PUT",
			});
			if (res.ok) {
				const data = await res.json();
				setComments(
					comments.map((comment) =>
						comment._id === commentId
							? {
									...comment,
									likes: data.likes,
									numberOfLikes: data.likes.length,
							  }
							: comment
					)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleEdit = async (comment, editedContent) => {
		setComments(
			comments.map((c) =>
				c._id === comment._id ? { ...c, content: editedContent } : c
			)
		);
	};

	const handleDelete = async (commentId) => {
		setShowModal(false);
		try {
			if (!currentUser) {
				navigate("/sign-in");
				return;
			}
			const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
				method: "DELETE",
			});
			if (res.ok) {
				await res.json();
				setComments(comments.filter((comment) => comment._id !== commentId));
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div className="mx-auto max-w-2xl w-full p-3">
			{currentUser ? (
				<div className="flex items-center gap-1 my-5 text-gray-400 text-sm">
					<p>Signed in as:</p>
					<img
						className="h-7 w-7 object-cover rounded-full"
						src={currentUser.profilePicture}
						alt={currentUser.username}
					/>
					<Link
						to={"/dashboard?tab=profile"}
						className="text-xs text-cyan-600 hover:underline"
					>
						@{currentUser.username}
					</Link>
				</div>
			) : (
				<div className="text-sm text-pink-500 my-5 flex gap-1">
					You must be signed in to comment.
					<Link className="text-blue-500 hover:underline" to={"/sign-in"}>
						Sign In
					</Link>
				</div>
			)}

			{currentUser && (
				<form
					onSubmit={handleSubmit}
					className="border border-pink-500 rounded-md p-3"
				>
					<Textarea
						onChange={(e) => setComment(e.target.value)}
						value={comment}
						placeholder="Add a comment..."
						rows={3}
						maxLength={200}
					/>
					<div className="flex justify-between items-center mt-5">
						<p className="text-gray-400 text-xs">
							{200 - comment.length} characters remaining.
						</p>
						<Button type="submit" outline gradientDuoTone={"purpleToBlue"}>
							Submit
						</Button>
					</div>
					{commentError && (
						<Alert className="mt-5" color={"failure"}>
							{commentError}
						</Alert>
					)}
				</form>
			)}
			{comments.length === 0 ? (
				<p className="text-sm text-pink-500 my-5">No comments yet!</p>
			) : (
				<>
					<div className="text-sm my-5 flex items-center gap-1">
						<p>Comments</p>
						<div className="border border-gray-400 py-1 px-2 rounded-sm">
							<p>{comments.length}</p>
						</div>
					</div>
					{comments.map((comment) => (
						<Comment
							key={comment._id}
							comment={comment}
							onLike={handleLike}
							onEdit={handleEdit}
							onDelete={(commentId) => {
								setShowModal(true);
								setCommentToDelete(commentId);
							}}
						/>
					))}
				</>
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
						<h3 className="mb-5 text-lg text-gray-400 dark:text-gray-400">
							{t("comment-sil-modal")}{" "}
						</h3>
						<div className="flex justify-center gap-4">
							<Button
								color="failure"
								onClick={() => handleDelete(commentToDelete)}
							>
								{t("yes-modal")}
							</Button>
							<Button color="gray" onClick={() => setShowModal(false)}>
								{t("no-modal")}
							</Button>
						</div>
					</div>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default CommentSection;
