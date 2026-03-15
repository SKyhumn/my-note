import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { auth } from "../SDK/firebase";

import { db } from "../SDK/firebase";
import { deleteDoc, doc } from "firebase/firestore";

import type { NoteSummary } from "../types/NoteSummary";

import SelectionModal from "./modals/SelectionModal";

import modify from "../assets/modify.png"
import del from "../assets/del.png";


export default function Note({ id, title, noteDate } : NoteSummary){
    const [modalOpen, setModalOpen] = useState<boolean> (false);
    const [message, setMessage] = useState<string> ("");

    const uid: string | undefined = auth.currentUser?.uid;

    const date = noteDate.toDate();

    const nav = useNavigate();

    // 노트 확인 페이지
    const seeMyNote = () => {
        nav(`/${id}`);
    }

    // 노트 수정 페이지
    const goEditPage = (e: React.MouseEvent) => {
        e.stopPropagation();
        nav(`/${id}/edit`);
    }

    // 삭제여부창 활성화
    const deleteNote = (e: React.MouseEvent) => {
        e.stopPropagation();
        setModalOpen(true);
        setMessage("노트를 삭제하시겠습니까?");
    }

    // 창 닫고 삭제
    const closeAndDelete = async()=> {
        if (!uid) return;

        await deleteDoc(
            doc(db, "users", uid, "notes", id)
        );

        setModalOpen(false);
    }

    return(
        <div
        onClick={seeMyNote}
        className="
            w-88 h-40 
            rounded-xl 
            bg-white 
            cursor-pointer"
        >

            <p className="
                truncate w-72 
                ml-6 mt-6 
                text-4xl font-semibold"
            >
                {title}
            </p>

            <p className="ml-6 mt-2 text-gray-400">
                {date.toLocaleDateString()}
            </p>
            
            <div className="
                flex justify-between 
                relative top-7 left-65 
                w-15"
            >

                <img 
                src={modify} 
                onClick={goEditPage}
                className="w-5 cursor-pointer"
                />

                <img 
                src={del} 
                onClick={deleteNote} 
                className="w-5 cursor-pointer"
                />

            </div>

            {modalOpen &&
            <SelectionModal 
            message={message} 
            yes={closeAndDelete} 
            no={() => setModalOpen(false)}
            />}

        </div>
    );
}