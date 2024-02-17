import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/projects" element={<Projects />} />
				<Route path="/sign-in" element={<Signin />} />
				<Route element={<PrivateRoutes />}>
					<Route path="/dashboard" element={<Dashboard />} />
				</Route>
				<Route path="/sign-up" element={<Signup />} />
			</Routes>
			<FooterCom />
		</BrowserRouter>
	);
}

export default App;
