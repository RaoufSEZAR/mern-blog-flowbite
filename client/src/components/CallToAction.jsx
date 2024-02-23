import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CallToAction() {
	const categories = [
		"Nextjs",
		"Angular",
		"React",
		"Nodejs",
		"Javascript",
		"Vue",
	];

	return (
		<div className="flex flex-col sm:flex-row-reverse p-3 border border-pink-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
			<div className="flex-1 justify-center flex flex-col">
				<div className="flex gap-3 flex-wrap my-5">
					{categories.map((category) => (
						<Link
							key={category}
							to={`/search?category=${category}`}
							className="self-center"
						>
							<Button
								color="gray"
								outline
								pill
								className="border-none"
								size="xl"
								gradientDuoTone="purpleToPink"
							>
								#{category}
							</Button>
						</Link>
					))}
				</div>
				<Button
					gradientDuoTone="purpleToPink"
					className="rounded-tl-xl rounded-bl-none"
				>
					<a
						href="https://www.github.com/raoufsezar"
						target="_blank"
						rel="noopener noreferrer"
					>
						All my Projects
					</a>
				</Button>
			</div>
			<div className="p-7 flex-1">
				<img src="https://www.shutterstock.com/image-vector/programming-banner-coding-best-languages-260nw-1078387013.jpg" />
			</div>
		</div>
	);
}
