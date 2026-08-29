import type { UserConfig } from 'tsdown/config'
import { defineConfig } from 'tsdown/config'

const config: UserConfig = defineConfig({
  entry: 'src/cli.ts',
  deps: {
    onlyBundle: ['ansis'],
  },
})

export default config
