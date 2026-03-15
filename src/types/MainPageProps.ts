import type { Category } from "./Category";
import type { User } from "firebase/auth";

export interface MainPageProps {
    user: User | null;
    category: Category | null;
    setCategory: (category: Category | null) => void;
}