import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useTranslation } from "react-i18next";

export default function Search() {
	const { t } = useTranslation();

	const categories = ["Nextjs", "Angular", "React", "Nodejs", "Javascript"];

	const [sidebarData, setSidebarData] = useState({
		searchTerm: "",
		sort: "desc",
		category: "uncategorized",
	});

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [showMore, setShowMore] = useState(false);

	const location = useLocation();

	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		const sortFromUrl = urlParams.get("sort");
		const categoryFromUrl = urlParams.get("category");
		if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
			setSidebarData({
				...sidebarData,
				searchTerm: searchTermFromUrl,
				sort: sortFromUrl,
				category: categoryFromUrl,
			});
		}

		const fetchPosts = async () => {
			setLoading(true);
			const searchQuery = urlParams.toString();
			const res = await fetch(`/api/post/getposts?${searchQuery}`);
			if (!res.ok) {
				setLoading(false);
				return;
			}
			if (res.ok) {
				const data = await res.json();
				setPosts(data.posts);
				setLoading(false);
				if (data.posts.length === 9) {
					setShowMore(true);
				} else {
					setShowMore(false);
				}
			}
		};
		fetchPosts();
	}, [location.search]);

	const handleChange = (e) => {
		if (e.target.id === "searchTerm") {
			setSidebarData({ ...sidebarData, searchTerm: e.target.value });
		}
		if (e.target.id === "sort") {
			const order = e.target.value || "desc";
			setSidebarData({ ...sidebarData, sort: order });
		}
		if (e.target.id === "category") {
			const category = e.target.value || "uncategorized";
			setSidebarData({ ...sidebarData, category });
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", sidebarData.searchTerm);
		urlParams.set("sort", sidebarData.sort);
		urlParams.set("category", sidebarData.category);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

	const handleShowMore = async () => {
		const numberOfPosts = posts.length;
		const startIndex = numberOfPosts;
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("startIndex", startIndex);
		const searchQuery = urlParams.toString();
		const res = await fetch(`/api/post/getposts?${searchQuery}`);
		if (!res.ok) {
			return;
		}
		if (res.ok) {
			const data = await res.json();
			setPosts([...posts, ...data.posts]);
			if (data.posts.length === 9) {
				setShowMore(true);
			} else {
				setShowMore(false);
			}
		}
	};

	return (
		<div className=" flex flex-col justify-center my-5">
			<form
				className="flex md:flex-row flex-col justify-center items-center gap-8"
				onSubmit={handleSubmit}
			>
				<div className="flex items-center gap-2">
					<label className="whitespace-nowrap font-semibold">
						{t("search-term")}
					</label>
					<TextInput
						placeholder="Search..."
						id="searchTerm"
						type="text"
						value={sidebarData.searchTerm}
						onChange={handleChange}
					/>
				</div>
				<div className="flex items-center gap-2">
					<label className="font-semibold">{t("sort")}</label>
					<Select onChange={handleChange} value={sidebarData.sort} id="sort">
						<option value="desc"> {t("latest")}</option>
						<option value="asc"> {t("oldest")}</option>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<label className="font-semibold">{t("category")}:</label>
					<Select
						onChange={handleChange}
						value={sidebarData.category}
						id="category"
					>
						<option value="uncategorized"> {t("uncategorized")}</option>

						{categories.map((item, index) => (
							<option value={item} key={index}>
								{item}
							</option>
						))}
					</Select>
				</div>
				<Button type="submit" outline gradientDuoTone="purpleToPink">
					{t("apply-filter")}
				</Button>
			</form>

			<div className="flex flex-col md:mx-auto">
				<h1 className="text-3xl font-semibold sm:border-b border-pink-500 text-pink-600 p-3 mt-5 mx-auto">
					{t("results")}
				</h1>
				<div className="p-7 flex flex-wrap gap-4">
					{!loading && posts.length === 0 && (
						<p className="text-xl text-gray-500">{t("no-post")}</p>
					)}
					{loading && <p className="text-xl text-gray-500">Loading...</p>}
					{!loading &&
						posts &&
						posts.map((post) => <PostCard key={post._id} post={post} />)}
					{showMore && (
						<button
							onClick={handleShowMore}
							className="text-pink-500 text-lg hover:underline p-7 w-full"
						>
							{t("show-more")}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
