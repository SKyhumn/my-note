
import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { auth } from "../SDK/firebase";

import { db } from "../SDK/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";

import type { ANote } from "../types/ANote";

import Header from "../components/sections/Header";
import SelectionModal from "../components/modals/SelectionModal";

export default function WrittenNote(){
    const [note, setNote] = useState<ANote | null>(null);

    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const { id } = useParams();

    const uid: string | undefined = auth.currentUser?.uid;

    const nav = useNavigate();

    if (!id) return null;

    // 노트 불러오기
    useEffect(() => {
        const loadNotes = async() => {
            if (!uid || !id) return;

            const noteRef = doc(db, "users", uid, "notes", id);
            const snapshot = await getDoc(noteRef);

            if (snapshot.exists()) {
                setNote(snapshot.data() as ANote);
            }
        };

        loadNotes();
    }, [id]);

    // 노트 수정 페이지
    const goEditPage = () => {
        nav(`/${id}/edit`);
    }

    // 노트 삭제 선택 창
    const deleteModalOpen = () => {
        setModalOpen(true);
        setModalMessage("노트를 삭제하시겠습니까?");
    }

    // 삭제 후 메인 페이지로 이동
    const deleteAndGoMain = async() => {
        if (!uid || !id) return;
         
        await deleteDoc(doc(db, "users", uid, "notes", id));

        nav('/');
    }

    return(
        <div>

            <Header/> 
            
            <div 
            className="
                flex flex-col justify-center 
                w-200 h-auto 
                mx-auto"
            >
                {note ? (
                    <>
                        <div className="
                            w-full h-120 
                            mt-5 p-5 
                            rounded-2xl 
                            bg-white"
                        >

                            <p className="text-3xl font-bold">
                                {note.title}
                            </p>

                            <p className="mt-2 text-gray-400">
                                {note.noteDate.toDate().toLocaleDateString()}
                            </p>
                                
                            <div className="
                                w-full h-85 
                                mt-5 
                                overflow-y-scroll 
                                whitespace-pre-wrap"
                            >
                                {note.content}
                            </div>

                        </div>

                        <div className="flex justify-end mt-10">

                            <button 
                            onClick={goEditPage}
                            className="
                                black-btn 
                                w-20 p-2 mr-5 
                                text-xl font-semibold"
                            >
                                수정
                            </button>

                            <button 
                            onClick={deleteModalOpen}
                            className="
                                red-btn 
                                w-20 p-2 
                                text-xl font-semibold"
                            >
                                삭제
                            </button>
                        </div>
                    </>) : (
                    <>
                        <div className="
                            w-full h-120 
                            mt-5 p-5 
                            rounded-2xl 
                            bg-white"
                        >

                            <div className="
                                w-150 h-7.5
                                rounded-3xl
                                bg-gray-200
                            "/>

                            <div className="
                                w-20 h-4 
                                mt-4 
                                rounded-2xl 
                                bg-gray-200"
                            />

                        </div>
                    </>
                )}

            </div>
            

            {modalOpen && <SelectionModal 
            message={modalMessage} 
            yes={deleteAndGoMain} 
            no={() => setModalOpen(false)}
            />}

        </div>
    );
}