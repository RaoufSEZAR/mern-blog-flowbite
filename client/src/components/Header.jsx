/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signoutSuccess } from "../redux/user/userSlice";
import { useTranslation } from "react-i18next";
import { MdOutlineLanguage } from "react-icons/md";

const Header = () => {
	const path = useLocation().pathname;
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user);
	const { theme } = useSelector((state) => state.theme);
	const [searchTerm, setSearchTerm] = useState("");
	const { t, i18n } = useTranslation();

	const changeLanguage = (language) => {
		i18n.changeLanguage(language);
		localStorage.setItem("prefered-language", language);
	};
	useEffect(() => {
		// Check if language preference exists in local storage
		const storedLanguage = localStorage.getItem("prefered-language");
		if (storedLanguage) {
			i18n.changeLanguage(storedLanguage); // Set language from local storage
		}
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};

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
		<Navbar className="border-b-2">
			<Link
				to="/"
				className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
			>
				<span className="px-2 py-1 bg-gradient-to-r bg-pink-500 rounded-lg text-white">
					Raouf Satto
				</span>
			</Link>
			<form onSubmit={handleSubmit}>
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:inline"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</form>
			<Button className="w-12 h-10 lg:hidden" color="gray" pill>
				<AiOutlineSearch />
			</Button>
			<div className="flex gap-2 md:order-2">
				<div className="flex gap-1">
					<Dropdown
						arrowIcon={false}
						inline
						label={<MdOutlineLanguage color="purple" className="w-9 h-9" />}
					>
						<Dropdown.Item onClick={() => changeLanguage("en")}>
							EN
						</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item onClick={() => changeLanguage("tr")}>
							TR
						</Dropdown.Item>
					</Dropdown>
				</div>
				<Button
					className="w-12 h-10 sm:inline hidden"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}
				>
					{theme === "light" ? <FaSun /> : <FaMoon />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar alt="user" img={currentUser.profilePicture} rounded />
						}
					>
						<Dropdown.Header>
							<span className="block text-sm">@{currentUser.username}</span>
							<span className="block text-sm font-medium truncate">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={"/dashboard?tab=profile"}>
							<Dropdown.Item>{t("profile")}</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item onClick={handleSignout}>
							{t("sign-out")}
						</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in">
						<Button gradientDuoTone="purpleToBlue" outline>
							{t("sign-in")}
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				<Navbar.Link active={path === "/"} as={"div"}>
					<Link to="/">{t("home")}</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/about"} as={"div"}>
					<Link to="/about">{t("about")}</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/articles"} as={"div"}>
					<Link to="/articles"> {t("articles")}</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
