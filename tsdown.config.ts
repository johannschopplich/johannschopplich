import type { UserConfig } from 'tsdown/config'
import { defineConfig } from 'tsdown/config'

const config: UserConfig = defineConfig({
  entry: 'src/cli.ts',
  inlineOnly: ['ansis'],
})

export default config
