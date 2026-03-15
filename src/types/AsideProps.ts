import type { Category } from "./Category";
import type { User } from "firebase/auth";

export interface AsideProps {
    user: User | null;
    setCategory: (category: Category | null) => void;
}