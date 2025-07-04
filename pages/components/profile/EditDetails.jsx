import { useState, useEffect } from "react";

export default function EditDetails(props) {

    const [selectedEditType, setSelectedEditType] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [submitMessage, setSubmitMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    async function onFormSubmit(event) {
        event.preventDefault();
        
        const payload = {
            newUsername: username,
            newPassword: password,
            newEmail: email,
            userType: props.userType,
            editType: selectedEditType,
            userID: props.userID,
        }

        if(editType == "username" && username == "" || editType == "email" && email == "" || editType == "password" && password == ""){
            setSubmitMessage("You cannot enter an empty field!");
            return;
        }

        setSubmitted(true);

        const res = await fetch("/api/profile", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })

        if(res?.status === 500){
            setSubmitMessage("An unexpected error occured. Please try again later.");
            return
        } else if(res?.status === 200){
            setSubmitMessage("Changes edited successfully!");
            return;
        } else if(res?.status === 404){
            setSubmitMessage("User not found.");
            return;
        } else if(res?.status === 400) {
            setSubmitMessage("No proper field to edit found.");
            return;
        } else if(res?.status === 403){
            setSubmitMessage("You cannot edit your Google Account Credentials!");
            return;
        }
    }

    useEffect(() => {
        if(submitted) {
            setTimeout(() => setSubmitted(false), 3000);
        }
    }, [submitted]);

    return <div>
        <form onSubmit={onFormSubmit}>
            Edit Details:
            
            <input type="radio" name="editType" id="editType" value="username"  checked={selectedEditType === "username"} onChange={(e) => setSelectedEditType("username")}/> Username
            <input type="radio" name="editType" id="editType" value="password" checked={selectedEditType === "password"} onChange={(e) => setSelectedEditType("password")}/> Password
            <input type="radio" name="editType" id="editType" value="email" checked={selectedEditType === "email"} onChange={(e) => setSelectedEditType("email")} /> Email

            Username: <input type="text" name="username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={selectedEditType !== "username"} />
            Password: <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={selectedEditType !== "password"} />
            Confirm Password: <input type="password" name="confirmPassword" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={selectedEditType !== "password"} />
            Email: <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={selectedEditType !== "email"} />

            {submitted ? (<p>{submitMessage}</p>) : (<button type="submit">Edit Details</button>)}
        </form>
    </div>
}