# Two Network Cameras

Recommended local setup:

```text
Router / switch
  - 192.168.10.1

RowMotion server / OBS PC
  - 192.168.10.10

Camera Start
  - 192.168.10.21

Camera Finish
  - 192.168.10.22
```

Use wired Ethernet when possible. Wi-Fi can work for monitoring, but competition-day video is more stable with cable or a dedicated bridge.

## Browser Preview

Browsers usually cannot play `rtsp://` directly.

Good browser preview formats:

```text
HLS:    http://192.168.10.21:8080/hls/start.m3u8
MJPEG:  http://192.168.10.21:8080/video
WebRTC: provider-specific URL
```

RTSP should be consumed by OBS, VLC, or ffmpeg, then converted to HLS/WebRTC if RowMotion needs a browser preview.

## OBS

In OBS, add each camera as:

```text
Media Source
  rtsp://user:password@192.168.10.21:554/stream1

Media Source
  rtsp://user:password@192.168.10.22:554/stream1
```

Then add RowMotion overlays as Browser Sources.

## GoPro HERO4 Note

GoPro HERO4 Wi-Fi is not recommended as a stable local network camera source for a competition. For HERO4, prefer:

```text
GoPro HERO4 -> micro HDMI -> HDMI capture USB -> OBS
```

Official timing remains in RowMotion TimingEngine and button events, not the camera feed.
