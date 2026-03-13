import { useState } from "react";

import { auth } from "../../SDK/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import { db } from "../../SDK/firebase";
import { doc, setDoc } from "firebase/firestore";

import back from "../../assets/arrow.png"

interface Props{
    onSwitch: () => void;
}

export default function SignUp({ onSwitch }:Props){
    const [name, setName] = useState<string> ("");
    const [email, setEmail] = useState<string> ("");
    const [password, setPassword] = useState<string> ("");
    const [passwordAgain, setPasswordAgain] = useState<string> ("");

    const [nameValid, setNameValid] = useState<boolean | null> (null);
    const [emailValid, setEmailValid] = useState<boolean | null> (null);
    const [passwordValid, setPasswordValid] = useState<boolean | null> (null);
    const [passwordIsCorrect, setPasswordIsCorrect] = useState<boolean | null> (null);

    const [loading, setLoading] = useState<boolean> (false);
    const [err, setErr] = useState<null | string> (null);

    const checkInfo=()=>{
        const nameCheck = name.trim().length > 0;
        const emailCheck = email.trim().length > 0 && email.includes("@");

        const passwordCheck=
            password.trim().length >= 8 &&
            /^(?=.*[a-zA-Z])(?=.*[0-9]).+$/.test(password);

        const passwordMatch = 
            passwordAgain === password && 
            password.length>0;

        setNameValid(nameCheck);
        setEmailValid(emailCheck);
        setPasswordValid(passwordCheck);
        setPasswordIsCorrect(passwordMatch);

        if (nameCheck && emailCheck && passwordCheck && passwordMatch) {
            handleSignUp();
        }
    }

    const handleSignUp = async() => {
        setLoading(true);
        setErr(null);

        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await addUserData(userCredential.user.uid);

            await updateProfile(userCredential.user, {
                displayName:name
            });
        
            alert("회원가입에 성공했습니다.");
            
            setEmail("");
            setPassword("");
            setPasswordAgain("");
        } catch (error:any) {
            setErr(error.message);
            alert("회원가입에 실패했습니다."+err);
        } finally {
            setLoading(false);
        }
    }

    const addUserData = async(uid:string) => {
        await setDoc(doc(db, "users", uid), {
            name: name,
            email: email,
        });
    }

    return(
        <div className="animate-modal-on">

            <p className="font-extrabold text-4xl text-center">
                회원가입
            </p>

            <div className="
                flex flex-col items-center 
                w-120 h-105
                mt-5"
            >

                <input 
                type="text"
                placeholder="닉네임" 
                disabled={loading} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="input"
                />

                {nameValid == false && (
                    <div className="check-err">
                        <p>닉네임은 1자 이상이어야 합니다.</p>
                    </div>
                )}

                <input 
                type="text" 
                placeholder="email" 
                disabled={loading} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input"
                />

                {emailValid == false && (
                    <div className="check-err">
                        <p>이메일은 @를 포함해야합니다.</p>
                    </div>
                )}

                <input 
                type="password" 
                placeholder="비밀번호" 
                disabled={loading} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input"
                />

                {passwordValid == false && (
                    <div className="check-err">
                        <p>비밀번호는 8자 이상, 영문자와 특수문자를 포함해야합니다.</p>
                    </div>
                )}

                <input 
                type="password" 
                placeholder="비밀번호 재입력" 
                disabled={loading} 
                value={passwordAgain} 
                onChange={(e) => setPasswordAgain(e.target.value)} 
                className="input"
                />

                {passwordIsCorrect == false && (
                    <div className="check-err">
                        <p>비밀번호가 틀립니다.</p>
                    </div>
                )}

                <button 
                onClick={checkInfo} 
                disabled={loading} 
                className={`
                    w-90 h-10 mt-5
                    ${!loading ? "black-btn" : "gray-btn"}`
                }>
                    회원가입
                </button>

                <button 
                onClick={onSwitch} 
                disabled={loading} 
                className="
                    flex justify-center items-center 
                    w-12 h-12 
                    mt-10 
                    rounded-xl 
                    bg-gray-200 
                    cursor-pointer"
                >
                    <img src={back}/>
                </button>

            </div>

        </div>
    );
}