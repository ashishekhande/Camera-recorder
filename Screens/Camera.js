import React, { useState, useEffect, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-community/async-storage";

export default function CamScreen(props) {
  // const videos = React.useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  // const [picture, setPicture] = useState();
  const [recording, setRecording] = useState(false);
  const [video, setVideo] = useState();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const func1 = async () => {
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.AUDIO_RECORDING
      );
      setHasPermission(status === "granted");
    };
    func1();
    try {
      const value = AsyncStorage.getItem("videos");
      if (value !== null) {
        console.log(JSON.parse(value));
        setVideos(JSON.parse(value));
      }
    } catch (error) {}
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {!video ? (
        <Camera
          style={{ flex: 1 }}
          type={type}
          ref={(ref) => {
            setCameraRef(ref);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: "flex-end",
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Ionicons
                name={
                  Platform.OS === "ios"
                    ? "ios-camera-outline"
                    : "camera-reverse-outline"
                }
                size={40}
                color="white"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={async () => {
                if (cameraRef) {
                  let photo = await cameraRef.takePictureAsync();
                  console.log("photo", photo);
                }
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: "white",
                  height: 50,
                  width: 50,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: "white",
                    height: 40,
                    width: 40,
                    backgroundColor: "white",
                  }}
                ></View>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={{ alignSelf: "center" }}
              onPress={async () => {
                if (!recording) {
                  setRecording(true);
                  let video = await cameraRef.recordAsync();
                  setVideo(video.uri);
                  videos.push(video.uri);
                  let a = [];

                  AsyncStorage.getItem("videos")
                    .then((val) => {
                      if (val) {
                        a = JSON.parse(val);
                        a.push(video.uri);
                      }

                      AsyncStorage.setItem("videos", JSON.stringify(a))
                        .then(() => {
                          props.navigation.navigate("Video");
                        })
                        .catch((err) => {
                          console.log(err);
                          throw error;
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      throw error;
                    });
                } else {
                  setRecording(false);
                  cameraRef.stopRecording();
                }
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 25,
                  borderColor: "red",
                  height: 80,
                  width: 80,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderRadius: 25,
                    borderColor: "red",
                    height: 40,
                    width: 40,
                    backgroundColor: "red",
                  }}
                ></View>
              </View>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        <Video
          // ref={videos}
          source={{
            uri: video,
          }}
          useNativeControls
          resizeMode="cover"
          isLooping
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}
