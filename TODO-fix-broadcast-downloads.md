## TODO: Fix Broadcast File Downloads for Directors

**Status:** Debug Mode - Issue Persists ✅

### Steps:
- [x] Create this TODO.md  
- [x] Edit server/routes.ts: Broadcast uploads now copy files per director (unique names)
- [ ] Restart server with `node server/index.ts` (old process may be running)
- [ ] **NEW TEST**: Manager upload **NEW** file to "all" directors (old JSON files have shared filenames from before fix). Check console for [BROADCAST-COPY] logs.
- [ ] Director login → download → check server console [DIRECTOR-FILES] logs for filePath, if exists fail then path issue.
- [x] Fixed syntax/TS email createTransporter → createTransport (line 464,487)

**Goal:** Ensure broadcast files downloadable without "FILE NOT AVAILABLE ON SITE" error by isolating physical copies per director.**

