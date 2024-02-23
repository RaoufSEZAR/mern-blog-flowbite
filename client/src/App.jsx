import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Articles from "./pages/Articles";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoutes from "./components/PrivateRoutes";
import OnlyAdminPrivateRoutes from "./components/OnlyAdminPrivateRoutes";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/articles" element={<Articles />} />
				<Route path="/sign-in" element={<Signin />} />
				<Route path="/post/:postSlug" element={<PostPage />} />
				<Route path="/search" element={<Search />} />
				<Route element={<PrivateRoutes />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
				<Route element={<OnlyAdminPrivateRoutes />}>
					<Route path="/create-post" element={<CreatePost />} />
					<Route path="/update-post/:postId" element={<UpdatePost />} />
				</Route>
				<Route path="/sign-up" element={<Signup />} />
			</Routes>
			<FooterCom />
		</BrowserRouter>
	);
}

export default App;
