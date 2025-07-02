import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SuperAdminLoginForm(){

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    function OnUsernameChange(event){
        const value = event.target.value;
        setUsername(value);
    }
    
    function OnPasswordChange(event){
        const value = event.target.value;
        setPassword(value);
    }
    
    
    async function handleSubmit(event){
        event.preventDefault();
    
        const res = await signIn("credentials", {
            redirect: false, 
            username,
            email:"", 
            password,
            mode: "login",
            type: "superadmin",
            callbackUrl: "/admin/dashboard",
        });
    
        if(res?.error){
            console.log("Login failed: ", res.error);
            window.location.href = "/landing?error=InvalidCredentials";
        } else{
            window.location.href = "/admin/dashboard";
        }
    }

    return (
        <form onSubmit={handleSubmit}>
                Username: 
                <input type="text" id="username" name="username" placeholder="Enter your username here!" value={username} onChange={OnUsernameChange}/>
                Password:
                <input type="password" name="password" id="email" placeholder="Enter your password here!" value={password} onChange={OnPasswordChange}/>
                <input type="hidden" name="mode" id="mode" value="login"/>
                <input type="hidden" name="type" id="type" value="superadmin"/>
                <input type="submit" value="Login!" />
        </form> 
    )
}