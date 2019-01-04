import React, { Component } from "React";
import { View, Text, Button, Picker, StyleSheet, Platform } from "react-native";
import Video, { TextTrackType } from "react-native-video";

const videoURL =
  "https://devstreaming-cdn.apple.com/videos/wwdc/2016/504m956dgg4hlw2uez9/504/hls_vod_mvp.m3u8"; //WWDC 2016: What's new in HLS

export default class App extends Component {
  state = {
    loading: false,
    errorMessage: null,
    audioTracks: [],
    textTracks: [],
    showSubtitlePicker: false,
    selectedSubtitle: null
  };

  onVideoLoading = () => {
    this.setState({ loading: true });
  };

  onVideoLoaded = ({ audioTracks, textTracks }) => {
    const subtitles = this.getSubtitleTracks(textTracks);
    // could also select a subtitle based on language
    selectedSubtitle = subtitles.length > 0 ? subtitles[0].title : null;
    this.setState({
      textTracks: subtitles,
      audioTracks,
      loading: false,
      selectedSubtitle: selectedSubtitle
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

  renderToolBar() {
    return (
      <View style={styles.toolbar}>
        <Button
          title="Subtitles"
          style={styles.button}
          onPress={() => {
            this.setState({ showSubtitlePicker: true });
          }}
        />
      </View>
    );
  }

  renderSubtitlePicker() {
    const { textTracks, selectedSubtitle } = this.state;
    if (!(textTracks && textTracks.length > 0)) {
      return null;
    }

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
          {textTracks.map(({ title }) => {
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
      selectedSubtitle
    } = this.state;

    const hasSubtitles = !loading && textTracks.length > 0;

    const selectedTextTrack = selectedSubtitle
      ? {
          type: "title",
          value: selectedSubtitle
        }
      : {
          type: "disabled"
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
        />
        {loading && <Text style={styles.loadingText}>Loading...</Text>}
        {errorMessage && (
          <Text style={styles.errorText}>Oops!! {errorMessage}</Text>
        )}
        {hasSubtitles && this.renderToolBar()}
        {hasSubtitles && showSubtitlePicker && this.renderSubtitlePicker()}
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
