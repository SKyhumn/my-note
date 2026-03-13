import { useState, useEffect } from "react";

import { auth } from "../../SDK/firebase";

import { db } from "../../SDK/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Note from "../Note";

interface Category{
    id:string
    name:string
}

interface Props{
    category: Category | null
}

export default function MyNotes({ category }: Props){
    const [notes, setNotes] = useState<any[]> ([]);

    const [search, setSearch] = useState<string> ("");

    const uid: string | undefined = auth.currentUser?.uid;

    useEffect(() => { 
        if (!uid) return;

        const q = query(
            collection(db, "users", uid, "notes"),
            orderBy("createdAt", "desc")
        )

        const getNote = onSnapshot(q, (snapshot) => {
            const noteArray: any[] = [];

            snapshot.forEach((doc) => {
                noteArray.push({
                    id:doc.id,
                    ...doc.data()
                });
            });

            setNotes(noteArray);
        })

        return () => getNote();
    }, [uid]);

    const filteredNotes = notes.filter((note) =>{
        const matchCategory: boolean =
            category === null || note.categoryId === category.id;

        const matchSearch: boolean =
            note.title.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return(
        <div className="w-[calc(100vw-17.5rem)] h-[calc(100vh-5rem)]">

            <div className="flex items-center">

                <p className="ml-10 mt-10 text-2xl font-semibold">
                    {category ? category.name : "전체 노트"} ({filteredNotes.length})
                </p>

                <input 
                type="text" 
                placeholder="검색" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="
                    w-80 h-10 
                    mt-10 ml-20 pl-4 
                    border-2 border-black rounded-3xl 
                    bg-white"
                />

            </div>

            <div className="
                grid grid-cols-3 gap-12 
                overflow-y-auto 
                w-full h-[87%] 
                p-10"
            >

                {filteredNotes.map((note) => (
                    <Note 
                    key={note.id} 
                    id={note.id} 
                    title={note.title} 
                    createdAt={note.createdAt}
                    />
                ))}

            </div>

        </div>
    );
}