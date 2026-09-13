import { useNavigate } from 'react-router-dom';

import { auth } from '../../SDK/firebase';
import { signOut } from 'firebase/auth';

import logo from "../../assets/logo.png";

interface Props {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: Props) {
    const nav = useNavigate();

    const goMain = () => {
        nav('/');
    }

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert("로그아웃에 성공했습니다.");
        } catch {
            alert("로그아웃에 실패했습니다.");
        }
    }

    return (
        <header className="
            flex justify-between items-center
            w-full h-16 md:h-20
            px-3 md:px-0
            bg-header"
        >
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="md:hidden text-white text-2xl leading-none px-1"
                        aria-label="메뉴 열기"
                    >
                        ☰
                    </button>
                )}

                <img
                    src={logo}
                    onClick={goMain}
                    className="w-24 md:w-30 md:ml-5 cursor-pointer"
                />
            </div>

            <p
                onClick={handleSignOut}
                className="
                    mr-2 md:mr-5
                    text-white text-base md:text-1xl font-semibold
                    cursor-pointer"
            >
                로그아웃
            </p>
        </header>
    );
}