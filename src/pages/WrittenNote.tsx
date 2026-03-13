import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import { auth } from "../SDK/firebase";
import { onAuthStateChanged } from "firebase/auth";

import { db } from "../SDK/firebase";
import { getDoc, doc, Timestamp } from "firebase/firestore";

import Header from "../components/sections/Header";

interface Note {
    title: string;
    content: string;
    createdAt: Timestamp;
    categoryId: string | null;
}

export default function WrittenNote(){
    const [note, setNote] = useState<Note | null>(null);

    const { id } = useParams();

    if (!id) return null;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user || !id) return;

            const noteRef = doc(db, "users", user.uid, "notes", id);
            const snapshot = await getDoc(noteRef);

            if (snapshot.exists()) {
                setNote(snapshot.data() as Note);
            }
        });

        return () => unsubscribe();
    }, [id]);

    return(
        <div>

            <Header/> 

            {!note ? (
                <p>Loading...</p>
            ) : (
                <div 
                className="
                    flex flex-col justify-center 
                    w-200 h-auto 
                    mx-auto"
                >

                    <div className="w-full h-120 mt-5 p-5 rounded-2xl bg-white">

                        <p className="text-3xl font-bold">
                            {note.title}
                        </p>

                        <p className="mt-2 text-gray-400">
                            {note.createdAt.toDate().toLocaleDateString()}
                        </p>
                        
                        <div className="w-full h-85 mt-5 overflow-y-scroll">
                            {note.content}
                        </div>

                    </div>

                    <div className="flex justify-end mt-10">

                        <button 
                        className="
                            black-btn 
                            w-20 p-2 mr-5 
                            text-xl font-semibold"
                        >
                            수정
                        </button>

                        <button 
                        className="
                            red-btn 
                            w-20 p-2 
                            text-xl font-semibold"
                        >
                            삭제
                        </button>
                    </div>

                </div>
            )}

        </div>
    );
}