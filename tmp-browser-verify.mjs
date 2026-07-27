import { chromium } from 'file:///C:/Users/DELL/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const outDir = 'C:/Users/DELL/.codex/visualizations/2026/07/27/019fa1b9-83b5-7e62-998c-2fcb46e407a1'
await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--disable-gpu', '--no-first-run', '--no-default-browser-check'],
})

const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } })
await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' })
await page.waitForTimeout(1500)

const buttons = await page.locator('button').allTextContents()
await writeFile(join(outDir, 'landing-buttons.txt'), buttons.join('\n'), 'utf8')
await page.screenshot({ path: join(outDir, 'landing.png'), fullPage: true })

await browser.close()
