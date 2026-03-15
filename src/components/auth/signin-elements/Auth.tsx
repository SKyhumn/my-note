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

            <p className="font-extrabold text-4xl text-center">
                로그인이 필요합니다.
            </p>

            <div className="
                flex flex-col items-center 
                w-120 h-65 
                mt-5"
            >

                <input 
                type="text" 
                placeholder="email" 
                disabled={loading} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input"
                />

                <input 
                type="password" 
                placeholder="비밀번호" 
                disabled={loading} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input"
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
                    w-90 h-10 
                    mt-5 
                    ${!loading?"black-btn":"gray-btn"}`}
                >
                    로그인
                </button>

                <button 
                onClick={onSwitch} 
                disabled={loading} 
                className="gray-btn w-90 h-10 mt-5"
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