import { createPortal } from "react-dom";

interface Props {
    message: string;
    categoryName: string;
    setCategoryName: (value: string) => void;
    loading: boolean;
    addCategoryAndClose: () => void;
    onClose: () => void;
}

export default function InputModal({ message, categoryName, setCategoryName, loading, addCategoryAndClose, onClose } : Props) {
    const isDisabled = categoryName.trim().length === 0 || loading;

    return createPortal(
        <div className="
            flex justify-center items-center 
            fixed inset-0 z-100 
            px-4
            bg-black/50"
        >

            <div className="
                flex flex-col justify-center items-center 
                w-full max-w-100 h-auto 
                px-6 py-8
                rounded-2xl 
                bg-white 
                animate-modal-on"
            >

                <p className="mb-5 text-xl sm:text-2xl md:text-3xl font-semibold text-center break-keep">
                    {message}
                </p>

                <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="
                    w-full 
                    px-4 py-2 
                    border-2 border-gray-300 rounded-3xl"
                />

                <div className="flex justify-between gap-4 mt-6 sm:mt-8 w-full max-w-50">
                    <button
                    disabled={isDisabled}
                    onClick={addCategoryAndClose}
                    className={`
                        flex-1
                        p-2
                        text-lg md:text-xl
                        font-semibold
                        cursor-pointer
                        ${isDisabled ? "gray-btn" : "black-btn"}`}
                    >
                        확인
                    </button>

                    <button
                    disabled={loading}
                    onClick={onClose}
                    className="
                        gray-btn 
                        flex-1 p-2 
                        text-lg md:text-xl font-semibold 
                        cursor-pointer"
                    >
                        닫기
                    </button>

                </div>

            </div>
            
        </div>,
        document.body
    );
}