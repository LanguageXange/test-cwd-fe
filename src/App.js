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
  returnRequestionOptions = (imageUrl) => {
    const PAT = process.env.REACT_APP_CLARIFAI_PAT;
    const USER_ID = process.env.REACT_APP_CLARIFAI_USERID;
    const APP_ID = "main";
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageUrl, // https://samples.clarifai.com/metro-north.jpg
              // https://samples.clarifai.com/BarackObama.jpg
              // https://media.vanityfair.com/photos/554e20ae1aaec7043ea45445/master/w_2560%2Cc_limit/tom-hanks-469805965.jpg
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };
    return requestOptions;
  };
  onButtonSubmit = () => {
    //this.setState({ imageUrl: this.state.input });

    fetch(
      "https://api.clarifai.com/v2/models/face-detection/outputs",
      this.returnRequestionOptions(this.state.input)
    )
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

  // onButtonSubmit = () => {
  //   this.setState({ imageUrl: this.state.input });
  //   fetch("http://localhost:3000/imageurl", {
  //     method: "post",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       input: this.state.input,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       if (response) {
  //         fetch("http://localhost:3000/image", {
  //           method: "put",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             id: this.state.user.id,
  //           }),
  //         })
  //           .then((response) => response.json())
  //           .then((count) => {
  //             this.setState(Object.assign(this.state.user, { entries: count }));
  //           })
  //           .catch(console.log);
  //       }
  //       this.displayFaceBox(this.calculateFaceLocation(response));
  //     })
  //     .catch((err) => console.log(err));
  // };

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
