#!/usr/bin/env node

import * as ansis from 'ansis'

// Layout constants
const AVATAR_SIZE = 9
const TEXT_WIDTH_WITH_AVATAR = 44
const TEXT_WIDTH_WITHOUT_AVATAR = 56

// ANSI escape sequence patterns
// eslint-disable-next-line no-control-regex
const ANSI_COLOR_REGEX = /\x1B\[[0-9;]*m/g
// eslint-disable-next-line no-control-regex
const OSC8_HYPERLINK_REGEX = /\x1B\]8;;[^\x1B]*\x1B\\/g

type PixelChar = '_' | 'h' | 's' | 'e' | 'm' | 'b' | 'f'
type AvatarLines = [string, string, string, string, string]

const AVATAR_COLORS: Record<PixelChar, string | undefined> = {
  _: undefined,
  h: '#879570', // hair
  s: '#E49D23', // skin
  e: '#916034', // eyes
  m: '#EA5514', // mouth
  b: '#6B7757', // belt
  f: '#C5B999', // feet
}

const PIXEL_GRID: PixelChar[][] = [
  ['_', '_', '_', '_', 'h', 'h', 'h', '_', '_'],
  ['_', '_', '_', 'h', 'h', 'h', 'h', 'h', '_'],
  ['_', '_', 'e', 's', 'e', 's', 's', 's', '_'],
  ['_', '_', '_', 's', 's', 's', 's', 's', '_'],
  ['_', '_', '_', 's', 'm', 's', 's', '_', 's'],
  ['s', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h'],
  ['_', '_', '_', 'h', 'h', 'h', 'h', '_', '_'],
  ['_', '_', '_', 'b', 'b', 'b', 'b', '_', '_'],
  ['_', '_', 'f', 'f', '_', '_', 'f', 'f', '_'],
]

const [av0, av1, av2, av3, av4] = renderAvatar()

// OSC 8 hyperlink (falls back to plain text if unsupported)
const link = (url: string, text: string) => `\x1B]8;;${url}\x1B\\${text}\x1B]8;;\x1B\\`

// Content lines: [text, avatarLine or '']
// Avatar aligned to bottom (ending with feet below Web link)
const lines: [string, string][] = [
  ['', ''],
  [`Hi, I'm ${ansis.bold('Johann')}`, ''],
  ['Developer with an eye for design', ''],
  ['', av0],
  [`🐙 ${ansis.yellow('GitHub')}    ${link('https://github.com/johannschopplich', 'github.com/johannschopplich')}`, av1],
  [`💼 ${ansis.yellow('LinkedIn')}  ${link('https://www.linkedin.com/in/johann-schopplich/', 'in/johann-schopplich')}`, av2],
  [`🌐 ${ansis.yellow('Web')}       ${link('https://johannschopplich.com', 'johannschopplich.com')}`, av3],
  ['', av4],
]

// Border color
const border = ansis.gray

const box = `
${border('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${lines.map(([text, av]) => buildLine(text, av)).join('\n')}
${border('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}
`

console.log(box)

// Build a line with exact width
function buildLine(text: string, av: string): string {
  if (av) {
    const paddedText = padEnd(text, TEXT_WIDTH_WITH_AVATAR)
    return `${border('┃')}   ${paddedText}   ${av}   ${border('┃')}`
  }
  return `${border('┃')}   ${padEnd(text, TEXT_WIDTH_WITHOUT_AVATAR)}   ${border('┃')}`
}

// Pad string to exact visual width
function padEnd(str: string, width: number): string {
  const currentWidth = visualWidth(str)
  return str + ' '.repeat(Math.max(0, width - currentWidth))
}

// Calculate visual width of string (strips ANSI codes)
function visualWidth(str: string): number {
  const sanitizedStr = str
    .replace(ANSI_COLOR_REGEX, '')
    .replace(OSC8_HYPERLINK_REGEX, '')
  return sanitizedStr.length
}

// Render avatar as 5 terminal lines (exactly 9 chars wide each)
function renderAvatar(): AvatarLines {
  const lines: string[] = []
  for (let row = 0; row < AVATAR_SIZE; row += 2) {
    let line = ''
    for (let col = 0; col < AVATAR_SIZE; col++) {
      const top = AVATAR_COLORS[PIXEL_GRID[row]![col]!]
      const bot = row + 1 < AVATAR_SIZE ? AVATAR_COLORS[PIXEL_GRID[row + 1]![col]!] : undefined
      line += renderCell(top, bot)
    }
    lines.push(line)
  }
  return lines as AvatarLines
}

// Render a single cell using half-blocks
function renderCell(top?: string, bottom?: string): string {
  if (!top && !bottom)
    return ' '
  if (!top && bottom)
    return ansis.hex(bottom)('▄')
  if (top && !bottom)
    return ansis.hex(top)('▀')
  // Both colors present: use ▄ with bg=top, fg=bottom
  return ansis.bgHex(top!).hex(bottom!)('▄')
}
