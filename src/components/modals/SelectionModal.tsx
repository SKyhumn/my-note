import { createPortal } from "react-dom";

interface Props {
    message: string;
    yes: () => void;
    no: () => void;
}

export default function SelectionModal({ message, yes, no } : Props){
    return createPortal(
        <div className="
            flex justify-center items-center 
            fixed inset-0 z-100 
            px-4
            bg-black/50"
        >

            <div 
            onClick={(e) => e.stopPropagation()}
            className="
                flex flex-col justify-center items-center 
                w-full max-w-100 h-auto 
                px-6 sm:px-10 py-8
                rounded-2xl 
                bg-white 
                animate-modal-on"
            >

                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-center break-keep">
                    {message}
                </p>

                <div className="flex justify-between gap-4 mt-8 sm:mt-10 w-full max-w-50">

                    <button 
                    onClick={yes} 
                    className="
                        black-btn 
                        flex-1 p-2 
                        text-lg md:text-xl font-semibold 
                        cursor-pointer"
                    >
                        예
                    </button>

                    <button 
                    onClick={no} 
                    className="
                        black-btn 
                        flex-1 p-2 
                        text-lg md:text-xl font-semibold 
                        cursor-pointer"
                    >
                        아니오
                    </button>

                </div>

            </div>
            
        </div>,
        document.body
    );
}