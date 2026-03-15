import type { InputModalProps } from "../../types/InputModalProps";

export default function InputModal({ message, categoryName, setCategoryName, loading, addCategoryAndClose, onClose } : InputModalProps) {
    const isDisabled = categoryName.trim().length === 0 || loading;

    return (
    <div className="
        flex justify-center items-center 
        fixed inset-0 z-10 
        bg-black/50"
    >

        <div className="
            flex flex-col justify-center items-center 
            w-120 h-60 
            rounded-2xl 
            bg-white 
            animate-modal-on"
        >

            <p className="mb-5 text-3xl font-semibold text-center">
                {message}
            </p>

            <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="
                w-100 
                px-4 py-2 
                border-2 border-gray-300 rounded-3xl"
            />

            <div className="flex justify-between translate-y-5 w-50">
                <button
                disabled={isDisabled}
                onClick={addCategoryAndClose}
                className={`
                    w-20
                    p-2
                    text-xl
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
                    w-20 p-2 
                    text-xl font-semibold 
                    cursor-pointer"
                >
                    닫기
                </button>

            </div>

        </div>
        
    </div>
  );
}