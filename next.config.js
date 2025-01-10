import fs from "fs"
import { execSync } from "child_process"

// Get build hash from Git
const buildHash = execSync("git rev-parse HEAD").toString().trim()

// Write version file
fs.writeFileSync("./public/version.json", JSON.stringify({ buildHash }))

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BUILD_HASH: buildHash,
  },
}

export default nextConfig
