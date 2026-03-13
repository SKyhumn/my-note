interface Props{
    message: string;
    yes: () => void;
    no: () => void;
}

export default function SelectionModal({ message, yes, no } : Props){
    return(
        <div className="
            flex justify-center items-center 
            fixed inset-0 z-10 
            bg-black/50"
        >

            <div 
            onClick={(e) => e.stopPropagation()}
            className="
                flex flex-col justify-center items-center 
                w-auto h-60 
                px-10 
                rounded-2xl 
                bg-white 
                animate-modal-on"
            >

                <p className="text-3xl font-semibold text-center">
                    {message}
                </p>

                <div className="flex justify-between translate-y-10 w-50">

                    <button 
                    onClick={yes} 
                    className="
                        black-btn 
                        w-20 p-2 
                        text-xl font-semibold 
                        cursor-pointer"
                    >
                        예
                    </button>

                    <button 
                    onClick={no} 
                    className="
                        black-btn 
                        w-20 p-2 
                        text-xl font-semibold 
                        cursor-pointer"
                    >
                        아니오
                    </button>

                </div>

            </div>
            
        </div>
    );
}