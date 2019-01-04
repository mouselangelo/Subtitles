import React, { Component } from "React";
import { View, Text, Button, Picker, StyleSheet, Platform } from "react-native";
import Video, { TextTrackType } from "react-native-video";

const videos = [
  "https://devstreaming-cdn.apple.com/videos/wwdc/2016/504m956dgg4hlw2uez9/504/hls_vod_mvp.m3u8", //WWDC 2016: What's new in HLS - multiple subtitles
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8", // multiple audio tracks & subtitles
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8", // 4x3 aspect ratio
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_adv_example_hevc/master.m3u8", // Advanced stream (HEVC/H.264) fMP4
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8", // Advanced stream TS
  "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8" //Advanced stream fMP4
];

const videoURL = videos[1];

export default class App extends Component {
  state = {
    loading: false,
    errorMessage: null,
    audioTracks: [],
    textTracks: [],
    selectedSubtitle: "auto",
    selectedAudioTrackIndex: 0,
    showSubtitlePicker: false,
    showAudioTrackPicker: false
  };

  onVideoLoading = () => {
    this.setState({ loading: true });
  };

  onVideoLoaded = ({ audioTracks, textTracks }) => {
    console.log(audioTracks, textTracks);
    this.setState({
      textTracks,
      audioTracks,
      loading: false
    });
  };

  onVideoError = error => {
    this.setState({
      loading: false,
      errorMessage: error.error.errorString
    });
  };

  getSubtitleTracks = textTracks => {
    // on Android also displays other subtitle formats
    // Filtering those is optional
    if (Platform.OS === "android") {
      return textTracks.filter(({ type }) => {
        return type === TextTrackType.VTT;
      });
    } else {
      return textTracks;
    }
  };

  getSelectedTextTrack = title => {
    if (!title) {
      return {
        type: "disabled"
      };
    }
    if (title === "auto") {
      return {
        type: "system"
      };
    }
    return {
      type: "title",
      value: title
    };
  };

  renderToolBar(hasSubtitles, hasAudioTracks) {
    if (!hasSubtitles && !hasAudioTracks) {
      return null;
    }
    return (
      <View style={styles.toolbar}>
        {hasAudioTracks && (
          <Button
            title="Audio Tracks"
            style={styles.button}
            onPress={() => {
              this.setState({
                showAudioTrackPicker: true,
                showSubtitlePicker: false
              });
            }}
          />
        )}
        {hasSubtitles && (
          <Button
            title="Subtitles"
            style={styles.button}
            onPress={() => {
              this.setState({
                showAudioTrackPicker: false,
                showSubtitlePicker: true
              });
            }}
          />
        )}
      </View>
    );
  }

  renderSubtitlePicker() {
    const { textTracks, selectedSubtitle } = this.state;
    if (!(textTracks && textTracks.length > 0)) {
      return null;
    }

    const subtitles = textTracks.filter(item => {
      return item.title;
    });

    return (
      <View style={{ backgroundColor: "#e0e0e0", padding: 20 }}>
        <Text style={styles.dialogTitle}>Subtitles</Text>
        <Picker
          mode="dialog"
          style={{ minWidth: 240, minHeight: 240 }}
          prompt="Subtitles"
          title="Subtitles"
          selectedValue={selectedSubtitle}
          onValueChange={(itemValue, itemIndex) => {
            const selectedSubtitle = itemIndex > 0 ? itemValue : null;
            this.setState({
              showSubtitlePicker: false,
              selectedSubtitle
            });
          }}
        >
          <Picker.Item label="None" key="none" value="none" />
          <Picker.Item label="Auto (Recommended)" key="auto" value="auto" />
          {subtitles.map(({ title }) => {
            return <Picker.Item label={title} key={title} value={title} />;
          })}
        </Picker>
      </View>
    );
  }

  renderAudioTrackPicker() {
    const { audioTracks, selectedAudioTrackIndex } = this.state;
    if (!(audioTracks && audioTracks.length > 0)) {
      return null;
    }

    const selectedValue = audioTracks[selectedAudioTrackIndex].title;

    return (
      <View style={{ backgroundColor: "#e0e0e0", padding: 20 }}>
        <Text style={styles.dialogTitle}>Audio Tracks</Text>
        <Picker
          mode="dialog"
          style={{ minWidth: 240, minHeight: 240 }}
          prompt="Audio Tracks"
          title="Audio Tracks"
          selectedValue={selectedValue}
          onValueChange={(_, itemIndex) => {
            this.setState({
              showAudioTrackPicker: false,
              selectedAudioTrackIndex: itemIndex
            });
          }}
        >
          {audioTracks.map(({ title }) => {
            return <Picker.Item label={title} key={title} value={title} />;
          })}
        </Picker>
      </View>
    );
  }

  render() {
    const {
      loading,
      errorMessage,
      textTracks,
      showSubtitlePicker,
      selectedSubtitle,
      audioTracks,
      selectedAudioTrackIndex,
      showAudioTrackPicker
    } = this.state;

    const hasSubtitles = !loading && textTracks.length > 0;
    const hasAudioTracks = !loading && audioTracks.length > 1;
    const selectedTextTrack = this.getSelectedTextTrack(selectedSubtitle);

    const selectedAudioTrack = {
      type: "index",
      value: selectedAudioTrackIndex
    };

    return (
      <View style={styles.container}>
        <Video
          ref={videoRef => (this.videoRef = videoRef)}
          useTextureView={false}
          resizeMode="contain"
          style={styles.video}
          source={{ uri: videoURL }}
          onLoadStart={this.onVideoLoading}
          onError={this.onVideoError}
          onLoad={this.onVideoLoaded}
          selectedTextTrack={selectedTextTrack}
          selectedAudioTrack={selectedAudioTrack}
        />
        {loading && <Text style={styles.loadingText}>Loading...</Text>}
        {errorMessage && (
          <Text style={styles.errorText}>Oops!! {errorMessage}</Text>
        )}
        {this.renderToolBar(hasSubtitles, hasAudioTracks)}
        {hasSubtitles && showSubtitlePicker && this.renderSubtitlePicker()}
        {hasAudioTracks &&
          showAudioTrackPicker &&
          this.renderAudioTrackPicker()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000"
  },
  video: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  loadingText: {
    fontSize: 16,
    color: "#ffffff"
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#cc0000"
  },
  toolbar: {
    backgroundColor: "#00000022",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20
  },
  button: {
    fontSize: 10,
    color: "#cccccc"
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center"
  }
});
