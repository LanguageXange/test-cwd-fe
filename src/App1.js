import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin2 from "./components/Signin/Signin2";
import Register2 from "./components/Register/Register2";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";
// https://samples.clarifai.com/metro-north.jpg
// https://samples.clarifai.com/BarackObama.jpg

// issue - when users sign in - the state was reset in onRouteChange
// to fix the issue - we should separate the state see `App2.js`
const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

function App() {
  const [info, setInfo] = useState(initialState);
  console.log("app renders, what is info", info);
  const { input, box, route, isSignedIn, user } = info;
  const loadUser = (userData) => {
    console.log(userData, "what is userdata");
    setInfo({ ...info, user: { ...userData } });
  };
  const calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");

    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setInfo({ ...info, box: box });
  };

  const onInputChange = (event) => {
    if (box) {
      setInfo({ ...info, box: {} });
    }
    setInfo({ ...info, input: event.target.value });
  };

  const onButtonSubmit = () => {
    fetch("http://localhost:3001/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageURL: input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status.code === 10000) {
          fetch("http://localhost:3001/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
            }),
          })
            .then((res) => res.json())
            .then((count) =>
              setInfo(...user, { user: { ...user, entries: count } })
            );
        }

        displayFaceBox(calculateFaceLocation(result));
      })
      .catch((error) => console.log("nooo error", error));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setInfo(initialState);
    } else if (route === "home") {
      setInfo({ ...info, isSignedIn: true, route }); // this line resets the user state because info is the initial state
    } else {
      setInfo({ ...info, isSignedIn: false, route });
    }
  };

  return (
    <div className="App">
      <h1>I'm App1 functional component </h1>
      <ParticlesBg type="circle" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />

      {route === "home" ? (
        <div>
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={input} />
        </div>
      ) : route === "signin" ? (
        <Signin2 loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register2 loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
