import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { db } from "./lib/actions/pool";

const authOptions = {
    providers: [Google, Credentials({
        credentials: {
            username: {label: "username", type: "text"},
            email: { label: "email", type: "email"},
            password: {label: "password", type: "password"},
            mode: {label: "mode", type: "hidden"},
            type: {label: "type", type: "hidden"}
        }, authorize : async (credentials) => {
            let user = null;
            const mode = credentials.mode;
            const type = credentials.type;
            const saltRounds = process.env.SALT_ROUNDS;
            //Checks if it is a user or an admin
            if(type == "user"){
                try{
                    //Gets the user's row to check if they exist
                    const result = await db.query("SELECT * FROM USERS WHERE USER_EMAIL=$1", [credentials.email]);
                    //If the user exists, hash the current password and see if it is correct with the database one.
                    if(result.rows.length === 1){
                        user = result.rows[0];

                        if(await bcrypt.compare(credentials.password, user.user_password) && credentials.username === ""){
                            if (user.user_status === 0) {
                                console.log("User is inactive.");
                                return null;
                        }
                        return user
                        
                        }else{
                            return null;
                        }
                    } else{
                        if(mode === "signup"){
                            //Hashes the password using bcrypt hashing algorithm.
                            const pwHash = await bcrypt.hash(credentials.password, saltRounds);
                            
                            //Inserts it into the database
                            const results = await db.query("INSERT INTO USERS (user_name, user_password, user_email, user_status) VALUES ($1, $2, $3, 1) RETURNING *", [credentials.username, pwHash, credentials.email]);
                            
                            //Returns the user details to be passed back into the session details. 
                            user = results.rows[0];
                            return user;
                        } else{
                            return null;
                        }
                    }
                } catch(err){
                    console.error(err);
                    return null;
                }  
            //Does this if it is an admin
            } else if(type == "admin"){
                try{
                    const result = await db.query("SELECT * FROM ADMIN WHERE ADMIN_EMAIL=$1", [credentials.email]);
                    
                    if(result.rows.length === 1){
                        user = result.rows[0];

                        if(await bcrypt.compare(credentials.password, user.admin_password) && credentials.username === ""){
                            if (user.admin_status === 0) {
                                console.log("Admin is suspended.");
                                return null;
                        }
                        return user;
                    } else{
                            return null;
                        }
                    } else if(mode === "signup"){
                        //Hashes the algorithm using the bcrypt hashing algorithm and the salt rounds.
                        const pwHash = await bcrypt.hash(credentials.password, saltRounds);

                        //Inserts it into the database
                        const results = await db.query("INSERT INTO ADMIN (admin_name, admin_password, admin_email, admin_status) VALUES ($1, $2, $3, 1) RETURNING *", [credentials.username, pwHash, credentials.email]);
                        
                        //Returns the user details to be passed back into the session details. 
                        user = results.rows[0];
                        return user;
                    }
                    else{
                        return null;
                    }
                } catch(err){
                    console.error(err);
                    return null;
                }  
            } else if (type === "superadmin") {
                try{
                    if(credentials.username === process.env.SUPERADMIN_NAME && credentials.password === process.env.SUPERADMIN_PASSWORD){
                        user = {username: process.env.SUPERADMIN_NAME};
                        return user;
                    }
                } catch (err){
                    console.log(err);
                    return null;
                }
            } 
            else{
                console.log("No type detected.");
                return null
            }
            
        }
    })],
    session: {
    strategy: "jwt"
    },
 callbacks: {
    async jwt({ token, account, profile, user }) {
    // If signing in via credentials, `user` will exist
    if (user) {
        token.id = user.id || user.user_id || user.admin_id || null;
        token.email = user.email || user.user_email || user.admin_email || null;
        token.name = user.name || user.user_name || user.admin_name || null;
        token.picture = user.picture || null;
        token.role = user.admin_id ? "admin" : user.user_id ? "user" : "superadmin";
    }

    // If signing in via Google (account + profile exist)
    if (account && profile && account.provider === "google") {
        // Check if user exists
        const result = await db.query("SELECT * FROM users WHERE user_email=$1", [profile.email]);

        let dbUser;
        if (result.rows.length === 0) {
        // Auto-register Google user
        const newUser = await db.query(
            "INSERT INTO USERS (user_name, user_password, user_email, user_status) VALUES ($1, $2, $3, 1) RETURNING *",
            [profile.name, account.provider, profile.email]
        );
        dbUser = newUser.rows[0];
        } else {
        dbUser = result.rows[0];
            if (dbUser.user_status === 0) {
                console.log("❌ Google login blocked: user is inactive.");
                return {}; // return empty token → session will be rejected
            }
        }

        // Attach to token
        token.id = dbUser.user_id;
        token.email = dbUser.user_email;
        token.name = dbUser.user_name;
        token.picture = profile.picture;
        token.role = "user";
    }

    return token;
    },
    async session({ session, token }) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.picture = token.picture;
        session.user.role = token.role;
        return session;
    },
    redirect({url, baseUrl}){
        // this gets executed right after login including google 
        if (url.includes("/api/auth/callback/google")) {
            return `${baseUrl}/landing`;
        }

        //any other internal route 
        if (url.startsWith("/")) return `${baseUrl}${url}`;

        // if its external url that matches with base
        if (new URL(url).origin === baseUrl) return url;

        return baseUrl;
        }
    }, 
};

const { auth, handlers, signIn, signOut} = NextAuth(authOptions);

export { authOptions, auth, handlers, signIn, signOut };
