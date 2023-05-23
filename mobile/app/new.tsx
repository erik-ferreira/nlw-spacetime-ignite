import { useState } from "react"
import { Link, useRouter } from "expo-router"
import Icon from "@expo/vector-icons/Feather"
import * as SecureStore from "expo-secure-store"
import * as ImagePicker from "expo-image-picker"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
  View,
  Text,
  Image,
  Alert,
  Switch,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native"

import { api } from "../src/lib/api"

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg"

export default function NewMemory() {
  const router = useRouter()
  const { bottom, top } = useSafeAreaInsets()

  const [preview, setPreview] = useState<ImagePicker.ImagePickerAsset | null>(
    null
  )
  const [content, setContent] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  function removePreviewMedia() {
    setPreview(null)
  }

  async function openImagePicker() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        setPreview(result?.assets[0])
      }
    } catch (err) {
      Alert.alert("", "Não foi possível selecionar a imagem")
    }
  }

  async function handleCreateMemory() {
    const token = await SecureStore.getItemAsync("token")

    let coverUrl = ""

    if (preview?.uri) {
      const typeImageRegex = /\.(jpg|jpeg|png)$/
      const imageIsValid = typeImageRegex.test(preview.uri)

      if (!imageIsValid) {
        return Alert.alert("", "Imagem inválida")
      }

      const extension = preview?.uri.match(typeImageRegex)[0].substring(1)

      const uploadFormData = new FormData()

      uploadFormData.append("file", {
        uri: preview?.uri,
        name: "image.jpg",
        type: `image/${extension}`,
      } as any)

      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      coverUrl = uploadResponse?.data?.fileUrl
    }

    await api.post(
      "/memories",
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    router.push("/memories")
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="flex-row items-center justify-between mt-4">
        <NLWLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="w-10 h-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? "#9b79ea" : "#9e9ea0"}
            trackColor={{
              false: "#767577",
              true: "#372560",
            }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <View className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20">
          {preview?.uri ? (
            <View className="w-full h-full relative">
              <Image
                source={{ uri: preview?.uri }}
                className="w-full h-full rounded-lg object-cover"
              />
              <TouchableOpacity
                className="absolute top-2 right-2"
                onPress={removePreviewMedia}
              >
                <Icon name="x" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={openImagePicker}
              className="w-full h-full items-center justify-center"
            >
              <View className="flex-row items-center gap-2">
                <Icon name="image" color="#fff" />
                <Text className="text-sm font-bold text-gray-200">
                  Adicionar foto ou vídeo de capa
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          placeholderTextColor="#56565a"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
