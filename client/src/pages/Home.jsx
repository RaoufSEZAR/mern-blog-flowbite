import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { useTranslation } from "react-i18next";

export default function Home() {
	const { t } = useTranslation();

	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const res = await fetch("/api/post/getPosts");
			const data = await res.json();
			setPosts(data.posts);
		};
		fetchPosts();
	}, []);
	return (
		<div>
			<div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
				<h1 className="text-3xl font-bold lg:text-6xl">{t("home-title")}</h1>
				<p className="text-gray-400 text-xs sm:text-sm">
					Here you'll find a variety of articles and tutorials on topics such as
					web development, software engineering, and programming languages.
				</p>
				<Link
					to="/search"
					className="text-xs sm:text-sm text-pink-500 font-bold hover:underline"
				>
					{t("see-all")}
				</Link>
			</div>
			<div className="p-3 bg-amber-100 dark:bg-slate-700 mx-auto">
				<div className="max-w-6xl mx-auto w-full">
					<CallToAction />
				</div>
			</div>

			<div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
				{posts && posts.length > 0 && (
					<div className="flex flex-col gap-6">
						<h2 className="text-2xl font-semibold text-center">
							{t("recent-posts")}
						</h2>
						<div className="flex flex-wrap gap-4">
							{posts.map((post) => (
								<PostCard key={post._id} post={post} />
							))}
						</div>
						<Link
							to={"/search"}
							className="text-lg text-pink-500 hover:underline text-center"
						>
							{t("see-all")}
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
