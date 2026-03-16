import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { auth, db } from "../SDK/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import type { CategoryPresence } from "../types/CategoryPresence";
import type { ANote } from "../types/ANote";

import Header from "../components/sections/Header";
import Modal from "../components/modals/Modal";

export default function Edit({ category }: CategoryPresence) {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const { id } = useParams();
    
    const user = auth.currentUser;
    const uid = user?.uid;

    const nav = useNavigate();
    if (!id) return null;

    const isDisabled = loading || title.trim().length === 0;

    const goMain = () => nav("/");

    // 노트 불러오기
    useEffect(() => {
        const loadNote = async () => {
            if (!uid || !id) return;

            try {
                const noteRef = doc(db, "users", uid, "notes", id);
                const snapshot = await getDoc(noteRef);

                if (snapshot.exists()) {
                    const data: ANote = snapshot.data() as ANote;

                    setTitle(data.title);
                    setContent(data.content);
                } else {
                    setModalMessage("노트를 찾을 수 없습니다.");
                    setIsModalOpen(true);
                }
            } catch (error) {
                console.error(error);
                setModalMessage("노트 불러오기에 실패했습니다.");
                setIsModalOpen(true);
            }
        };

        loadNote();
    }, [uid, id]);

    // 노트 저장
    const saveNote = async () => {
        if (!uid || !id || title.trim().length === 0) return;

        setLoading(true);
        setIsModalOpen(false);
        setModalMessage("");

        try {
            const noteRef = doc(db, "users", uid, "notes", id);
            await updateDoc(noteRef, {
                title: title,
                content: content,
                noteDate: new Date(),
                categoryId: category?.id ?? null,
            });

            setModalMessage("저장 되었습니다!");
            setIsModalOpen(true);
        } catch {
            setModalMessage("저장에 실패했습니다.");
            setIsModalOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const closeAndGoMain = () => {
        setIsModalOpen(false);
        goMain();
    };

    return (
        <div>

            <Header />

            <div className="w-200 h-auto mx-auto">

                <p className="mt-10 text-xl">제목</p>

                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 mt-5 pl-4 border border-gray-400 rounded-xl bg-white"
                />

                <p className="mt-8 text-xl">내용</p>

                <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-75 pt-4 pl-4 mt-5 border border-gray-400 rounded-xl bg-white resize-none"
                />

                <div className="flex justify-end w-full mt-5">

                <button
                    onClick={goMain}
                    disabled={loading}
                    className="gray-btn h-10 pl-4 pr-4 text-xl cursor-pointer"
                >
                    뒤로가기
                </button>

                <button
                    onClick={saveNote}
                    disabled={isDisabled}
                    className={`h-10 ml-5 pl-4 pr-4 text-xl cursor-pointer ${
                    !isDisabled ? "black-btn" : "gray-btn"
                    }`}
                >
                    저장하기
                </button>

                </div>

            </div>

            {isModalOpen && 
            <Modal 
            message={modalMessage} 
            onClose={closeAndGoMain} 
            />}

        </div>
    );
}