import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin2 from "./components/Signin/Signin2"; // convert to functional component
import Register2 from "./components/Register/Register2"; // convert to functional component
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";
// https://samples.clarifai.com/metro-north.jpg
// https://samples.clarifai.com/BarackObama.jpg

// separate user state from other
const appInitialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "home",
};

const userInitialState = {
  id: "",
  name: "",
  email: "",
  entries: 0,
};

function WorkingApp() {
  const [appInfo, setAppInfo] = useState(appInitialState);
  const [userInfo, setUserInfo] = useState(userInitialState);
  // destructure
  const { input, box, route } = appInfo;
  const isSignedIn = userInfo.name.length > 0; // simply check if there is a user name
  const loadUser = (userData) => {
    setUserInfo({ ...userInfo, ...userData });
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
    setAppInfo({ ...appInfo, box: box });
  };

  const onInputChange = (event) => {
    // on input change clear the border box
    setAppInfo({ ...appInfo, box: {}, input: event.target.value });
  };

  const onButtonSubmit = () => {
    if (!input) {
      alert("please provide image url");
      return; // don't call the api
    }
    fetch("https://cwd-refactor-backend.onrender.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageURL: input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status.code === 10000) {
          fetch("https://cwd-refactor-backend.onrender.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userInfo.id,
            }),
          })
            .then((res) => res.json())
            .then((count) => setUserInfo({ ...userInfo, entries: count }));
        }

        displayFaceBox(calculateFaceLocation(result));
      })
      .catch((error) => console.log("nooo error", error));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setAppInfo(appInitialState); // reset app state
      setUserInfo(userInitialState); // sign user out
    } else {
      setAppInfo({ ...appInfo, route });
    }
  };

  return (
    <div className="App">
      <h1>I'm App2 - issue fixed </h1>
      <ParticlesBg type="circle" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />

      {route === "home" ? (
        <div>
          <Rank name={userInfo.name} entries={userInfo.entries} />
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

export default WorkingApp;
