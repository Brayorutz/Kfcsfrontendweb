#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# build-cpanel.sh
# Builds the React frontend and assembles a ready-to-upload cPanel package.
#
# Usage:
#   bash scripts/build-cpanel.sh
#
# Output:
#   cpanel-deploy/   ← upload the CONTENTS of this folder to public_html/
# ─────────────────────────────────────────────────────────────────────────────
set -e

DEPLOY_DIR="cpanel-deploy"

echo "==> Cleaning previous build..."
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

echo "==> Building React frontend..."
npm run build

# The vite config outputs to dist/public
BUILD_DIR="dist/public"

echo "==> Copying React build..."
cp -r "$BUILD_DIR"/. "$DEPLOY_DIR/"

echo "==> Copying PHP backend..."
cp -r cpanel/api         "$DEPLOY_DIR/api"
cp    cpanel/.htaccess   "$DEPLOY_DIR/.htaccess"

echo "==> Creating data directory (JSON storage + director files)..."
mkdir -p "$DEPLOY_DIR/data/director-files"
cp cpanel/data/.htaccess "$DEPLOY_DIR/data/.htaccess"

echo "==> Copying existing JSON data files (if any)..."
for f in directors director-files financial-records general-downloads custom-categories news; do
  src="uploads/${f}.json"
  if [ -f "$src" ]; then
    cp "$src" "$DEPLOY_DIR/data/${f}.json"
    echo "    Copied $src"
  fi
done
if [ -f "uploads/manager-password.txt" ]; then
  cp uploads/manager-password.txt "$DEPLOY_DIR/data/manager-password.txt"
  echo "    Copied manager-password.txt"
fi

echo "==> Creating upload folders (Apache-served)..."
mkdir -p "$DEPLOY_DIR/financial-records"
mkdir -p "$DEPLOY_DIR/general-downloads"

echo "==> Copying existing uploaded files (if any)..."
if [ -d "uploads/financial-records" ] && [ "$(ls -A uploads/financial-records 2>/dev/null)" ]; then
  cp uploads/financial-records/* "$DEPLOY_DIR/financial-records/" 2>/dev/null || true
fi
if [ -d "uploads/general-downloads" ] && [ "$(ls -A uploads/general-downloads 2>/dev/null)" ]; then
  cp uploads/general-downloads/* "$DEPLOY_DIR/general-downloads/" 2>/dev/null || true
fi
if [ -d "uploads/director-files" ] && [ "$(ls -A uploads/director-files 2>/dev/null)" ]; then
  cp uploads/director-files/* "$DEPLOY_DIR/data/director-files/" 2>/dev/null || true
fi

echo "==> Copying attached_assets (news images, logos, etc.)..."
if [ -d "attached_assets" ]; then
  cp -r attached_assets "$DEPLOY_DIR/attached_assets"
fi

echo ""
echo "✓ Done! Upload the contents of  cpanel-deploy/  to your public_html/ folder."
echo ""
echo "Directory structure on cPanel:"
echo "  public_html/"
echo "  ├── .htaccess"
echo "  ├── index.html          ← React app"
echo "  ├── assets/             ← React JS/CSS"
echo "  ├── api/"
echo "  │   └── index.php       ← PHP API (replaces Node.js)"
echo "  ├── data/               ← JSON data + director files (HTTP-blocked)"
echo "  │   ├── .htaccess       ← Deny all direct access"
echo "  │   ├── directors.json"
echo "  │   ├── news.json"
echo "  │   ├── ...other JSON files"
echo "  │   └── director-files/ ← protected uploads"
echo "  ├── financial-records/  ← publicly served PDFs"
echo "  ├── general-downloads/  ← publicly served files"
echo "  └── attached_assets/    ← news images, logos, etc."
echo ""
echo "Default manager login: manager / kfcs@Manager2024"
echo "(Change via the portal immediately after deployment)"
