import React, { Component } from "React";
import { View, StyleSheet } from "react-native";

export default class App extends Component {
  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222222"
  }
});
