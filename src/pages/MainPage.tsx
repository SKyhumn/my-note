import type { MainPageProps } from "../types/MainPageProps";

import Header from "../components/sections/Header";
import Aside from "../components/sections/Aside";
import MyNotes from "../components/sections/MyNotes";

export default function Main({ user, category, setCategory } : MainPageProps){
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