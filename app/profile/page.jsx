"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import SessionChecking from "@/app/component/SessionChecking";
import EditDetails from "@/pages/components/profile/EditDetails";

export default function Profile() {
  const [top5posts, settop5posts] = useState([]);
  const { data: session, status } = useSession();
  const loading = status === "loading" || status == "unauthenticated";
  const [user, setUser] = useState(null);


    useEffect(() => {
    if (status === "authenticated") {
      fetch(`/api/admin/users/${session?.user?.id}/userDetails`)
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch((err) => console.error("User details fetch error:", err));

        console.log(user);

      fetch(`/api/admin/users/${session?.user?.id}/top5`)
        .then((res) => res.json())
        .then((data) => settop5posts(data.posts))
        .catch((err) => console.error("Internal server error: ", err));
    }
  }, [status, session?.user?.id, session]);
  
  if (loading) return <p>Loading...</p>;

  return (
    <>
    <SessionChecking />
      <div className="grid grid-cols-2 gap-4 mt-4 px-4">
        <div>
          <Card className="h-full">
            <CardHeader className="flex justify-center">
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center">
              <Avatar
                className="w-40 h-40 rounded-full bg-blue-500"
                src="/globe.svg"
                alt="placeholder"
              />
              <p>User: {user?.user_name}</p>
              <p>Email: {user?.user_email}</p>
              {/* Part to edit the user details. Takes in user type and the user id from the current session. */}
              <EditDetails userType="user" userID={session?.user?.id}/>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Top 5 Recent Posts</CardTitle>
              {Array.isArray(top5posts) && top5posts.length > 0 ? (
                  <ul>
                    {top5posts.map((post, index) => (
                      <li key={index}>{post.post_title}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No posts found.</p>
                )}
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
