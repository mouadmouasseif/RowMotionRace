# RowMotion Race Live Control Architecture

RowMotion Race is moving to a local-first architecture for competition-day stability.

The official sport workflow must depend only on:

- Local network
- Local timing server
- Self-hosted Appwrite

Internet, cloud streaming, public web sync, and camera feeds are optional layers. Video is never stored as a continuous stream in the database; only metadata, camera state, and replay references belong in data storage.

Core layers:

- Data and timing: Appwrite, timing events, race states, results, jury validation.
- Video live: cameras, OBS Browser Sources, HDMI or LAN output.

New core modules:

- `src/timing/TimingEngine.ts`: monotonic timestamp timing.
- `src/timing/ClockSync.ts`: latency, round trip time, and clock offset calculation.
- `src/timing/RankingEngine.ts`: official ranking with penalties and non-finish statuses.
- `src/race/RaceStateMachine.ts`: allowed race state transitions.
- `src/live/LiveRanking.tsx`: shared live ranking component for public and control screens.

Firebase remains only as a progressive migration source until Appwrite collections are active.
