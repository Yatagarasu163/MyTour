"use client";

import { useState, useEffect } from "react";
import ClientRedirect from "../component/ClientRedirect";
import LoginSignupModal from "../../pages/components/LoginSignupModal";
import { useSearchParams } from "next/navigation";

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        if (error) {
            // Show an alert based on error type
            switch (error) {
                case "InvalidCredentials":
                    alert("Invalid email or password. Please try again.");
                    break;
                case "ConflictingPasswords":
                    alert("Passwords do not match.");
                    break;
                default:
                    alert("Something went wrong. Please try again.");
            }

            // open login/signup modal automatically
            setShowModal(true);
        }
    }, [error]);

    return (
        <div>
            <ClientRedirect />

            <header>
                <button onClick={() => setShowModal(true)}>Login / Signup</button>
            </header>

            {showModal && <LoginSignupModal onClose={() => setShowModal(false)} />}

            <main>
                {/* main content here */}
            </main>
        </div>
    );
}
