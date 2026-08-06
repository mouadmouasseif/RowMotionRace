# Appwrite Setup

Target local endpoint:

```text
http://192.168.10.10/v1
```

Required environment variables:

```text
NEXT_PUBLIC_APPWRITE_ENDPOINT
NEXT_PUBLIC_APPWRITE_PROJECT_ID
NEXT_PUBLIC_APPWRITE_PROJECT_NAME
NEXT_PUBLIC_APPWRITE_DATABASE_ID
APPWRITE_API_KEY
```

For the current cloud project:

```text
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=6a720e5e0025fa8b495d
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=RowMotion-Race
NEXT_PUBLIC_APPWRITE_DATABASE_ID=rowmotion-race
```

`APPWRITE_API_KEY` must be created in the Appwrite console with database permissions before server setup, health checks, or migration can write data.

Initial collections are declared in `src/backend/appwrite/schema.ts`:

- users
- clubs
- athletes
- competitions
- boats
- races
- raceEntries
- timingEvents
- penalties
- timingDevices
- auditLog

Migration rule:

Keep Firebase read access available until data has been verified in Appwrite. Do not delete Firebase integrations until users, clubs, athletes, competitions, races, and results have been migrated and checked.

Setup commands:

```text
npm run appwrite:setup
npm run appwrite:migrate:firebase
```

The setup command creates the operational collections. The migration command copies existing Firebase competitions, races, entries, finishes, timing events, and penalties into Appwrite.
