import { cookies } from "next/headers"

import { Hero } from "@/components/Hero"
import { SignIn } from "@/components/SignIn"
import { Profile } from "@/components/Profile"
import { Copyright } from "@/components/Copyright"
import { EmptyMemories } from "@/components/EmptyMemories"

export default function Home() {
  const isAuthenticated = cookies().has("token")

  return (
    <main className="min-h-screen grid grid-cols-2">
      <div className="flex flex-col items-start justify-between px-28 py-16 relative overflow-hidden border-r border-white/10 bg-[url(../assets/bg-stars.svg)] bg-cover">
        {/* Blur */}
        <div className="w-[526px] h-[288px] rounded-full bg-purple-700 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 blur-full" />

        {/* Stripes */}
        <div className="absolute bottom-0 right-2 top-0 w-2 bg-stripes" />

        {isAuthenticated ? <Profile /> : <SignIn />}
        <Hero />
        <Copyright />
      </div>

      <div className="flex flex-col p-16 bg-[url(../assets/bg-stars.svg)] bg-cover">
        <EmptyMemories />
      </div>
    </main>
  )
}
