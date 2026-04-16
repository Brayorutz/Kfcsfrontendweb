# Production Build & Setup Progress

## Status
- [x] Frontend built → dist/public (1.2MB JS, assets optimized) ✅
- [x] jsonwebtoken installed ✅
- [x] tsconfig.prod.json fixed (CommonJS/node) ✅
- [ ] Backend compile: No errors after fix? Run `npx tsc -p tsconfig.prod.json` [Errors: nodemailer typo, vite.ts import.meta]

## Remaining Steps
1. **Fix compile errors**:
   - server/routes-persistence-fixed.ts: `createTransporter` → `createTransport` (nodemailer)
   - Remove/exclude server/vite.ts (dev-only), vite.config.ts from backend compile
2. `npx tsc -p tsconfig.prod.json` → server-dist/
3. Edit package.json: Add `"build:server": "tsc -p tsconfig.prod.json"`, `"start": "node server-dist/server/index.js"`
4. Strip dev from server/index.ts
5. JWT refactor routes.ts
6. `npm run build && npm run build:server && npm start`

Next: Fix routes-persistence-fixed.ts typo, exclude vite.ts.

