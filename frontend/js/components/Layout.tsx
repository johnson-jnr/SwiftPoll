import { Link } from "@inertiajs/react";
import Nav from "./Nav";
import Footer from "./Footer";

const Layout = ({ children }) => (
	<>
		{/* <div>
			<nav className="flex items-start justify-center">
				<ul className="flex space-x-4">
					<li>
						<Link href="/">Home</Link>
					</li>
				</ul>
			</nav>
			<div className="flex items-center justify-center mt-32">{children}</div>
		</div> */}

        <div className="min-h-screen grid grid-flow-row grid-rows-[auto_1fr_auto]">
            <Nav />
            <main className="container mx-auto">{children}</main>
            <Footer />
        </div>
	</>
);

export default (page) => <Layout>{page}</Layout>;
