import { createPortal } from "react-dom";

interface Props {
    message: string;
    onClose: () => void;
}

export default function Modal({ message, onClose } : Props){
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

                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-center break-keep">
                    {message}
                </p>

                <button 
                onClick={onClose} 
                className="
                    black-btn 
                    mt-8 p-2 px-6
                    text-lg md:text-xl font-semibold 
                    cursor-pointer"
                >
                    닫기
                </button>

            </div>

        </div>,
        document.body
    );
}