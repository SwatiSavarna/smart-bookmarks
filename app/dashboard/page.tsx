"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

 useEffect(() => {
  let channel: any;

  const load = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return router.push("/");

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);

    //  REALTIME SUBSCRIPTION
    channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        async () => {
          const { data } = await supabase
            .from("bookmarks")
            .select("*")
            .order("created_at", { ascending: false });

          setBookmarks(data || []);
        }
      )
      .subscribe();
  };

  load();

  return () => {
    if (channel) supabase.removeChannel(channel);
  };
}, [router]);



  

  const addBookmark = async () => {
    if (!title || !url) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: session?.user.id,
    });

    setTitle("");
    setUrl("");

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    setBookmarks(data || []);
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
  Dashboard
</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Add Form */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl  text-gray-900 font-semibold mb-4">Add Bookmark</h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input
  className="w-full p-3 border rounded-xl
             text-gray-900 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-blue-500"


              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
              <input
  className="w-full p-3 border rounded-xl
             text-gray-900 placeholder-gray-400
             focus:outline-none focus:ring-2 focus:ring-blue-500"


              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              onClick={addBookmark}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </div>

        {/* Bookmark List */}
        <div className="grid gap-4">
          {bookmarks.length === 0 && (
            <p className="text-gray-500 text-center">No bookmarks yet.</p>
          )}

          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white  text-gray-900 p-5 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <a
                  href={b.url}
                  target="_blank"
                  className="text-lg font-semibold hover:underline"
                >
                  {b.title}
                </a>
                <p className="text-sm text-gray-500">{b.url}</p>
              </div>

              <button
                onClick={() => deleteBookmark(b.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
