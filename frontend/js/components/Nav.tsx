import { Link, usePage } from '@inertiajs/react';

const Nav = () => {
    const { user } = usePage().props;
    return (
        <div className="container px-10!">
            <nav className="flex items-center space-x-4">
                <Link href="/">Home page</Link>

                {user ? (
                    <>
                        <Link href="/dashboard">Dashboard</Link>
                        <Link href="/signout">Logout</Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">Login</Link>
                        <Link href="/signup">Signup</Link>
                    </>
                )}
            </nav>
        </div>
    );
};

export default Nav;
