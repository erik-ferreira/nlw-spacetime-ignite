import { z } from "zod"
import axios from "axios"
import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"

interface AccessTokenResponseProps {
  access_token: string
}

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request, reply) => {
    const bodySchema = z.object({
      code: z.string(),
      flag: z.enum(["web", "mobile"]),
    })

    const { code, flag } = bodySchema.parse(request.body)

    if (!flag) {
      return reply.status(400).send({ message: "Param flag is required" })
    }

    const client_id =
      flag === "web"
        ? process.env.GITHUB_WEB_CLIENT_ID
        : process.env.GITHUB_MOBILE_CLIENT_ID
    const client_secret =
      flag === "web"
        ? process.env.GITHUB_WEB_CLIENT_SECRET
        : process.env.GITHUB_MOBILE_CLIENT_SECRET

    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      }
    )

    const { access_token }: AccessTokenResponseProps = accessTokenResponse.data

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      name: z.string(),
      login: z.string(),
      avatar_url: z.string().url(),
    })

    const userInfo = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo?.id,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo?.id,
          name: userInfo?.name,
          login: userInfo?.login,
          avatarUrl: userInfo?.avatar_url,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name: user?.name,
        avatarUrl: user?.avatarUrl,
      },
      {
        sub: user?.id,
        expiresIn: "30 days",
      }
    )

    return { token }
  })
}
