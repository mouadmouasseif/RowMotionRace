# ESP32 Timing Button Protocol

Endpoint:

```text
POST /api/timing/event
```

Payload:

```json
{
  "stationId": "finish-01",
  "raceId": "race-18",
  "type": "FINISH_PRESS",
  "deviceTimestamp": 0,
  "sequence": 182
}
```

Server response:

```json
{
  "ok": true,
  "duplicate": false,
  "acknowledgedEventId": "race-18-FINISH-182-1785800000000",
  "serverTimestamp": 1785800000000,
  "latencyMs": 4
}
```

Device requirements:

- Increment `sequence` for every press.
- Retry until acknowledged.
- Keep unsent events locally during network loss.
- Debounce physical presses before sending.
- Treat duplicate acknowledgement as success.
