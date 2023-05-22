import "./globals.css"

import { ReactNode } from "react"
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from "next/font/google"
import { cookies } from "next/headers"
import { Hero } from "@/components/Hero"
import { SignIn } from "@/components/SignIn"
import { Profile } from "@/components/Profile"
import { Copyright } from "@/components/Copyright"

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" })
const baiJamJuree = BaiJamjuree({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-bai-jamjuree",
})

export const metadata = {
  title: "NLW Spacetime",
  description:
    "Uma cápsula do tempo construída com React, Next.js, TailwindCSS e Typescript",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = cookies().has("token")

  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.variable} ${baiJamJuree.variable} font-sans text-gray-100 bg-gray-900`}
      >
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
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
