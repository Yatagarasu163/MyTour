'use client';

import { useEffect, useState} from "react";
import { useSession } from "next-auth/react";
import UserTable from "../../../pages/components/admin/UserTable";
import SessionChecking from "../../../pages/components/SessionChecking";

export default function AdminUsers(){
    //store list of users fetched from backend
    const [users,setUsers] = useState([]);
    // track if data is still loading 
    const [loading, setLoading] = useState(true);
    const { status } = useSession(); 

    //fetch user data from server once authenticated
    useEffect(() => {
        if (status !== "authenticated") return;
        fetch("/api/admin/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data.users); //store retrieved users
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch users:", err);
                setLoading(false);
            });
    }, [status]);

    //function to suspend or restore user 
    const handleSuspend = async (user) => {
        const user_id = user.user_id;
        const confirmSuspend = window.confirm(`Are you sure you want to ${user.status === "Active" ? "suspend" : "restore"} this user?`);
        if (!confirmSuspend) return;

        try {
            // send patch request to update user's status
            const res = await fetch(`/api/admin/users/${user_id}/suspend`, {method : "PATCH",});
            
            if (!res.ok) {
                throw new Error("Failed to suspend user");
            }

            const data = await res.json();
            console.log("User suspended:", data);
            alert(`User has been ${data.user.user_status === 0 ? "suspended" : "restored"} successfully.`);

            //update user status in local state without refreshing
            setUsers(prev =>
                prev.map(user => user.user_id === user_id ? { ...user,status: user.status === "Active" ? "Inactive" : "Active"} : user)
            );
        } catch (err){
            console.error(err);
            alert("Something went wrong while suspending the user.");
        }
    };

    //delete user
    const handleDelete = async (user_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try{
            const res = await fetch(`/api/admin/users/${user_id}/delete`, {method : "DELETE", });

        if (!res.ok){
            throw new Error("Failed to delete user");
        }
        setUsers((prev) => prev.filter(user => user.user_id !== user_id)); //removes user without refreshing page
        alert("User has been deleted successfully.")
        } catch (err) {
            console.error(err);
            alert("Something went wrong while deleting the user.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <SessionChecking />
            <h1>Admin: User Management</h1>
             {/* Table component to display users with action handlers passed in as props */}
            <UserTable
                users={users}
                loading={loading}
                onSuspendRestore={handleSuspend}
                onDelete={handleDelete}
            />
        </div>
    );
}