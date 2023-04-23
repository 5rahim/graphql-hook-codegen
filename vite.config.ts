import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    // alias: {
    //   "@/*": resolve(__dirname, "src/"),
    //   "@ui/*": resolve(__dirname, "src/components/ui/")
    // },
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@ui', replacement: path.resolve(__dirname, 'src/components/ui') },
    ]
  },
  plugins: [react()],
})
