'use client';

import {useState, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import StatCard from '../../../pages/components/admin/StatCard'
import PreviewUsers from '../../../pages/components/admin/PreviewUsers';
import PreviewReports from '../../../pages/components/admin/PreviewReports';
import PreviewAdmins from '../../../pages/components/admin/PreviewAdmins';
import SessionChecking from "../../../pages/components/SessionChecking";
import SignOut from '../../../pages/components/SignOut';

export default function AdminDashboard() {
    const { data: session, status } = useSession(); //gets session data and status 
    const isSuperadmin = session?.user?.role === 'superadmin'; //checked if logged in user is superadmin
    // state to hold various system statistics
    const [stats, setStats]= useState ({ 
        users: 0,
        posts: 0,
        comments: 0,
        reports: 0,
        admins: 0,
    });

    //fetch dashboard stats after authentication
    useEffect(() => { 
        if (status !== 'authenticated') return;
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats: ', error);
            }
        };
        if (status === "authenticated") {
            fetchStats();
        }
        
    }, [status]);

    return (
        <div style = {{padding: '2rem'}}>
            <SessionChecking />
             {/* Header: Title and SignOut button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Admin Dashboard</h1>
                <SignOut /> {/* Render SignOut button here */}
            </div>

            {/* Stat cards to show system metrics */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <StatCard title="Users" value={stats.users} />
                <StatCard title="Posts" value={stats.posts} />
                <StatCard title="Comments" value={stats.comments} />
                <StatCard title="Reports" value={stats.reports} />
                <StatCard title="Admins" value={stats.admins} />
            </div>

             {/* Preview of recent reports */}
            <PreviewReports />
            {/* Preview of user list */}
            <PreviewUsers />
            {/* Preview of admin list - only shown to superadmin */}
            {isSuperadmin && <PreviewAdmins />}
        </div>
    );
}