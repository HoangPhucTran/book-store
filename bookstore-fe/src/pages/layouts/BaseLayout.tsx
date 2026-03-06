import { Outlet } from "react-router-dom";
import Header from "../../components/layouts/Header";
import Navbar from "../../components/layouts/Navbar";

export default function BaseLayout() {

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            {/* Body */}
            <div style={{display: 'flex', flex: 1}}>
                <Navbar />

                <main style={{flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center'}}>
                    <Outlet/>
                </main>
            </div>

        </div>
    )
}