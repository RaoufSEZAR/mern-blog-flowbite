import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
	HiUser,
	HiArrowSmRight,
	HiDocumentText,
	HiChartPie,
	HiOutlineUserGroup,
	HiAnnotation,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const DashSidebar = () => {
	const location = useLocation();
	const [tab, setTab] = useState("");
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);

	const { t } = useTranslation();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromURL = urlParams.get("tab");
		if (tabFromURL) {
			setTab(tabFromURL);
		}
	}, [location.search]);

	const handleSignout = async () => {
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
		<Sidebar className="w-full md:w-56">
			<Sidebar.Items>
				<Sidebar.ItemGroup className="flex flex-col gap-1">
					{currentUser && currentUser.isAdmin && (
						<Link to="/dashboard?tab=dash">
							<Sidebar.Item
								active={tab === "dash" || !tab}
								icon={HiChartPie}
								as="div"
							>
								{t("dashboard")}
							</Sidebar.Item>
						</Link>
					)}
					<Link to="/dashboard?tab=profile">
						<Sidebar.Item
							active={tab === "profile"}
							icon={HiUser}
							label={
								currentUser && currentUser.isAdmin ? t("admin") : t("user")
							}
							labelColor="dark"
							as={"div"}
						>
							{t("profile")}
						</Sidebar.Item>
					</Link>
					{currentUser && currentUser.isAdmin && (
						<>
							<Link to="/dashboard?tab=posts">
								<Sidebar.Item
									active={tab === "posts"}
									icon={HiDocumentText}
									labelColor="dark"
									as={"div"}
								>
									{t("posts")}
								</Sidebar.Item>
							</Link>
							<Link to="/dashboard?tab=users">
								<Sidebar.Item
									active={tab === "users"}
									icon={HiOutlineUserGroup}
									as="div"
								>
									{t("users")}
								</Sidebar.Item>
							</Link>
							<Link to="/dashboard?tab=comments">
								<Sidebar.Item
									active={tab === "comments"}
									icon={HiAnnotation}
									as="div"
								>
									{t("comments")}
								</Sidebar.Item>
							</Link>
						</>
					)}
					<Sidebar.Item
						onClick={handleSignout}
						icon={HiArrowSmRight}
						className="cursor-pointer"
					>
						{" "}
						{t("sign-out")}
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
};

export default DashSidebar;
