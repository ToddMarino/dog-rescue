import Navigation from "./components/Navigation";
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <Navigation />
            <main className="p-4">
                <Outlet />
            </main>
        </>
    )
};

export default Layout;