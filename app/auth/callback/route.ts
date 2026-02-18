import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options) =>
          cookieStore.set({ name, value, ...options }),
        remove: (name: string, options) =>
          cookieStore.set({ name, value: "", ...options }),
      },
    }
  );

  // 🔥 THIS creates the session
  await supabase.auth.exchangeCodeForSession(code);

  // redirect AFTER session is saved
  return NextResponse.redirect(new URL("/dashboard", request.url));
}



