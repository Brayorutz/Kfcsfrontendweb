# TODO: Make Directors Portal Data Persistent (No DB)

## Information Gathered:
- server/routes.ts uses in-memory Map directors and array directorFiles - lost on restart.
- JSON files exist: uploads/directors.json, uploads/director-files.json with data.
- Need to load on startup, save after mutations (create account, upload file, delete).

## Plan:
1. Add loadDirectors() and saveDirectors() using fs.readFileSync/writeFileSync(JSON).
2. Add loadDirectorFiles(), saveDirectorFiles().
3. Call load*() at registerRoutes start.
4. Call save*() after POST accounts, POST files, DELETE accounts/:id, DELETE files/:id.

## Dependent files:
- server/routes.ts

## Followup:
- Test create account → restart server → accounts persist.
- Run `node server/index.ts` or dev server restart.

Confirm plan?

