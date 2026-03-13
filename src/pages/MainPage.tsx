import type { User } from "firebase/auth";

import Header from "../components/sections/Header";
import Aside from "../components/sections/Aside";
import MyNotes from "../components/sections/MyNotes";

interface Category{
    id: string;
    name: string;
}

interface Props{
    user: User | null;
    category: Category | null;
    setCategory: (category: Category | null) => void;
}


export default function Main({ user, category, setCategory }: Props){
    return(
        <main>
            <Header/>
            
            <div className="flex">

                <Aside 
                user={user} 
                setCategory={setCategory}
                />

                <MyNotes category={category}/>

            </div>
        </main>
    );
}