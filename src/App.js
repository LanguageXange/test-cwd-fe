import React, { Component } from "react";
import ParticlesBg from "particles-bg";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Navigation from "./components/Navigation/Navigation";
import Signin2 from "./components/Signin/Signin2";
import Register2 from "./components/Register/Register2";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import "./App.css";

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

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    // to do - error handling here
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

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    if (this.state.box) {
      this.setState({ box: {} });
    }
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    fetch("http://localhost:3001/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageURL: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status.code === 10000) {
          fetch("http://localhost:3001/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: this.state.user.id,
            }),
          })
            .then((res) => res.json())
            .then((count) =>
              this.setState({ user: { ...this.state.user, entries: count } })
            );
        }

        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch((error) => console.log("nooo error", error));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, input, box } = this.state;
    let config = {
      num: [4, 10],
      rps: 0.8,
      radius: [5, 30],
      life: [1.5, 3],
      v: [0.2, 0.3],
      tha: [-40, 40],
      alpha: [0.6, 0],
      scale: [1, 0.1],
      position: "all", // all or center or {x:1,y:1,width:100,height:100}
      random: 10, // or null,
      g: 0.1, // gravity
    };
    return (
      <div className="App">
        <h1>I'm a class component</h1>
        {/* <ParticlesBg type="custom" bg={true} config={config} /> */}
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />

        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={input} />
          </div>
        ) : route === "signin" ? (
          <Signin2
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        ) : (
          <Register2
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
