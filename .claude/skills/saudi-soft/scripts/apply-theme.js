// Injects or replaces the Soft theme bridge into the project's CSS file.
// Usage: node skills/saudi-soft/scripts/apply-theme.js [optional-css-path]
const fs = require("fs")
const path = require("path")

const START = "/* # saudi-soft-theme:start */"
const END = "/* # saudi-soft-theme:end */"

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"))
  } catch {
    return null
  }
}

function resolveCssPath(root, argPath) {
  if (argPath) {
    const abs = path.isAbsolute(argPath) ? argPath : path.join(root, argPath)
    if (!fs.existsSync(abs)) {
      throw new Error(`CSS file not found: ${abs}`)
    }
    return abs
  }

  const componentsJson = readJson(path.join(root, "components.json"))
  const fromConfig = componentsJson?.tailwind?.css
  const candidates = []
  if (fromConfig) candidates.push(path.join(root, fromConfig))
  candidates.push(
    path.join(root, "src/styles/globals.css"),
    path.join(root, "src/index.css"),
    path.join(root, "app/globals.css"),
    path.join(root, "styles/globals.css")
  )

  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  throw new Error(
    "No CSS file found. Pass a path: node apply-theme.js path/to/globals.css"
  )
}

function loadBridge() {
  const bridgePath = path.join(__dirname, "..", "references", "theme-bridge.css")
  if (!fs.existsSync(bridgePath)) {
    throw new Error(`Missing theme bridge at ${bridgePath}`)
  }
  return fs.readFileSync(bridgePath, "utf8").trim() + "\n"
}

function applyTheme() {
  const root = process.cwd()
  const cssPath = resolveCssPath(root, process.argv[2])
  const bridge = loadBridge()
  let css = fs.readFileSync(cssPath, "utf8")

  const startIdx = css.indexOf(START)
  const endIdx = css.indexOf(END)

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const before = css.slice(0, startIdx)
    const after = css.slice(endIdx + END.length).replace(/^\n/, "")
    css = before + bridge + (after.startsWith("\n") ? after : "\n" + after)
    console.log(`Updated Soft theme block in ${path.relative(root, cssPath)}`)
  } else if (startIdx !== -1 || endIdx !== -1) {
    throw new Error(
      "Broken saudi-soft-theme markers (start/end mismatch). Fix manually, then re-run."
    )
  } else {
    if (!css.endsWith("\n")) css += "\n"
    css += "\n" + bridge
    console.log(`Appended Soft theme block to ${path.relative(root, cssPath)}`)
  }

  fs.writeFileSync(cssPath, css, "utf8")
  console.log("Done. Ensure IBM Plex Sans Arabic is loaded and .dark toggling is wired.")
}

try {
  applyTheme()
} catch (err) {
  console.error(err.message || err)
  process.exit(1)
}
