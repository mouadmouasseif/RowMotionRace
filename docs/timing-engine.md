# Timing Engine

Official race time is calculated only from timestamps:

```text
elapsed = finishTimestamp - startTimestamp
```

The visual clock is only display. It must not become the official time source.

Implemented timing pieces:

- Monotonic start and finish capture in `TimingEngine`.
- `HH:MM:SS.mmm`, `MM:SS.mmm`, and `SS.mmm` formatting.
- Duplicate finish protection per target.
- State protection: a finish is rejected before a race starts.

Browser clocks are not official by themselves. Clients should sync with the timing server and record `latencyMs`, `roundTripTimeMs`, and `clockOffsetMs`.
