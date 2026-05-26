import Navigation from "./components/Navigation";
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Navigation />
            <main className="px-6 pt-2">
                <Outlet />
            </main>
        </>
    )
};

export default Layout;