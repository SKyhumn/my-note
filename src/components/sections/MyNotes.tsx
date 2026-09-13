import { useState, useEffect } from "react";

import { auth } from "../../SDK/firebase";

import type { ANote } from "../../types/ANote";
import type { Category } from "../../types/Category";

import { db } from "../../SDK/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Note from "../Note";
import NoteLoading from "../NoteLoading";

interface Props {
    category: Category | null;
}

export default function MyNotes({ category }: Props){
    const [notes, setNotes] = useState<ANote[]>([]);

    const [search, setSearch] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(true);

    const uid: string | undefined = auth.currentUser?.uid;

    // 노트 불러오기
    useEffect(() => { 
        if (!uid) return;

        const q = query(
            collection(db, "users", uid, "notes"),
            orderBy("noteDate", "desc")
        )

        const loadNotes = onSnapshot(q, (snapshot) => {
            const noteArray: ANote[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data() as Omit<ANote, "id">;
                noteArray.push({
                    id:doc.id,
                    ...data
                });
            });

            setNotes(noteArray);
            setLoading(false);
        })

        return () => loadNotes();
    }, [uid]);

    // 노트 필터
    const filteredNotes = notes.filter((note) =>{
        const matchCategory: boolean =
            category === null || note.categoryId === category.id;

        const matchSearch: boolean =
            note.title.toLowerCase().includes(search.toLowerCase());

        return matchCategory && matchSearch;
    });

    return(
        <div className="flex-1 w-full md:w-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">

            <div className="flex flex-col sm:flex-row items-start sm:items-center px-4 md:px-0">

                <p className="md:ml-10 mt-6 md:mt-10 text-xl md:text-2xl font-semibold">
                    {category ? category.name : "전체 노트"} ({filteredNotes.length})
                </p>

                <input 
                type="text" 
                placeholder="검색" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="
                    w-full sm:w-80 h-10 
                    mt-3 sm:mt-10 sm:ml-20 pl-4 
                    border-2 border-black rounded-3xl 
                    bg-white"
                />

            </div>

            <div className="overflow-y-auto w-full h-[80%] md:h-[87%]">
                <div className="
                    grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 
                    p-4 md:p-10"
                >

                    {loading ? (
                        <>
                            <NoteLoading/>
                            <NoteLoading/>
                            <NoteLoading/>
                            <NoteLoading/>
                            <NoteLoading/>
                            <NoteLoading/>
                            <NoteLoading/>
                            <NoteLoading/>
                            <NoteLoading/>
                        </>
                    ) : (
                        filteredNotes.map((note) => (
                            <Note 
                            key={note.id} 
                            id={note.id} 
                            title={note.title} 
                            noteDate={note.noteDate}
                            />
                        ))
                    )}
                    
                </div>
            </div>

        </div>
    );
}