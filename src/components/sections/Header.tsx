import { useNavigate } from 'react-router-dom';

import { auth } from '../../SDK/firebase';
import { signOut } from 'firebase/auth';

import logo from "../../assets/logo.png";

export default function Header(){
    const nav = useNavigate();

    // 메인 페이지로
    const goMain = () => {
        nav('/');
    }

    // 로그아웃
    const handleSignOut = async() => {
        try{
            await signOut(auth);

            alert("로그아웃에 성공했습니다.");
        } catch{
            alert("로그아웃에 실패했습니다.");
        }
    }

    return(
        <header className="
            flex justify-between items-center  
            w-screen h-20 
            bg-header"
        >

            <img 
            src={logo} 
            onClick={goMain} 
            className="w-30 ml-5 cursor-pointer"
            />

            <p 
            onClick={handleSignOut} 
            className="
                mr-5 
                text-white text-1xl font-semibold 
                cursor-pointer"
            >
                로그아웃
            </p>   

        </header>
    );
}