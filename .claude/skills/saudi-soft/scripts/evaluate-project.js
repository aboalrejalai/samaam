// CommonJS — runs in any target project regardless of "type": "module".
const fs = require("fs")
const path = require("path")

const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
}

function exists(p) {
  return fs.existsSync(p)
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"))
  } catch {
    return null
  }
}

function findCssCandidates(root, componentsJson) {
  const list = []
  const fromConfig = componentsJson?.tailwind?.css
  if (fromConfig) list.push(path.join(root, fromConfig))
  for (const rel of [
    "src/styles/globals.css",
    "src/index.css",
    "app/globals.css",
    "styles/globals.css",
  ]) {
    list.push(path.join(root, rel))
  }
  return [...new Set(list)].filter((p) => exists(p))
}

function countUiFiles(root) {
  const dirs = [
    path.join(root, "src"),
    path.join(root, "app"),
    path.join(root, "components"),
  ].filter((d) => exists(d))
  let count = 0
  const stack = [...dirs]
  while (stack.length && count < 400) {
    const dir = stack.pop()
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const ent of entries) {
      if (ent.name === "node_modules" || ent.name === ".git" || ent.name === "dist") continue
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) stack.push(full)
      else if (/\.(tsx|jsx|vue)$/.test(ent.name)) count += 1
    }
  }
  return count
}

function scanRawPalette(root) {
  const sampleDirs = [
    path.join(root, "src"),
    path.join(root, "app"),
    path.join(root, "components"),
  ].filter((d) => exists(d))
  const re = /\b(bg|text|border)-(green|emerald|lime|teal)-\d{2,3}\b/
  let hits = 0
  const examples = []
  const stack = [...sampleDirs]
  let filesChecked = 0
  while (stack.length && filesChecked < 120 && hits < 8) {
    const dir = stack.pop()
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const ent of entries) {
      if (ent.name === "node_modules" || ent.name === ".git") continue
      const full = path.join(dir, ent.name)
      if (ent.isDirectory()) {
        stack.push(full)
        continue
      }
      if (!/\.(tsx|jsx|css)$/.test(ent.name)) continue
      filesChecked += 1
      let text
      try {
        text = fs.readFileSync(full, "utf8")
      } catch {
        continue
      }
      if (re.test(text)) {
        hits += 1
        if (examples.length < 3) examples.push(path.relative(root, full))
      }
    }
  }
  return { hits, examples, filesChecked }
}

function evaluateProject() {
  const root = process.cwd()
  console.log(
    `${colors.cyan}${colors.bold}Saudi Soft — Project Environment Evaluator${colors.reset}\n`
  )

  let score = 0
  const checks = []
  const warnings = []
  let abort = false

  const packagePath = path.join(root, "package.json")
  let pkg = {}
  if (exists(packagePath)) {
    score += 2
    checks.push(`${colors.green}✔ package.json found${colors.reset}`)
    pkg = readJson(packagePath) || {}
  } else {
    checks.push(`${colors.yellow}○ No package.json — treat as empty (Mode A)${colors.reset}`)
  }

  const deps = {
    ...(pkg.dependencies || {}),
    ...(pkg.devDependencies || {}),
  }

  if (deps["platformscode-new-react"]) {
    abort = true
    warnings.push(
      `${colors.red}ABORT: platformscode-new-react is installed — remove it; it breaks Tailwind.${colors.reset}`
    )
  }

  const componentsPath = path.join(root, "components.json")
  let componentsJson = null
  if (exists(componentsPath)) {
    score += 3
    checks.push(`${colors.green}✔ components.json found (shadcn)${colors.reset}`)
    componentsJson = readJson(componentsPath)
  } else {
    checks.push(`${colors.yellow}○ No components.json${colors.reset}`)
  }

  const registries = componentsJson?.registries || {}
  const registryStr = JSON.stringify(registries)
  if (
    registryStr.includes("nds.aboalrejal.com") ||
    registryStr.includes("@dga")
  ) {
    warnings.push(
      `${colors.yellow}⚠ External @dga registry URL detected — Soft installs upstream shadcn components only; do not add @dga/* via this skill.${colors.reset}`
    )
  }

  const hasReact = !!(deps.react && deps["react-dom"])
  if (hasReact) {
    score += 2
    checks.push(`${colors.green}✔ React present${colors.reset}`)
  }

  const hasVite = !!(deps.vite || exists(path.join(root, "vite.config.ts")) || exists(path.join(root, "vite.config.js")))
  const hasNext = !!(deps.next || exists(path.join(root, "next.config.ts")) || exists(path.join(root, "next.config.js")) || exists(path.join(root, "next.config.mjs")))
  if (hasVite || hasNext) {
    score += 1
    checks.push(
      `${colors.green}✔ Framework: ${hasVite ? "Vite" : ""}${hasVite && hasNext ? "+" : ""}${hasNext ? "Next" : ""}${colors.reset}`
    )
  }

  const hasTailwind =
    !!(deps.tailwindcss || deps["@tailwindcss/vite"] || deps["@tailwindcss/postcss"])
  if (hasTailwind) {
    score += 1
    checks.push(`${colors.green}✔ Tailwind dependency present${colors.reset}`)
  }

  const hasLucide = !!deps["lucide-react"]
  if (hasLucide) {
    score += 1
    checks.push(`${colors.green}✔ lucide-react installed${colors.reset}`)
  } else if (componentsJson) {
    warnings.push(`${colors.yellow}⚠ lucide-react missing — Soft requires lucide${colors.reset}`)
  }

  const iconLib = componentsJson?.iconLibrary
  if (iconLib === "lucide") {
    score += 1
    checks.push(`${colors.green}✔ iconLibrary = lucide${colors.reset}`)
  } else if (componentsJson && iconLib) {
    warnings.push(
      `${colors.yellow}⚠ iconLibrary is "${iconLib}" — Soft expects lucide${colors.reset}`
    )
  }

  const cssFiles = findCssCandidates(root, componentsJson)
  let themeApplied = false
  for (const css of cssFiles) {
    const text = fs.readFileSync(css, "utf8")
    if (text.includes("saudi-soft-theme:start") || text.includes("--sa-600")) {
      themeApplied = true
      checks.push(
        `${colors.green}✔ Soft theme markers found in ${path.relative(root, css)}${colors.reset}`
      )
      score += 2
      break
    }
  }
  if (componentsJson && !themeApplied) {
    warnings.push(
      `${colors.yellow}⚠ Soft theme-bridge not detected — run apply-theme.js (Mode B)${colors.reset}`
    )
  }

  if (deps["@aboalrejal/nds-icons"]) {
    warnings.push(
      `${colors.yellow}⚠ Non-lucide icon package (@aboalrejal/nds-icons) present — Soft requires lucide-react only${colors.reset}`
    )
  }

  const uiFileCount = countUiFiles(root)
  const palette = scanRawPalette(root)
  if (palette.hits > 0) {
    warnings.push(
      `${colors.yellow}⚠ Raw green/emerald palette classes in sample (${palette.hits}+ files), e.g. ${palette.examples.join(", ")} — Soft prefers bg-primary / semantic tokens${colors.reset}`
    )
  }

  const looksLegacy =
    componentsJson &&
    !themeApplied &&
    (uiFileCount >= 40 || palette.hits >= 3)

  console.log(checks.join("\n"))
  if (warnings.length) {
    console.log("\n" + warnings.join("\n"))
  }

  console.log(
    `\n${colors.bold}Score: ${score}/13${colors.reset}`
  )
  if (uiFileCount > 0) {
    console.log(`UI files sampled count: ${uiFileCount}`)
  }

  if (abort) {
    console.log(
      `\n${colors.red}${colors.bold}Recommendation: ABORT${colors.reset} — fix blocking dependency first.`
    )
    process.exitCode = 2
    return
  }

  let mode
  if (looksLegacy) {
    mode = "ASK"
    console.log(
      `\n${colors.bold}Recommendation: ASK (legacy / non-Soft)${colors.reset}`
    )
    console.log(
      "Large or non-Soft codebase detected. Ask the user before bulk work:"
    )
    console.log(
      "  1) Theme-only — Soft tokens + new UI only; leave old pages"
    )
    console.log(
      "  2) Soft-native for new work — migrate old pages only when touched"
    )
    console.log(
      "  3) Full Soft migration — only with explicit approval"
    )
  } else if (!exists(packagePath) || (!componentsJson && score < 5)) {
    mode = "A"
    console.log(
      `\n${colors.bold}Recommendation: Mode A${colors.reset} — new project / init shadcn + Soft theme (Soft-native from day one)`
    )
  } else if (componentsJson && !themeApplied) {
    mode = "B"
    console.log(
      `\n${colors.bold}Recommendation: Mode B${colors.reset} — apply Soft theme bridge only`
    )
  } else if (componentsJson && themeApplied) {
    mode = "C"
    console.log(
      `\n${colors.bold}Recommendation: Mode C${colors.reset} — Soft-ready; add components via shadcn CLI`
    )
  } else {
    mode = "A"
    console.log(
      `\n${colors.bold}Recommendation: Mode A${colors.reset} — bootstrap shadcn then Soft theme`
    )
  }

  console.log(`MODE=${mode}`)
}

evaluateProject()
