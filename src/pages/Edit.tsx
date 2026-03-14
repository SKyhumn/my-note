import { useState, useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { auth } from "../SDK/firebase";

import { db } from "../SDK/firebase";
import { getDoc, updateDoc, doc, Timestamp } from "firebase/firestore";

import Header from "../components/sections/Header";
import Modal from "../components/modals/Modal";

interface Category{
    id: string;
    name: string;
}

interface Note {
    title: string;
    content: string;
    createdAt: Timestamp;
    categoryId: string | null;
}

interface Props{
    category: Category | null;
}

export default function Edit({ category } : Props){
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const [loading, setLoading] = useState<boolean> (false);

    const [modalOpen, setModalOpen] = useState<boolean> (false);
    const [modalMessage, setModalMessage] = useState<string> ("");

    const nav = useNavigate();

    const { id } = useParams();

    const uid: string | undefined = auth.currentUser?.uid;

    const isDisabled = loading || title.trim().length === 0;

    if (!id) return null;

    useEffect(() => {
        const getNote = async() => {
            if (!uid || !id) return;

            const noteRef = doc(db, "users", uid, "notes", id);
            const snapshot = await getDoc(noteRef);

            if (snapshot.exists()) {
                const data: Note = snapshot.data() as Note;

                setTitle(data.title);
                setContent(data.content);
            }
        }

        getNote();
    }, [uid, id]);

    const saveNote = async() => {
        if (!uid || title.trim().length === 0) return;

        setLoading(true);

        setModalOpen(false);
        setModalMessage("");

        await updateDoc(doc(db, "users", uid, "notes", id), {
            title:title,
            content:content,
            noteDate:new Date(),
            categoryId:category?.id ?? null
        });

        setModalOpen(true);
        setModalMessage("저장 되었습니다!");
    }

    const closeAndGoMain = () => {
        setModalOpen(false);
        goMain();
    }

    const goMain = () => {
        nav('/');
    }

    return(
        <div>

            <Header/>

            <div className="w-200 h-auto mx-auto">

                <p className="mt-10 text-xl">
                    제목
                </p>

                <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="
                    w-full h-10 
                    mt-5 pl-4 
                    border border-gray-400 rounded-xl 
                    bg-white"
                />

                <p className="mt-8 text-xl">
                    내용
                </p>

                <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                className="
                    w-full h-75 
                    pt-4 pl-4 mt-5 
                    border border-gray-400 
                    rounded-xl 
                    bg-white 
                    resize-none"
                />

                <div className="flex justify-end w-full mt-5">

                    <button 
                    onClick={goMain} 
                    disabled={loading} 
                    className="
                        gray-btn 
                        h-10 
                        pl-4 pr-4 
                        text-xl 
                        cursor-pointer"
                    >
                        뒤로가기
                    </button>

                    <button 
                    onClick={saveNote} 
                    disabled={isDisabled} 
                    className={`
                        h-10 
                        ml-5 pl-4 pr-4  
                        text-xl cursor-pointer
                        ${!isDisabled ? "black-btn" : "gray-btn"}
                    `}>
                        저장하기
                    </button>

                </div>

            </div>

            {modalOpen &&
            <Modal 
            message={modalMessage} 
            onClose={closeAndGoMain}/>}
        
        </div>
    );
}