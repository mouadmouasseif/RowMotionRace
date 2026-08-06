# Recovery

If Internet fails:

- Continue timing locally.
- Continue jury decisions locally.
- Continue public screen locally.
- Stop only remote public streaming or cloud sync.

If a device disconnects:

- Show offline state on the device.
- Store timing events locally.
- Retry when the local network returns.
- Never discard a button press silently.

If Appwrite becomes unavailable:

- Stop official starts until the timing server and database are healthy.
- Preserve local device queues.
- Export the event journal before restarting services when possible.
