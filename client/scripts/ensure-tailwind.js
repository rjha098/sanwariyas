// Runs automatically before `npm run dev` / `npm run build`.
// This project is built for Tailwind CSS 3.4.19. If a different version ever
// ends up in node_modules (for example after `npm install tailwindcss` or
// `npm update`), Next.js crashes with
//   "It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin".
// This script detects that and puts the correct version back, so the
// error cannot stay broken.
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const WANT = "3.4.19";
const root = path.join(__dirname, "..");

const installedVersion = () => {
  try {
    const pkg = path.join(root, "node_modules", "tailwindcss", "package.json");
    return JSON.parse(fs.readFileSync(pkg, "utf8")).version;
  } catch {
    return null;
  }
};

const current = installedVersion();
if (current === WANT) process.exit(0);

console.log(
  `\n[ensure-tailwind] Found tailwindcss ${current || "(not installed)"}, this project needs ${WANT}. Fixing it now...\n`,
);

try {
  execSync(`npm install tailwindcss@${WANT} --save-dev --save-exact`, {
    cwd: root,
    stdio: "inherit",
  });
} catch {
  console.error(
    `\n[ensure-tailwind] Automatic fix failed. Run this yourself inside the client folder:\n  npm install -D tailwindcss@${WANT}\n`,
  );
  process.exit(1);
}

// stale build cache from the wrong version would keep showing the old error
fs.rmSync(path.join(root, ".next"), { recursive: true, force: true });

if (installedVersion() !== WANT) {
  console.error(
    "[ensure-tailwind] tailwindcss is still not " +
      WANT +
      ". Please run: npm install",
  );
  process.exit(1);
}
console.log(`[ensure-tailwind] OK — tailwindcss ${WANT} restored.\n`);
