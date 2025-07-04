import { db } from "../../../lib/actions/pool";
import bcrypt from "bcrypt";

export async function POST(request, context){
    const body = await request?.json();
    const editType = body?.editType;
    const saltRounds = process.env.SALT_ROUNDS;

    try{
        //Edits user details
        if(body?.userType == "user"){
            if(editType == "username"){
                const result = db.query("UPDATE USERS SET USER_NAME = $1 WHERE USER_ID = $2", [body?.newUsername, body?.userID]);
                
                if(result?.rowCount == 0){
                    return new Response(JSON.stringify({message: "User not found."}), {status: 404});
                }
    
                return new Response(JSON.stringify({message: "Username updated successfully."}), {status: 200})
    
            } else if(editType == "password"){
                //Hashes the password before uploading to the database.
                const pwHash = await bcrypt.hash(body?.newPassword, saltRounds);

                const res = db.query("SELECT * FROM USERS WHERE USER_ID = $1", [body?.userID]);
                if(res?.rowCount > 0){
                    const password = res.rows[0].user_password;
                    if(password == "google"){
                        return new Response({}, {status: 403});
                    }
                }

                const result = db.query("UPDATE USERS SET USER_PASSWORD = $1 WHERE USER_ID = $2", [pwHash, body?.userID])
    
                if(result?.rowCount == 0) {
                    return new Response(JSON.stringify({message: "User not found."}), {status: 404})
                }
    
                return new Response(JSON.stringify({message: "Password updated successfully."}), {status: 200})
    
            } else if(editType == "email"){
                const res = db.query("SELECT * FROM USERS WHERE USER_ID = $1", [body?.userID]);
                if(res?.rowCount == 0){
                    return new Response({}, {status : 404 });
                }

                const password = (await res)?.rows[0].user_password;
                if(password == "google"){
                    return new Response({}, {status : 403});
                }

                const result = db.query("UPDATE USERS SET USER_EMAIL = $1 WHERE USER_ID = $2", [body?.newEmail, body?.userID])
    
                return new Response(JSON.stringify({message: "Email updated successfully."}), {status: 200})
    
            } else{
                return new Response(JSON.stringify({message: "No proper field to edit found."}), {status: 400});
            }
        //Edits admin details
        } else if(userType == "admin"){
            //Changes the username
            if(editType == "username"){
                const result = db.query("UPDATE ADMIN SET ADMIN_NAME = $1 WHERE ADMIN_ID = $2", [body?.newUsername, body?.userID]);
                
                if(result?.rowCount == 0){
                    return new Response(JSON.stringify({message: "User not found."}), {status: 404});
                }
    
                return new Response(JSON.stringify({message: "Username updated successfully."}), {status: 200})
            
            //Changes the password
            } else if(editType == "password"){
                //Hashes the password before uploading to the database
                const pwHash = bcrypt.hash(body?.newPassword, saltRounds);

                const result = db.query("UPDATE ADMIN SET ADMIN_PASSWORD = $1 WHERE ADMIN_ID = $2", [pwHash, body?.userID])
    
                if(result?.rowCount == 0) {
                    return new Response(JSON.stringify({message: "User not found."}), {status: 404})
                }
    
                return new Response(JSON.stringify({message: "Password updated successfully."}), {status: 200})
    
            //Changes the email
            } else if(editType == "email"){
                const result = db.query("UPDATE ADMIN SET ADMIN_EMAIL = $1 WHERE ADMIN_ID = $2", [body?.newEmail, body?.userID])
    
                if(result?.rowCount == 0) {
                    return new Response(JSON.stringify({message: "User not found."}), {status: 404});
                }
    
                return new Response(JSON.stringify({message: "Email updated successfully."}), {status: 200})
    
            } else{
                return new Response(JSON.stringify({message: "No proper field to edit found."}), {status: 400});
            }
        } else{
            return new Response({}, {status: 404})
        }
        
    } catch (err) {
        console.log(err);
        return new Response({}, {status: 500});
    }
}