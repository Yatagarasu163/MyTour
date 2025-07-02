import { signIn } from "next-auth/react";
import { useState } from "react";

export default function AdminSignUpForm(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");

    function OnUsernameChange(event){
        const value = event.target.value;
        setUsername(value);
    }

    function OnEmailChange(event){
        const value = event.target.value;
        setEmail(value);
    }

    function OnPasswordChange(event){
        const value = event.target.value;
        setPassword(value);
    }
    
    function OnConfirmPasswordChange(event){
        const value = event.target.value;
        setConfirmPassword(value);
    }


    async function handleSubmit(event){
        event.preventDefault();

        const res = await signIn("credentials", {
            redirect: false, 
            username,
            email, 
            password,
            mode: "signup",
            type: "admin",
            callbackUrl: "/admin/dashboard",
        });

        if(res?.error){
            console.log("Login failed: ", res.error);
            window.location.href = "/landing?error=InvalidCredentials";
        } else if(password !== confirmPassword){
            window.location.href = "/landing?error=ConflictingPasswords";
        } else{
            window.location.href = "/admin/dashboard"
        }
    }

    return (
        <form onSubmit={handleSubmit}>
                Username: 
                <input type="text" name="username" id="username" placeholder="Enter your username here!" value={username} onChange={OnUsernameChange} required/>
                Email: 
                <input type="email" id="email" name="email" placeholder="Enter your email here!" value={email} onChange={OnEmailChange}/>
                Password:
                <input type="password" name="password" id="password" placeholder="Enter your password here!" value={password} onChange={OnPasswordChange}/>
                Confirm Password: 
                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Re-type your password here!" value={confirmPassword} onChange={OnConfirmPasswordChange}/>
                <input type="hidden" name="mode" id="mode" value="signup"/>
                <input type="hidden" name="type" id="type" value="admin"/>
                <input type="submit" value="Sign In!" />
        </form>
    )
}