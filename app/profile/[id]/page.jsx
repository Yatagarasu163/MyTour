"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import UserReportButton from "@/pages/components/reporting/UserReportButton";
import { useParams, useRouter } from "next/navigation";
import SessionChecking from "@/app/component/SessionChecking";

export default function Profile() {
  const [top5posts, settop5posts] = useState([]);
  const { data: session, status } = useSession();
  const loading = status === "loading" || status === "unauthenticated";
  const [user, setUser] = useState(null);
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();

  useEffect(() => {
    if (status == "authenticated" && session.user.id == id) {
      router.push("/profile");
    }
  }, [status, session, id, router]);

  
  useEffect(() => {
    if (status === "authenticated" && id !== session.user.id) {
      fetch(`/api/admin/users/${id}/userDetails`)
        .then((res) => res.json())
        .then((data) => setUser(data.user))
        .catch((err) => console.error("User details fetch error:", err));

      fetch(`/api/admin/users/${id}/top5`)
        .then((res) => res.json())
        .then((data) => settop5posts(data.posts))
        .catch((err) => console.error("Internal server error: ", err));
    }
  }, [status, id, session]);
  
  if (loading) return <p>Loading...</p>;

  return (
    <div>
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
              {id != session?.user?.id ? <UserReportButton userId={id}/> : null}
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
    </div>
  );
}
