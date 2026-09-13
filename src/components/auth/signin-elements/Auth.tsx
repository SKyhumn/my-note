import { useState } from "react";

import { auth } from "../../../SDK/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import type { Switch } from "../../../types/Switch";

import OAuth from "./OAuth";

export default function Auth({ onSwitch } : Switch){
    const [email, setEmail] = useState<string> ("");
    const [password, setPassword] = useState<string> ("");
    
    const [loading, setLoading] = useState<boolean> (false);
    const [err, setErr] = useState<null | string> (null);

    // 로그인
    const handleSignIn = async() => {
        setLoading(true);
        setErr(null);

        try{
            await signInWithEmailAndPassword(auth, email, password);

            alert("로그인에 성공했습니다.");
            
            setEmail("");
            setPassword("");
        } catch (error:any) {
            setErr(error);
        } finally{
            setLoading(false);
        }
    }

    return(
        <div>

            <p className="font-extrabold text-2xl sm:text-3xl md:text-4xl text-center px-2">
                로그인이 필요합니다.
            </p>

            <div className="
                flex flex-col items-center 
                w-full px-4 sm:px-0 sm:w-90
                mt-5
                mx-auto"
            >

                <input 
                type="text" 
                placeholder="email" 
                disabled={loading} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input w-full"
                />

                <input 
                type="password" 
                placeholder="비밀번호" 
                disabled={loading} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input w-full"
                />

                {err!=null&&(
                    <div className="check-err">
                        <p>로그인에 실패했습니다.</p>
                    </div>
                )}

                <button 
                onClick={handleSignIn} 
                disabled={loading} 
                className={`
                    w-full h-10 
                    mt-5 
                    ${!loading?"black-btn":"gray-btn"}`}
                >
                    로그인
                </button>

                <button 
                onClick={onSwitch} 
                disabled={loading} 
                className="gray-btn w-full h-10 mt-5"
                >
                    회원가입
                </button>

            </div>

            <OAuth 
            setLoading={setLoading} 
            setErr={setErr}
            />

        </div>
    );
}