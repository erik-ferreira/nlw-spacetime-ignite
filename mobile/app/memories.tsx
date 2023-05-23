import dayjs from "dayjs"
import ptBr from "dayjs/locale/pt-br"
import { useEffect, useState } from "react"
import { Link, useRouter } from "expo-router"
import Icon from "@expo/vector-icons/Feather"
import * as SecureStore from "expo-secure-store"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { View, ScrollView, TouchableOpacity, Text } from "react-native"

import { api } from "../src/lib/api"

import { MemoryCard, Memory } from "../src/components/MemoryCard"

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg"

dayjs.locale(ptBr)

export default function Memories() {
  const router = useRouter()
  const { bottom, top } = useSafeAreaInsets()

  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync("token")

    router.push("/index")
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync("token")

    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const formatMemories = response?.data?.map((memory) => ({
      ...memory,
      createdAt: dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY"),
    }))

    setMemories(formatMemories)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom + 20, paddingTop: top }}
    >
      <View className="flex-row items-center justify-between mt-4  px-8">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="w-10 h-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6">
        {memories?.length === 0 ? (
          <Text className="px-8 leading-relaxed text-gray-100 text-center mt-10">
            Você ainda não registrou nenhuma lembrança, pressione o botão verde
            acima para criar agora!
          </Text>
        ) : (
          memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))
        )}
      </View>
    </ScrollView>
  )
}
