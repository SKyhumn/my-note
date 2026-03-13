import Auth from "./signin-elements/Auth";

interface Props{
    onSwitch: () => void;
}

export default function SignIn({ onSwitch } : Props){
    return(
        <div className="animate-modal-on">
            <Auth onSwitch={onSwitch}/>
        </div>
    );
}