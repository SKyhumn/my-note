import { useState } from "react";
import type { User } from "firebase/auth";
import type { Category } from "../types/Category";

import Header from "../components/sections/Header";
import Aside from "../components/sections/Aside";
import MyNotes from "../components/sections/MyNotes";

interface Props {
    user: User | null;
    category: Category | null;
    setCategory: (category: Category | null) => void;
}

export default function Main({ user, category, setCategory }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return (
        <main>
            <Header onMenuClick={() => setIsSidebarOpen(true)} />

            <div className="flex relative">
                <Aside
                    user={user}
                    setCategory={setCategory}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                <MyNotes category={category} />
            </div>
        </main>
    );
}