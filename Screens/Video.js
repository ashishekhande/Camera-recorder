import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Button, ScrollView, Text } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";
import AsyncStorage from "@react-native-community/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function VidScreen(props) {
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const unSubscribe = props.navigation.addListener("focus", async () => {
      try {
        const value = await AsyncStorage.getItem("videos");
        if (value !== null) {
          console.log(JSON.parse(value));
          setVideos(JSON.parse(value));
        }
      } catch (error) {
        console.log(error);
      }
    });

    return () => unSubscribe();
  }, [props]);

  return (
    <View style={styles.container}>
      <ScrollView>
        {videos &&
          videos.map((val, index) => {
            return (
              <View key={index.toString()} style={{ width: "100%" }}>
                <Video
                  ref={video}
                  style={styles.video}
                  source={{
                    uri: val,
                  }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                  onPlaybackStatusUpdate={(status) => setStatus(() => status)}
                />
                <View style={styles.buttons}>
                  <Button
                    title={status.isPlaying ? "Pause" : "Play"}
                    onPress={() =>
                      status.isPlaying
                        ? video.current.pauseAsync()
                        : video.current.playAsync()
                    }
                  />
                </View>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 300,
    height: 300,
    borderWidth: 2,
    borderColor: "grey",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
