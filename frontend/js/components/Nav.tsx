import { Link, usePage } from '@inertiajs/react';
import { ModeToggle } from '@/components/ModeToggle';

const Nav = () => {
    const { user } = usePage().props;
    return (
        <div className="py-4 px-10">
            <nav className="flex justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/">Home</Link>

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
                </div>
                <ModeToggle />
            </nav>
        </div>
    );
};

export default Nav;
