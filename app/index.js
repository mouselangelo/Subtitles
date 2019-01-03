import React, { Component } from "React";
import { View, StyleSheet } from "react-native";
import Video from "react-native-video";

const videoURL =
  "https://cdn.flowkey.com/courses/3-muster-der-schwarzen-tasten-en_2016-03-17_12-03-16.mp4";

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Video style={styles.video} source={{ uri: videoURL }} />
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
  }
});
