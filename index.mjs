#!/usr/bin/env node

import { exec } from 'node:child_process'
import process from 'node:process'

openUrl('https://johannschopplich.com')

function openUrl(url) {
  switch (process.platform) {
    case 'darwin':
      exec(`open ${url}`)
      break
    case 'win32':
      exec(`start ${url}`)
      break
    case 'linux':
      exec(`xdg-open ${url}`)
      break
    default:
      throw new Error(`Unsupported platform: ${process.platform}`)
  }
}
