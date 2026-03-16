import { auth, googleProvider, githubProvider } from "../../../SDK/firebase";
import { signInWithPopup } from "firebase/auth";

import { db } from "../../../SDK/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import type { OAuthProps } from "../../../types/OAuthProps";
import type { User } from "firebase/auth";

import google from "../../../assets/google.png";
import github from "../../../assets/github.svg";

export default function OAuth({ setLoading, setErr } : OAuthProps){
    // OAuth 로그인
    const handleOAuthSignIn = async(provider:any) => {
        setLoading(true);

        try{
            const res=await signInWithPopup(auth, provider);

            await createUserIfNotExist(res.user);

            alert("로그인에 성공했습니다.\n동일한 이메일이 있을 경우 SNS 로그인 시 계정이 통합되어 SNS 로그인만 가능합니다.");
        } catch(error:any){
            setErr(error);
        } finally{
            setLoading(false);
        }
    }

    // 유저가 존재하지 않을 때 firestore에 유저 추가
    const createUserIfNotExist = async(user:User) => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef,{
                name:user.displayName,
                email:user.email
            });
        }
    }

    return(
        <div>

            <p className="mt-4 text-gray-600 text-sm text-center">
                SNS 간편 로그인
            </p>

            <div className="flex justify-center animate-modal-on">

                <button onClick={() => handleOAuthSignIn(googleProvider)}>

                    <img 
                    src={google} 
                    className="oauth"
                    />

                </button>

                <button onClick={() => handleOAuthSignIn(githubProvider)}>

                    <img 
                    src={github} 
                    className="oauth"
                    />

                </button>

            </div>

        </div>
    );
}