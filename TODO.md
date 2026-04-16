# Fix Annual Report Display Error (404 Router)

**Status:** In Progress - Route exists, needs rebuild/test.

**Completed:**
- [x] Static serve /attached_assets in server/static.ts (PDF accessible)
- [x] Navbar link in Farmers dropdown
- [x] Client route `/annual-report` in App.tsx
- [x] .htaccess SPA fallback

**Steps:**
1. [ ] `npm run build` - Rebuild client dist/
2. [ ] `cd server-dist && set NODE_ENV=production && node index.js` - Start prod server
3. [ ] Test http://localhost:5000/annual-report - Should load PDF viewer
4. [ ] Check Network tab - PDF 200 OK
5. [ ] Deploy dist/ + attached_assets/ + .htaccess to cPanel
6. [x] Mark complete

**Expected:** Page loads PDF embed, no 404.

**Test Command:** 
```
npm run build
cd server-dist
set NODE_ENV=production
node index.js
# Open localhost:5000/annual-report
```

