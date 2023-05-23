import { Link } from "expo-router"
import Icon from "@expo/vector-icons/Feather"
import { View, Image, Text, TouchableOpacity } from "react-native"

export interface Memory {
  id: string
  coverUrl: string
  excerpt: string
  createdAt: string
}

interface MemoryCardProps {
  memory: Memory
}

export function MemoryCard({ memory }: MemoryCardProps) {
  return (
    <View className="space-y-4 mb-10">
      <View className="flex-row items-center gap-2">
        <View className="w-5 h-px bg-gray-50" />
        <Text className="font-body text-sm text-gray-100">
          {memory.createdAt}
        </Text>
      </View>

      <View className="space-y-4 px-8">
        <Image
          source={{ uri: memory.coverUrl }}
          className="aspect-video w-full rounded-lg"
          alt=""
        />
        <View>
          <Text className="font-body text-base leading-relaxed text-gray-100">
            {memory.excerpt}
          </Text>
          <Link href="/memories/id" asChild>
            <TouchableOpacity className="flex-row items-center gap-2">
              <Text className="font-body text-sm text-gray-200">Ler mais</Text>
              <Icon name="arrow-right" size={16} color="#9e9ea0" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  )
}
