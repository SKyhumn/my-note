import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../SDK/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, doc, deleteDoc, updateDoc, where, getDocs } from "firebase/firestore";

import type { Category } from "../../types/Category";
import type { AsideProps } from "../../types/AsideProps";

import InputModal from "../modals/InputModal";
import SelectionModal from "../modals/SelectionModal";

import plus from "../../assets/plus.png";
import modify from "../../assets/modify.png";
import del from "../../assets/del.png";

export default function Aside({ user, setCategory }: AsideProps) {
    const [categoryName, setCategoryName] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);

    const [inputModalOpen, setInputModalOpen] = useState<boolean>(false);
    const [selectionModalOpen, setSelectionModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const uid: string | undefined = auth.currentUser?.uid;
    
    const nav = useNavigate();

    // 카테고리 불러오기
    useEffect(() => {
        if (!uid) return;

        const q = query(
            collection(db, "users", uid, "categories"),
            orderBy("createdAt", "asc")
        );

        const loadCategories = onSnapshot(q, (snapshot) => {
            const categoryArray: Category[] = [];

            snapshot.forEach((doc) => {
                categoryArray.push({
                    id: doc.id,
                    name: doc.data().name,
                });
            });

            setCategories(categoryArray);
        });

    return () => loadCategories();
    }, [uid]);

    // 쓰기 페이지로
    const goToWriteNote = () => {
        nav("/write");
    };

    // 카테고리 추가
    const addCategory = async () => {
        if (!uid) return;

        setLoading(true);

        await addDoc(collection(db, "users", uid, "categories"), {
            name: categoryName,
            createdAt: new Date(),
        });

        setLoading(false);
        setInputModalOpen(false);
        setCategoryName("");
    };

    // 수정창 열기
    const openEditModal = (id: string, name: string) => {
        setEditCategoryId(id);
        setCategoryName(name);
        setInputModalOpen(true);
    };

    // 카테고리 수정
    const updateCategory = async () => {
        if (!uid || !editCategoryId) return;

        setLoading(true);

        await updateDoc(doc(db, "users", uid, "categories", editCategoryId), {
            name: categoryName,
        });

        setLoading(false);
        setInputModalOpen(false);
        setEditCategoryId(null);
        setCategoryName("");
    };

    // 카테고리 삭제창
    const openDeleteModal = (id: string, name: string) => {
        setDeleteCategoryId(id);
        setModalMessage(`"${name}" 카테고리를 삭제하시겠습니까?`);
        setSelectionModalOpen(true);
    };

    // 카테고리 삭제
    const deleteCategoryAndClose = async () => {
        if (!uid || !deleteCategoryId) return;

        // 카테고리에 포함하는 문서도 삭제
        const q = query(
            collection(db, "users", uid, "notes"),
            where("categoryId", "==", deleteCategoryId)
        )

        const snapshot = await getDocs(q);

        const deletePromises = snapshot.docs.map((note) => {
            deleteDoc(doc(db, "users", uid, "notes", note.id))
        });

        await Promise.all(deletePromises);

        await deleteDoc(doc(db, "users", uid, "categories", deleteCategoryId));

        setSelectionModalOpen(false);
        setDeleteCategoryId(null);
    };

    // 선택창 닫기
    const closeSelectionModal = () => {
        setSelectionModalOpen(false);
        setDeleteCategoryId(null);
    };

    // 입력창 닫기
    const closeInputModal = () => {
        setInputModalOpen(false);
        setEditCategoryId(null);
        setCategoryName("");
    };

    return (
        <aside className="w-70 h-[calc(100vh-5rem)] pt-11 bg-white">

            <p className="ml-3 text-[1.5rem] font-semibold">
                {user?.displayName ?? "사용자"}님, 환영합니다.
            </p>

            <button
            onClick={goToWriteNote}
            className="
                black-btn 
                flex justify-center items-center 
                w-64 h-12 mt-6 ml-3 
                text-xl"
            >
                <img src={plus} className="w-4 h-4 mr-3"/>
                노트 작성
            </button>

            <button
            onClick={() => setInputModalOpen(true)}
            className="
                black-btn 
                flex justify-center items-center 
                w-64 h-12 
                mt-6 ml-3 
                text-xl"
            >

                <img src={plus} className="w-4 h-4 mr-3" />
                카테고리 작성

            </button>

            <p className="ml-3 mt-6 text-[1.2rem] font-semibold">
                카테고리
            </p>

            <ul className="overflow-y-auto w-64 h-80 ml-3">
                <li onClick={() => setCategory(null)} className="mt-4 font-medium cursor-pointer">전체 노트</li>

                {categories.map((category) => (
                    <li
                    key={category.id}
                    onClick={() => setCategory(category)}
                    className="
                        flex justify-between items-center 
                        mt-4 
                        font-medium"
                    >
                        <p className="truncate w-20">
                            {category.name}
                        </p>
                        
                        <span className="flex justify-between w-16">

                            <img
                            src={modify}
                            onClick={() => openEditModal(category.id, category.name)}
                            className="w-4 cursor-pointer"
                            />

                            <img
                            src={del}
                            onClick={() => openDeleteModal(category.id, category.name)}
                            className="w-4 cursor-pointer"
                            />

                        </span>

                    </li>
                ))}
            </ul>

            {inputModalOpen && (
                <InputModal
                message={editCategoryId ? "카테고리 수정" : "카테고리 추가"}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                loading={loading}
                addCategoryAndClose={editCategoryId ? updateCategory : addCategory}
                onClose={closeInputModal}
                />
            )}

            {selectionModalOpen && (
                <SelectionModal
                message={modalMessage}
                yes={deleteCategoryAndClose}
                no={closeSelectionModal}
                />
            )}
        </aside>
    );
}