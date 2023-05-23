import dayjs from "dayjs"
import Link from "next/link"
import Image from "next/image"
import ptBR from "dayjs/locale/pt-br"
import { cookies } from "next/headers"
import { ArrowRight } from "lucide-react"

import { api } from "@/lib/api"

import { EmptyMemories } from "@/components/EmptyMemories"

interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

dayjs.locale(ptBR)

export default async function Home() {
  const isAuthenticated = cookies().has("token")

  if (!isAuthenticated) {
    return <EmptyMemories />
  }

  const token = cookies().get("token")?.value

  const response = await api.get<Memory[]>("/memories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const memories = response.data.map((memory) => ({
    ...memory,
    createdAt: dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY"),
  }))

  if (memories.length === 0) {
    return <EmptyMemories />
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => (
        <div key={memory.id} className="space-y-4">
          <time className="flex items-center gap-2 text-sm text-gray-100 -ml-8 before:w-5 before:h-px before:bg-gray-50">
            {memory.createdAt}
          </time>

          <Image
            src={memory.coverUrl}
            alt=""
            width={592}
            height={280}
            className="w-full aspect-video rounded-lg object-cover"
          />

          <p className="text-lg leading-relaxed text-gray-100">
            {memory.excerpt}
          </p>

          <Link
            href={`/memories/${memory.id}`}
            className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
          >
            Ler mais
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ))}
    </div>
  )
}
//
