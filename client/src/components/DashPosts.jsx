/* eslint-disable react/jsx-key */
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashPosts = () => {
	const { currentUser } = useSelector((state) => state.user);
	const [userPosts, setUserPosts] = useState([]);
	const [showMorePosts, setShowMorePosts] = useState(true);

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
	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const res = await fetch(`/api/post/getPosts?userId=${currentUser._id}`);
				const data = await res.json();
				if (res.ok) {
					setUserPosts(data.posts);
					if (data.posts && data.posts.length > 9) {
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
	return (
		<div className="table-auto overflow-x-scroll md:overflow-hidden md:mx-auto p-3 scrollbar scrollbar-track-slate-100 dark:scrollbar-track-slate-700 scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-500">
			{currentUser.isAdmin && userPosts && userPosts.length > 0 ? (
				<>
					<Table hoverable className="shadow-md">
						<Table.Head>
							<Table.HeadCell>Updated Date </Table.HeadCell>
							<Table.HeadCell>Image</Table.HeadCell>
							<Table.HeadCell>Title</Table.HeadCell>
							<Table.HeadCell>Category</Table.HeadCell>
							<Table.HeadCell>Delete</Table.HeadCell>
							<Table.HeadCell>
								<span>Edit</span>
							</Table.HeadCell>
						</Table.Head>
						{userPosts.map((post) => (
							<Table.Body className="divide-y">
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
									<Table.Cell className="font-medium text-red-500 hover:underline cursor-pointer">
										Delete
									</Table.Cell>
									<Table.Cell>
										<Link to={`/update-post/${post._id}`}>
											<span className="text-teal-500 cursor-pointer">Edit</span>
										</Link>
									</Table.Cell>
								</Table.Row>
							</Table.Body>
						))}
					</Table>
					{showMorePosts && (
						<button
							onClick={handleShowMore}
							className="w-full text-teal-500 self-center text-sm py-7"
						>
							Show More
						</button>
					)}
				</>
			) : (
				<p>You have no posts yet</p>
			)}
		</div>
	);
};

export default DashPosts;
