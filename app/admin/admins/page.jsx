/// this page only for super admin

'use client';

import {useEffect, useState} from "react";
import AdminTable from "../../../pages/components/admin/AdminTable";
import SessionChecking from "../../component/SessionChecking";

export default function AdminList() {
    const [admins, setAdmins] = useState([]); //store list of admins
    const [loading,setLoading] = useState(true); //control loading message 

    // fetch lists of admins 
    useEffect(() => {
        fetch("/api/admin/admins")
            .then(res => res.json())
            .then(data => {
                setAdmins(data.admins || []); //store fetched admins in state
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load admins: ",err);
                setLoading(false);
            });
    }, []);

    // handles suspending or restoring admin 
    const handleSuspend = async (admin_id, currentStatus) => {
        const confirmAction = window.confirm(currentStatus === 1 ? "Suspend this admin?" : "Restore this admin?");
        if (!confirmAction) return;

        try {
            // sends patch request to update admin status 
            const res = await fetch (`/api/admin/admins/${admin_id}/suspend`, {method: "PATCH", });
            if (!res.ok) throw new Error("Failed to update status");

            alert("Admin status updated.");
            // updates the admin list
            setAdmins(prev => 
                prev.map(admin => 
                    admin.admin_id === admin_id ? { ...admin, admin_status: currentStatus === 1 ? 0 : 1}
                    : admin
                )
            );
        } catch (err) {
            console.error(err);
            alert("Something went wrong while updating admin status.");
        }
    };

    // handle deleting admins from the system 
    const handleDeleteAdmin = async (admin_id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this admin? This action cannot be undone.");
        if(!confirmDelete) return;

        try {
            // send delete request to API 
            const res = await fetch(`/api/admin/admins/${admin_id}/delete`, {method: "DELETE", });

            if (!res.ok) throw new Error("Failed to delete admin");
            alert("Admin deleted successfully.");
            // remove the deleted admin 
            setAdmins(prev => prev.filter(admin => admin.admin_id !== admin_id));
        } catch (err) {
            console.error(err);
            alert("Something went wrong while deleting the admin.")
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <SessionChecking />
            <h1>Admin Management</h1>
            {/* Render admin table with props */}
            <AdminTable
                admins={admins}
                loading={loading}
                onSuspendRestore={handleSuspend}
                onDelete={handleDeleteAdmin}
            />
        </div>
    );
}