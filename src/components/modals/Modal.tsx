import type { ModalProps } from "../../types/ModalProps";

export default function Modal({ message, onClose } : ModalProps){
    return(
        <div className="
            flex justify-center items-center 
            fixed inset-0 z-10 
            w-screen h-screen 
            bg-black/50"
        >

            <div className="
                flex justify-center items-center 
                w-120 h-60 
                rounded-2xl 
                bg-white 
                animate-modal-on"
            >

                <p className="text-3xl font-semibold text-center">
                    {message}
                </p>

            </div>

            <button 
            onClick={onClose} 
            className="
                black-btn 
                relative top-18 -left-20 
                p-2 
                text-xl font-semibold 
                cursor-pointer 
                animate-modal-on"
            >
                닫기
            </button>

        </div>
    );
}