import React, { Component } from "React";
import { View, Text, Button, StyleSheet, Platform } from "react-native";
import Video, { TextTrackType } from "react-native-video";

const videoURL =
  "https://devstreaming-cdn.apple.com/videos/wwdc/2016/504m956dgg4hlw2uez9/504/hls_vod_mvp.m3u8"; //WWDC 2016: What's new in HLS

export default class App extends Component {
  state = {
    loading: false,
    errorMessage: null,
    audioTracks: [],
    textTracks: []
  };

  onVideoLoading = () => {
    this.setState({ loading: true });
  };

  onVideoLoaded = ({ audioTracks, textTracks }) => {
    console.log("Video loaded: ", audioTracks, textTracks);
    const subtitles = this.getSubtitleTracks(textTracks);
    this.setState({
      textTracks: subtitles,
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
            console.log(
              this.state.textTracks.map(item => {
                return item.title;
              })
            );
          }}
        />
      </View>
    );
  }

  render() {
    console.log(this.state);
    const { loading, errorMessage, textTracks } = this.state;
    const hasSubtitles = !loading && textTracks.length > 0;

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
        />
        {loading && <Text style={styles.loadingText}>Loading...</Text>}
        {errorMessage && (
          <Text style={styles.errorText}>Oops!! {errorMessage}</Text>
        )}
        {hasSubtitles && this.renderToolBar()}
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
  }
});
