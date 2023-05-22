import { promisify } from "node:util"
import { pipeline } from "node:stream"
import { randomUUID } from "node:crypto"
import { FastifyInstance } from "fastify"
import { extname, resolve } from "node:path"
import { createWriteStream, existsSync, mkdirSync } from "node:fs"

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const upload = await request.file({
      limits: {
        fieldSize: 5_242_880, // 5mb
      },
    })

    if (!upload) {
      return reply.status(400).send({ message: "File not found" })
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)

    if (!isValidFileFormat) {
      return reply.status(400).send({ message: "Format file invalid" })
    }

    const fileId = randomUUID()
    const extension = extname(upload.filename)
    const fileName = fileId.concat(extension)

    const pathNameToSaveFile = resolve(__dirname, "../../uploads/")

    // to create folder if not exists
    if (!existsSync(pathNameToSaveFile)) {
      mkdirSync(pathNameToSaveFile, { recursive: true })
    }

    console.log("pathNameToSaveFile", pathNameToSaveFile)

    const writeStream = createWriteStream(
      resolve(__dirname, "../../uploads/", fileName)
    )

    await pump(upload.file, writeStream)

    // to create url file
    const fullUrl = request.protocol.concat("://").concat(request.hostname)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString()

    return {
      fileUrl,
    }
  })
}
