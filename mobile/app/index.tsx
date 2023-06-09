import { useEffect } from "react"
import { useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { makeRedirectUri, useAuthRequest } from "expo-auth-session"
import { Text, TouchableOpacity, View } from "react-native"

import { api } from "../src/lib/api"

import NLWLogo from "../src/assets/nlw-spacetime-logo.svg"

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/0376059c6053ef27240c",
}

export default function App() {
  const router = useRouter()

  const [_, response, signInWithGithub] = useAuthRequest(
    {
      clientId: "0376059c6053ef27240c",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post("/register", {
      code,
      flag: "mobile",
    })

    const { token } = response?.data

    await SecureStore.setItemAsync("token", token)

    router.push("/memories")
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-200 text-center font-body text-sm leading-relaxed">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
