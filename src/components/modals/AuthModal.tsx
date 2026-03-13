import { useState } from "react";

import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";

type Mode = "signin" | "signup";

export default function AuthModal(){
    const [mode, setMode] = useState<Mode> ("signin");

    return(
        <div className="
            flex justify-center items-center 
            fixed inset-0 
            bg-black/20 backdrop-blur-2xl"
        >

            <div className="
                w-120 
                pt-20 pb-10 
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