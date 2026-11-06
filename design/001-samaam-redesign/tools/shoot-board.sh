#!/bin/bash
# Renders an approved board from ../boards with headless Chrome: full page, 1440 wide, 2x.
# The boards are the same files published to the Claude Design canvas; /_blob ids map to ../assets.
# Usage: shoot-board.sh <out-dir> <Board> [Board...]     Boards: Main Console-A Data-A Connectors
#        Knowledge-Base Gaps Audit Readiness Slides About
D="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$1"; shift; mkdir -p "$OUT"; T="$(mktemp -d)"; cp "$D/boards/samaam.css" "$T/"
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
A="$D/assets"
for b in "$@"; do
  sed -e 's#<script src="./support.js"></script>##' \
    -e "s#/_blob/d8a77dd84044646ddbd0b75c5acd66e2#$A/valve.webp#g" \
    -e "s#/_blob/ff0669040f0dfac6c5b5c1d4d1232cc5#$A/kidney-injured.webp#g" \
    -e "s#/_blob/6ec5069e5f57b43088b2613de7f37ada#$A/abdomen.webp#g" \
    -e "s#/_blob/6b916d9a34d396c47462dc869fcb0fc1#$A/kidney-section.webp#g" \
    -e "s#/_blob/80a4d29d6ac4bfeffc55e41e7ad5382a#$A/ct-scanner.webp#g" \
    -e "s#/_blob/a72c6a680267fb8c5b7864c6b89492da#$A/records.webp#g" \
    -e "s#/_blob/e9b0f712ab77ac86e8f97f366f062136#$A/kidney.webp#g" \
    -e "s#/_blob/597fa4cc26ee322bdf5b2282ee3ed32b#$A/liver.webp#g" \
    -e "s#/_blob/26c5ec1220874f66f53fc6f03f520036#$A/injector.webp#g" \
    -e "s#/_blob/26b4af497bd14e72b117eca14c34acf3#$A/contrast-vial.webp#g" \
    -e "s#/_blob/11cc501273b112c2b4c7b7d89289ce99#$A/itu-ai-readiness-hackathon-3rd-prize-2026.jpg#g" \
    "$D/boards/$b.dc.html" > "$T/$b.html"
  echo '<script>addEventListener("load",()=>{document.title="H="+Math.ceil(document.querySelector(".page").getBoundingClientRect().height)})</script>' >> "$T/$b.html"
  H=$("$CH" --headless=new --disable-gpu --allow-file-access-from-files --window-size=1440,1000 --virtual-time-budget=4000 --dump-dom "file://$T/$b.html" 2>/dev/null | grep -o 'H=[0-9]*' | head -1 | cut -d= -f2)
  "$CH" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars --force-device-scale-factor=2 --window-size=1440,"${H:-1400}" --virtual-time-budget=4000 --screenshot="$OUT/$b.png" "file://$T/$b.html" >/dev/null 2>&1
  echo "$b ${H}px"
done
