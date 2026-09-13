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

    // 메인 페이지
    const goMain = () => {
        nav('/');
    }

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
        
        try {
            await deleteDoc(doc(db, "users", uid, "notes", id));
            nav('/');
        } catch {
            setModalMessage("삭제에 실패했습니다.");
            setModalOpen(true);
        }
    }

    return(
        <div>

            <Header/> 
            
            <div 
            className="
                flex flex-col justify-center 
                w-full md:w-200 h-auto 
                mx-auto px-4 md:px-0"

            >
                {note ? (
                    <>
                        <div className="
                            w-full h-auto min-h-100 md:h-120 
                            mt-5 p-4 md:p-5 
                            rounded-2xl 
                            bg-white"
                        >

                            <p className="truncate text-xl md:text-3xl font-bold">
                                {note.title}
                            </p>

                            <p className="mt-2 text-gray-400 text-sm md:text-base">
                                {note.noteDate.toDate().toLocaleDateString()}
                            </p>
                                
                            <div className="
                                w-full h-65 md:h-85 
                                mt-5 
                                overflow-y-scroll 
                                whitespace-pre-wrap 
                                text-sm md:text-base"
                            >
                                {note.content}
                            </div>

                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 md:mt-10 mb-6 md:mb-0">
                            
                            <div>
                                <button 
                                onClick={goMain}
                                className="
                                    gray-btn 
                                    w-full sm:w-28 p-2 
                                    text-lg md:text-xl font-semibold"
                                >
                                    뒤로가기
                                </button>
                            </div>

                            <div className="flex gap-3 sm:gap-5">
                            
                                <button 
                                onClick={goEditPage}
                                className="
                                    black-btn 
                                    flex-1 sm:w-20 sm:flex-none p-2 
                                    text-lg md:text-xl font-semibold"

                                >
                                    수정
                                </button>

                                <button 
                                onClick={deleteModalOpen}
                                className="
                                    red-btn 
                                    flex-1 sm:w-20 sm:flex-none p-2 
                                    text-lg md:text-xl font-semibold"

                                >
                                    삭제
                                </button>

                            </div>

                        </div>
                    </>) : (
                    <>
                        <div className="
                            w-full h-auto min-h-100 md:h-120 
                            mt-5 p-4 md:p-5 
                            rounded-2xl 
                            bg-white"
                        >

                            <div className="
                                w-3/4 md:w-150 h-7.5
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