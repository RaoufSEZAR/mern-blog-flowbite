import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "./../components/DashSidebar";
import DashProfile from "./../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DashboardComp";

const Dashboard = () => {
	const location = useLocation();
	const [tab, setTab] = useState("");
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromURL = urlParams.get("tab");
		if (tabFromURL) {
			setTab(tabFromURL);
		}
	}, [location.search]);
	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			<div className="md:w-56">
				{/* sidebar */}
				<DashSidebar />
			</div>
			{/* profile */}
			{tab === "profile" && <DashProfile />}
			{/* posts... */}
			{tab === "posts" && <DashPosts />}
			{/* users */}
			{tab === "users" && <DashUsers />}
			{/* comments  */}
			{tab === "comments" && <DashComments />}
			{/* dashboard comp */}
			{tab === "dash" && <DashboardComp />}
		</div>
	);
};

export default Dashboard;
