# OBS Setup

Use Browser Sources for local overlays.

Planned routes:

```text
/live-overlay
/live-ranking
/live-clock
/live-next-race
/live-athlete
/live-winner
/live-results
```

Browser Source settings:

- Use local server URL.
- Enable transparent background where required.
- Keep camera feeds in OBS or hardware video routing, not in Appwrite.
- Use HDMI or LAN output for the big screen.

For two network cameras, configure them in RowMotion at:

```text
/system/cameras
```

Use fixed IPs such as `192.168.10.21` for Start and `192.168.10.22` for Finish.
