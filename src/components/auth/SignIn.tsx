import type { Switch } from "../../types/Switch";

import Auth from "./signin-elements/Auth";

export default function SignIn({ onSwitch } : Switch){
    return(
        <div className="animate-modal-on">
            <Auth onSwitch={onSwitch}/>
        </div>
    );
}