import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Textarea } from "flowbite-react";
import Comment from "./Comment";

// eslint-disable-next-line react/prop-types
const CommentSection = ({ postId }) => {
	const { currentUser } = useSelector((state) => state.user);
	const [comment, setComment] = useState("");
	const [commentError, setCommentError] = useState(null);
	const [comments, setComments] = useState([]);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (comment && comment.length > 200) {
			return;
		}
		try {
			const res = await fetch(`/api/comment/create`, {
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
		const getcomments = async () => {
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

		getcomments();
	}, [postId]);

	const handleLike = async (commentId) => {
		console.log(commentId);
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
					comments.map((com) =>
						com._id === commentId
							? {
									...comment,
									likes: data.likes,
									numberOfLikes: data.likes.lenght,
							  }
							: comment
					)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};
	return (
		<div className="mx-auto max-w-2xl w-full p-3">
			{currentUser ? (
				<div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
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
				<div className="text-sm text-teal-500 my-5 flex gap-1">
					You must be signed in to comment.
					<Link to={"/sign-in"} className="text-blue-500 hover:underline">
						Sign In
					</Link>
				</div>
			)}

			{currentUser && (
				<form
					onSubmit={handleSubmit}
					className="border border-teal-500 rounded-md p-3"
				>
					<Textarea
						onChange={(e) => setComment(e.target.value)}
						value={comment}
						placeholder="Add a comment..."
						rows={3}
						maxLength={200}
					/>
					<div className="flex justify-between items-center mt-5">
						<p className="text-gray-500 text-xs">
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
			{comments && comments.length === 0 ? (
				<p className="text-sm text-teal-500 my-5">No comments yet!</p>
			) : (
				<>
					<div className="text-sm my-5 flex items-center gap-1">
						<p>Comments</p>
						<div className="border border-gray-400 py-1 px-2 rounded-sm">
							<p>{comments.length}</p>
						</div>
					</div>
					{comments.map((comment) => (
						<Comment comment={comment} key={comment._id} onLike={handleLike} />
					))}
				</>
			)}
		</div>
	);
};

export default CommentSection;
