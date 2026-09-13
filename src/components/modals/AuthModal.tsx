import { useState } from "react";

import type { Mode } from "../../types/Mode";

import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";

export default function AuthModal(){
    const [mode, setMode] = useState<Mode>("signin");

    return(
        <div className="
            flex justify-center items-center 
            fixed inset-0 
            p-4 sm:p-6
            z-100
            bg-black/20 backdrop-blur-2xl"
        >

            <div className="
                w-full max-w-110
                max-h-[90vh] overflow-y-auto
                pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 
                rounded-2xl 
                bg-white 
                animate-modal-on"
            >

                {mode==="signin"?(
                    <SignIn onSwitch={() => setMode("signup")}/>
                ):(
                    <SignUp onSwitch={() => setMode("signin")}/>
                )}

            </div>

        </div>
    );
}