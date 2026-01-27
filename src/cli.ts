#!/usr/bin/env node

import * as ansis from 'ansis'

const AVATAR_COLORS: Record<string, string> = {
  h: '#879570', // hair
  s: '#E49D23', // skin
  e: '#916034', // eyes
  m: '#EA5514', // mouth
  b: '#6B7757', // belt
  f: '#C5B999', // feet
}

// 9x9 pixel grid
const PIXEL_GRID = [
  ['_', '_', '_', '_', 'h', 'h', 'h', '_', '_'], // row 0
  ['_', '_', '_', 'h', 'h', 'h', 'h', 'h', '_'], // row 1
  ['_', '_', 'e', 's', 'e', 's', 's', 's', '_'], // row 2
  ['_', '_', '_', 's', 's', 's', 's', 's', '_'], // row 3
  ['_', '_', '_', 's', 'm', 's', 's', '_', 's'], // row 4
  ['s', 'h', 'h', 'h', 'h', 'h', 'h', 'h', 'h'], // row 5
  ['_', '_', '_', 'h', 'h', 'h', 'h', '_', '_'], // row 6
  ['_', '_', '_', 'b', 'b', 'b', 'b', '_', '_'], // row 7
  ['_', '_', 'f', 'f', '_', '_', 'f', 'f', '_'], // row 8
]

const avatar = renderAvatar()

// OSC 8 hyperlink (falls back to plain text if unsupported)
const link = (url: string, text: string) => `\x1B]8;;${url}\x1B\\${text}\x1B]8;;\x1B\\`

// Content lines: [text, avatarLine or '']
// Avatar aligned to bottom (ending with feet below Web link)
const lines: [string, string][] = [
  ['', ''],
  [`Hi, I'm ${ansis.bold('Johann')}`, ''],
  ['Developer with an eye for design', ''],
  ['', avatar[0]!],
  [`🐙 ${ansis.yellow('GitHub')}    ${link('https://github.com/johannschopplich', 'github.com/johannschopplich')}`, avatar[1]!],
  [`💼 ${ansis.yellow('LinkedIn')}  ${link('https://www.linkedin.com/in/johann-schopplich/', 'in/johann-schopplich')}`, avatar[2]!],
  [`🌐 ${ansis.yellow('Web')}       ${link('https://johannschopplich.com', 'johannschopplich.com')}`, avatar[3]!],
  ['', avatar[4]!],
]

// Border color (primary green from avatar)
const b = ansis.gray

const box = `
${b('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓')}
${lines.map(([text, av]) => buildLine(text, av)).join('\n')}
${b('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛')}
`

console.log(box)

// Build a line with exact width
function buildLine(text: string, av: string): string {
  if (av) {
    const paddedText = padEnd(text, 44)
    return `${b('┃')}   ${paddedText}   ${av}   ${b('┃')}`
  }
  return `${b('┃')}   ${padEnd(text, 56)}   ${b('┃')}`
}

// Pad string to exact visual width
function padEnd(str: string, width: number): string {
  const currentWidth = visualWidth(str)
  return str + ' '.repeat(Math.max(0, width - currentWidth))
}

// Calculate visual width of string (strips ANSI codes)
function visualWidth(str: string): number {
  const stripped = str
    // eslint-disable-next-line no-control-regex
    .replace(/\x1B\[[0-9;]*m/g, '') // CSI color sequences
    // eslint-disable-next-line no-control-regex
    .replace(/\x1B\]8;;[^\x1B]*\x1B\\/g, '') // OSC 8 hyperlinks
  return stripped.length
}

// Render avatar as 5 terminal lines (exactly 9 chars wide each)
function renderAvatar(): string[] {
  const lines: string[] = []
  for (let row = 0; row < 9; row += 2) {
    let line = ''
    for (let col = 0; col < 9; col++) {
      const top = AVATAR_COLORS[PIXEL_GRID[row]![col]!]
      const bot = row + 1 < 9 ? AVATAR_COLORS[PIXEL_GRID[row + 1]![col]!] : undefined
      line += renderCell(top, bot)
    }
    lines.push(line)
  }
  return lines
}

// Render a single cell using half-blocks
function renderCell(top: string | undefined, bottom: string | undefined): string {
  if (!top && !bottom)
    return ' '
  if (!top && bottom)
    return ansis.hex(bottom)('▄')
  if (top && !bottom)
    return ansis.hex(top)('▀')
  // Both colors present: use ▄ with bg=top, fg=bottom
  return ansis.bgHex(top!).hex(bottom!)('▄')
}
