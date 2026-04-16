# Director File Download Restriction (Specific vs All)

**Status: Step 1 Complete**

## Plan Steps:
1. Create TODO.md ✅
2. Update DirectorFile interface in server/routes.ts and client/src/pages/DirectorsPortal.tsx: add `isBroadcast: boolean;`
3. Update server/routes.ts POST /api/directors/files: set `isBroadcast: true` when directorId === "all"
4. Update server/routes.ts /director-files middleware: for director role, require `!f.isBroadcast` in matching check, else 404 "File not found"
5. Test: Manager specific upload → director download OK; "all" upload → visible but download fails "file not found"
6. Verify JSON persistence, restart server
7. Complete task
