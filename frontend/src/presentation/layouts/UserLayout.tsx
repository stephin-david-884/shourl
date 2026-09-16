import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface UserLayoutProps {
    children: ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setIsSidebarOpen((previous) => !previous);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50 text-neutral-900">
            {/* Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />

            {/* Main Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                <Header toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserLayout;