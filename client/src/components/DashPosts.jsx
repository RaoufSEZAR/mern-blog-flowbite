/* eslint-disable react/jsx-key */
import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
	const { t } = useTranslation();

	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMorePosts, setShowMorePosts] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [postIdToDelete, setPostIdToDelete] = useState("");

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.posts);
					if (data.posts && data.posts.length < 9) {
						setShowMorePosts(false);
					}
				}
			} catch (error) {
				console.log(error.message);
			}
		};
		if (currentUser.isAdmin) {
			fetchPosts();
		}
	}, [currentUser._id, currentUser.isAdmin]);
	const handleShowMore = async () => {
		const startIndex = userPosts.length;
		try {
			const res = await fetch(
				`/api/post/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`
			);
			const data = await res.json();
			if (res.ok) {
				setUserPosts((perv) => [...perv, ...data.posts]);
				if (data.posts && data.posts.length < 9) {
					setShowMorePosts(false);
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleDeletePost = async () => {
		setShowModal(false);
		try {
			const res = await fetch(
				`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
				{
					method: "DELETE",
				}
			);
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				setUserPosts((posts) =>
					posts.filter((post) => post._id !== postIdToDelete)
				);
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<div className="table-auto overflow-x-scroll md:overflow-hidden md:mx-auto p-3 scrollbar scrollbar-track-slate-100 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-500">
			<div className="flex items-center justify-around my-4">
				<h1 className="font-bold text-3xl">{t("posts")}</h1>
				{currentUser.isAdmin && (
					<Link to="/create-post">
						<Button
							type="button"
							gradientDuoTone={"purpleToPink"}
							className="w-full"
						>
							{t("create-post")}{" "}
						</Button>
					</Link>
				)}
			</div>
			{currentUser.isAdmin && userPosts && userPosts.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>{t("updated-date")} </Table.HeadCell>
							<Table.HeadCell>{t("post-image")}</Table.HeadCell>
							<Table.HeadCell>{t("post-title")}</Table.HeadCell>
							<Table.HeadCell>{t("category")}</Table.HeadCell>
							<Table.HeadCell>{t("delete")}</Table.HeadCell>
							<Table.HeadCell>
								<span>{t("update")}</span>
							</Table.HeadCell>
						</Table.Head>
						{userPosts.map((post) => (
							<Table.Body key={post._id} className="divide-y">
								<Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
									<Table.Cell>
										{new Date(post.updatedAt).toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/post/${post.slug}`}>
											<img
												src={post.image}
												alt={post.title}
												className="w-20 h-10 object-cover bg-gray-500"
											/>
										</Link>
									</Table.Cell>
									<Table.Cell>
										<Link
											className="font-medium text-gray-900 dark:text-white"
											to={`/post/${post.slug}`}
										>
											{post.title}
										</Link>
									</Table.Cell>
									<Table.Cell>{post.category}</Table.Cell>
									<Table.Cell
										onClick={() => {
											setShowModal(true);
											setPostIdToDelete(post._id);
										}}
										className="font-medium text-red-500 hover:underline cursor-pointer"
									>
										{t("delete")}
									</Table.Cell>
									<Table.Cell>
										<Link to={`/update-post/${post._id}`}>
											<span className="text-purple-500 cursor-pointer">
												{t("update")}
											</span>
										</Link>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMorePosts && (
						<button
							onClick={handleShowMore}
							className="w-full text-purple-500 self-center text-sm py-7"
						>
							{t("show-more")}
						</button>
					)}

					<Modal
						show={showModal}
						onClose={() => {
							setShowModal(false);
						}}
						popup
						size="md"
					>
						<Modal.Header />
						<Modal.Body>
							<div className="text-center">
								<HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
								<h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
									{t("post-sil-modal")}{" "}
								</h3>
								<div className="flex justify-center gap-4">
									<Button color="failure" onClick={handleDeletePost}>
										{t("yes-modal")}
									</Button>
									<Button color="gray" onClick={() => setShowModal(false)}>
										{t("no-modal")}
									</Button>
								</div>
							</div>
						</Modal.Body>
					</Modal>
				</>
			) : (
				<p>You have no posts yet</p>
			)}
		</div>
	);
};

export default DashPosts;
