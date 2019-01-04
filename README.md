# Subtitles
Experiments with HLS video, multiple subtitles &amp; audio tracks on iOS, Android with React Native

## HTTP Live Streaming (HLS)
### Resources:
[HTTP Live Streaming (HLS) - Apple Developer](https://developer.apple.com/streaming/)

[HTTP Live Streaming: HSL Player for Android | Toptal](https://www.toptal.com/apple/introduction-to-http-live-streaming-hls)

[H264info.com | Downloads and Information for H.264 Movies](http://www.h264info.com)

**Some example HLS videos from Apple:**

[Examples - HTTP Live Streaming - Apple Developer](https://developer.apple.com/streaming/examples/)

**WWDC video (This video is also used in the app and demos):**

[What’s New in HTTP Live Streaming - WWDC 2016 - Videos - Apple Developer](https://developer.apple.com/videos/play/wwdc2016/504/)

**Useful tools provided by Apple:**

[Using HTTP Live Streaming](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/UsingHTTPLiveStreaming/UsingHTTPLiveStreaming.html)



## Briefly:
### HLS basically uses “playlists” (.m3u8) files to tag various media:

- Video tracks (video file or playlists of video file fragments)
- Audio tracks (audio file or playlists of audio file fragments) 
- Text tracks (subtitle file or playlists of subtitle file fragments)

**Note:** iOS only supports subtitles of type `VTT`

### Platform Support:
- iOS - Natively supported
- Android - Supported using [ExoPlayer](https://github.com/google/ExoPlayer)
- Web - [HLS.js](https://github.com/video-dev/hls.js/) seems to be popular. [Check this DEMO](https://hls-js.netlify.com/demo/?src=https%3A%2F%2Fdevstreaming-cdn.apple.com%2Fvideos%2Fwwdc%2F2016%2F504m956dgg4hlw2uez9%2F504%2Fhls_vod_mvp.m3u8&demoConfig=eyJlbmFibGVTdHJlYW1pbmciOnRydWUsImF1dG9SZWNvdmVyRXJyb3IiOnRydWUsImVuYWJsZVdvcmtlciI6dHJ1ZSwiZHVtcGZNUDQiOmZhbHNlLCJsZXZlbENhcHBpbmciOi0xLCJsaW1pdE1ldHJpY3MiOi0xLCJ3aWRldmluZUxpY2Vuc2VVcmwiOiIifQ==)

**Note:** [React Native Video](https://github.com/react-native-community/react-native-video) already supports as it uses [ExoPlayer](https://github.com/google/ExoPlayer)

### Advantages:
- Multiple streams that “auto switch” based on network connectivity
- Multiple audio tracks supported (haven't tested yet)
- Multiple subtitles supported

## About this demo
- Using React Native
- Works on Android and iOS
- Currently only tested display of subtitles

### Gotchas and Notes
- Videos took much longer to load on Android (on Simulator)
- `textTracks` - Array of subtitles: returns different length on Android and iOS.
On Android returns all types on iOS only VTT types.
- Properties of `textTracks` array returned on iOS were different - language on iOS was “English”, on Android was “en”
- On Android (at least on Simulator) - changing the subtitle at runtime - didn’t update the subtitle immediately.
Like with the video - changes reflect after some time, probably network related?
