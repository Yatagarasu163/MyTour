import { signIn } from "next-auth/react";
import { useState } from "react";

export default function UserLoginForm(){  

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    function OnEmailChange(event){
        const value = event.target.value;
        setEmail(value);
    }
    
    function OnPasswordChange(event){
        const value = event.target.value;
        setPassword(value);
    }
    
    
    async function handleSubmit(event){
        event.preventDefault();
    
        const res = await signIn("credentials", {
            redirect: false, 
            username: "",
            email, 
            password,
            mode: "login",
            type: "user",
            callbackUrl: "/user/test",
        });
    
        if(res?.error){
            console.log("Login failed: ", res.error);
            window.location.href = "/landing?error=InvalidCredentials";
        } else{
            window.location.href = "/user/test"; //replace this with user dashboard
        }
    }

    return (
    <form onSubmit={handleSubmit}>
                Email: 
                <input type="email" id="email" name="email" placeholder="Enter your email here!" value={email} onChange={OnEmailChange}/>
                Password:
                <input type="password" name="password" id="password" placeholder="Enter your password here!" value={password} onChange={OnPasswordChange}/>
                <input type="hidden" name="mode" id="mode" value="login"/>
                <input type="hidden" name="type" id="type" value="user"/>
                <input type="submit" value="Login!" />
    </form> 
    );
}