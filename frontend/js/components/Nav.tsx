import { Link } from "@inertiajs/react";

const Nav = () => {
    return (
        <div className="container px-10!">
            <nav className="flex items-center space-x-4">
                <Link href="/">Home page</Link>
                <Link href="/about">About page</Link>
                <Link href="/login">Login</Link>
                <Link href="/signup">Signup</Link>
            </nav>
        </div>
    );
};

export default Nav;
