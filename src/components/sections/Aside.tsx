import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../SDK/firebase";
import { collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, where, onSnapshot } from "firebase/firestore";

import type { Category } from "../../types/Category";
import type { User } from "firebase/auth";

import Modal from "../modals/Modal";
import InputModal from "../modals/InputModal";
import SelectionModal from "../modals/SelectionModal";

import plus from "../../assets/plus.png";
import modify from "../../assets/modify.png";
import del from "../../assets/del.png";


interface Props {
    user: User | null;
    setCategory: (category: Category | null) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function Aside({ user, setCategory, isOpen, onClose }: Props) {
    const [categoryName, setCategoryName] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
    const [isSelectionModalOpen, setIsSelectionModalOpen] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>("");

    const [editCategoryId, setEditCategoryId] = useState<string | null>(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null);

    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

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
    const addCategory = async() => {
        if (!uid) return;

        try {
            setLoading(true);

            const categoryRef = collection(db, "users", uid, "categories");
            await addDoc(categoryRef, {
                name: categoryName,
                createdAt: new Date(),
            });
        } catch {
            setIsModalOpen(true);
        }

        setLoading(false);
        setIsInputModalOpen(false);
        setCategoryName("");
    };

    // 수정창 열기
    const openEditModal = (id: string, name: string) => {
        setEditCategoryId(id);
        setCategoryName(name);
        setIsInputModalOpen(true);
    };

    // 카테고리 수정
    const updateCategory = async() => {
        if (!uid || !editCategoryId) return;

        try {
            setLoading(true);

            const categoryRef = doc(db, "users", uid, "categories", editCategoryId)
            await updateDoc(categoryRef, {
                name: categoryName,
            });
        } catch {
            setIsModalOpen(true);
            setModalMessage("수정에 실패했습니다.");
        }
        
        setLoading(false);
        setIsInputModalOpen(false);
        setEditCategoryId(null);
        setCategoryName("");
    };

    // 카테고리 삭제창
    const openDeleteModal = (id: string, name: string) => {
        setDeleteCategoryId(id);
        setModalMessage(`"${name}" 카테고리를 삭제하시겠습니까?`);
        setIsSelectionModalOpen(true);
    };

    // 카테고리 삭제
    const deleteCategoryAndClose = async() => {
        if (!uid || !deleteCategoryId) return;

        try {

            const q = query(
                collection(db, "users", uid, "notes"),
                where("categoryId", "==", deleteCategoryId)
            );

            const snapshot = await getDocs(q);

            const deletePromises = snapshot.docs.map((note) =>
                deleteDoc(doc(db, "users", uid, "notes", note.id))
            );

            await Promise.all(deletePromises);

            await deleteDoc(doc(db, "users", uid, "categories", deleteCategoryId));

            setIsSelectionModalOpen(false);
            setDeleteCategoryId(null);

        } catch {
            setIsSelectionModalOpen(false);

            setModalMessage("카테고리 삭제에 실패했습니다.");
            setIsModalOpen(true);
        }
    };

    // 선택창 닫기
    const closeSelectionModal = () => {
        setIsSelectionModalOpen(false);
        setDeleteCategoryId(null);
    };

    // 입력창 닫기
    const closeInputModal = () => {
        setIsInputModalOpen(false);
        setEditCategoryId(null);
        setCategoryName("");
    };

    // 카테고리 선택 (모바일에서는 선택 후 드로어 닫기)
    const handleSelectCategory = (category: Category | null) => {
        setCategory(category);
        setSelectedCategoryId(category?.id ?? null);
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                />
            )}

            <aside className={`
                fixed md:static top-0 left-0 
                z-50 md:z-0
                w-72 md:w-70 h-screen md:h-[calc(100vh-5rem)]
                bg-white
                shadow-xl md:shadow-none
                transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
                overflow-y-auto`}
            >

                <div className="flex items-center justify-between px-4 pt-5 md:hidden">
                    <button
                    onClick={onClose}
                    className="text-2xl leading-none p-1 -ml-1"
                    aria-label="메뉴 닫기"
                >
                        ✕
                    </button>
                </div>

                <p className="
                    break-keep
                    px-4 md:px-0 md:ml-3
                    mt-3 md:mt-11
                    text-[1.25rem] md:text-[1.5rem] font-semibold leading-snug"
                >
                    {user?.displayName ?? "사용자"}님, 환영합니다.
                </p>

                <div className="px-4 md:px-0">

                    <button
                    onClick={goToWriteNote}
                    className="
                        black-btn 
                        flex justify-center items-center 
                        w-full md:w-64 h-12 mt-6 md:ml-3
                        text-xl"
                    >

                        <img src={plus} className="w-4 h-4 mr-3"/>
                        노트 작성

                    </button>

                    <button
                    onClick={() => setIsInputModalOpen(true)}
                    className="
                        black-btn 
                        flex justify-center items-center 
                        w-full md:w-64 h-12 
                        mt-4 md:mt-6 md:ml-3
                        text-xl"
                    >

                        <img src={plus} className="w-4 h-4 mr-3" />
                        카테고리 작성

                    </button>

                </div>

                <p className="px-4 md:px-0 md:ml-3 mt-6 text-[1.2rem] font-semibold">
                    카테고리
                </p>

                <ul className="overflow-y-auto w-full md:w-64 md:ml-3 px-2 md:px-0 pb-6">

                    <li
                    onClick={() => handleSelectCategory(null)}
                    className={`
                        mt-2
                        px-3 py-3
                        rounded-lg
                        font-medium
                        cursor-pointer
                        ${selectedCategoryId === null ? "bg-gray-100" : "hover:bg-gray-50"}`}
                    >
                        전체 노트
                    </li>


                    {categories.map((category) => (
                        <li
                        key={category.id}
                        onClick={() => handleSelectCategory(category)}
                        className={`
                            flex justify-between items-center 
                            mt-2
                            px-3 py-2
                            rounded-lg
                            font-medium
                            cursor-pointer
                            ${selectedCategoryId === category.id ? "bg-gray-100" : "hover:bg-gray-50"}`}
                        >
                            <p className="truncate flex-1">
                                {category.name}
                            </p>
                            
                            <span className="flex items-center gap-3 ml-2">

                                <button
                                onClick={(e) => { e.stopPropagation(); openEditModal(category.id, category.name); }}
                                className="p-2 -m-2"
                                aria-label="카테고리 수정"
                                >
                                    <img src={modify} className="w-4"/>
                                </button>

                                <button
                                onClick={(e) => { e.stopPropagation(); openDeleteModal(category.id, category.name); }}
                                className="p-2 -m-2"
                                aria-label="카테고리 삭제"
                                >
                                    <img src={del} className="w-4"/>
                                </button>

                            </span>

                        </li>
                    ))}

                </ul>

                {isModalOpen && (
                    <Modal
                    message={modalMessage}
                    onClose={() => setIsModalOpen(false)}
                    />
                )}

                {isInputModalOpen && (
                    <InputModal
                    message={editCategoryId ? "카테고리 수정" : "카테고리 추가"}
                    categoryName={categoryName}
                    setCategoryName={setCategoryName}
                    loading={loading}
                    addCategoryAndClose={editCategoryId ? updateCategory : addCategory}
                    onClose={closeInputModal}
                    />
                )}

                {isSelectionModalOpen && (
                    <SelectionModal
                    message={modalMessage}
                    yes={deleteCategoryAndClose}
                    no={closeSelectionModal}
                    />
                )}
            </aside>
        </>
    );
}