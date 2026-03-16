import { useState, useEffect } from "react";

import { auth } from "../../SDK/firebase";

import type { ANote } from "../../types/ANote";
import type { CategoryPresence } from "../../types/CategoryPresence";

import { db } from "../../SDK/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import Note from "../Note";
import NoteLoading  from "../NoteLoading";

export default function MyNotes({ category } : CategoryPresence){
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
    );
}