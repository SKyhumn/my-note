import { auth, googleProvider, githubProvider } from "../../../SDK/firebase";
import { signInWithPopup } from "firebase/auth";

import { db } from "../../../SDK/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

import type { User } from "firebase/auth";

import google from "../../../assets/google.png";
import github from "../../../assets/github.svg";

interface Props{
    setLoading:(value:boolean) => void;
    setErr:(err:string) => void;
}

export default function OAuth({ setLoading, setErr } : Props){
    const handleOAuthSignIn = async(provider:any) => {
        setLoading(true);

        try{
            const res=await signInWithPopup(auth, provider);

            await createUserIfNotExist(res.user);

            alert("로그인에 성공했습니다.");
        } catch(error:any){
            setErr(error);
        } finally{
            setLoading(false);
        }
    }

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