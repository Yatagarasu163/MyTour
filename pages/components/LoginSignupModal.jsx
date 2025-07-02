//styling is temp 
'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import UserLoginForm from "./UserLoginForm";
import UserSignUpForm from "./UserSignUpForm";
import AdminLoginForm from "./AdminLoginForm";
import AdminSignUpForm from "./AdminSignUpForm";
import SuperAdminLoginForm from "./SuperAdminLoginForm";

export default function LoginSignupModal({ onClose }) {
    const [tab, setTab] = useState("login");
    const [adminMode, setAdminMode] = useState(false);
    const [superMode, setSuperMode] = useState(false);
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const handleGoogleLogin = async () => {
        try {
            await signIn("google", { callbackUrl: "/landing" });
        } catch (err) {
            console.error("Google login failed", err);
        }
    };

    const isLogin = tab === "login";
    const modeLabel = isLogin ? "Login" : "Sign Up";

    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 9999
        }}>
            <div style={{
                backgroundColor: "#fff",
                padding: "2rem",
                borderRadius: "10px",
                width: "100%",
                maxWidth: "500px",
                position: "relative",
                boxShadow: "0 0 12px rgba(0,0,0,0.3)"
            }}>
                <button onClick={onClose} style={{ position: "absolute", top: 10, right: 10 }}>✖</button>

                {/* Title */}
                <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
                    {modeLabel} {superMode ? "as Superadmin" : adminMode ? "as Admin" : "as User"}
                </h2>

                {/* Tab Switcher (hide when superadmin) */}
                {!superMode && (
                    <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1rem" }}>
                        <button
                            onClick={() => setTab("login")}
                            style={{ backgroundColor: isLogin ? "#333" : "#eee", color: isLogin ? "#fff" : "#000", padding: "0.5rem 1rem", borderRadius: "5px" }}
                        >Login</button>
                        <button
                            onClick={() => setTab("signup")}
                            style={{ backgroundColor: !isLogin ? "#333" : "#eee", color: !isLogin ? "#fff" : "#000", padding: "0.5rem 1rem", borderRadius: "5px" }}
                        >Sign Up</button>
                    </div>
                )}

                {/* Error Message */}
                {error === "InvalidCredentials" && (
                    <p style={{ color: "red", marginBottom: "0.5rem" }}>
                        Invalid email or password.
                    </p>
                )}
                {error === "ConflictingPasswords" && (
                    <p style={{ color: "red", marginBottom: "0.5rem" }}>
                        Passwords do not match.
                    </p>
                )}

                {/* FORM */}
                <div style={{ marginBottom: "1.5rem" }}>
                    {superMode ? (
                        <SuperAdminLoginForm />
                    ) : adminMode ? (
                        isLogin ? <AdminLoginForm /> : <AdminSignUpForm />
                    ) : (
                        isLogin ? <UserLoginForm /> : <UserSignUpForm />
                    )}
                </div>

                {/* Google Login (only for normal users) */}
                {!adminMode && !superMode && (
                    <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                        <button onClick={handleGoogleLogin}>Login with Google</button>
                    </div>
                )}

                {/* Role Switch */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    {!adminMode && !superMode && (
                        <>
                            <button onClick={() => setAdminMode(true)}>Login as Admin</button>
                            <button onClick={() => setSuperMode(true)}>Login as Superadmin</button>
                        </>
                    )}
                    {(adminMode || superMode) && (
                        <button onClick={() => {
                            setAdminMode(false);
                            setSuperMode(false);
                        }}>Back to User</button>
                    )}
                </div>
            </div>
        </div>
    );
}
