import React, { Component } from "react";
import Loader from "./Loader";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Face Blender",
      imageSrc1: "./img/user.png",
      imageSrc2: "./img/user.png",
      imgVal1: false,
      imgVal2: false,
      isLoading: false,
      err: false,
    };

    this.handleImageClick1 = this.handleImageClick1.bind(this);
    this.handleImageClick2 = this.handleImageClick2.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleImageClick1 = (event) => {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
    var imgTag = document.getElementById("img1");
    imgTag.title = selectedFile.name;

    reader.onload = function (event) {
      imgTag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
    this.setState({ imgVal1: true });
    const data = new FormData();
    data.append("file", document.getElementById("file1").files[0]);
    fetch("/file1", {
      method: "POST",
      body: data,
    }).catch((err) => {
      alert("Error occurred with error: " + err);
    });
  };
  handleImageClick2 = (event) => {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgTag = document.getElementById("img2");
    imgTag.title = selectedFile.name;

    reader.onload = function (event) {
      imgTag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
    this.setState({ imgVal2: true });
    const data = new FormData();
    data.append("file", document.getElementById("file2").files[0]);
    fetch("/file2", {
      method: "POST",
      body: data,
    }).catch((err) => {
      alert("Error occurred with error: " + err);
    });
  };
  async handleSubmit() {
    this.setState({ err: false });
    if (this.state.imgVal1 && this.state.imgVal2) {
      this.setState({ title: "Blending..." });
      this.setState({ isLoading: true });
      await fetch("/blend").then((response) => {
        if (response.status === 200) {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = "pic.png";
            a.click();
          });
        } else {
          this.setState({ isLoading: false });
          this.setState({ title: "Face Blender" });
          alert("Something went wrong\nPlease try again");
          this.setState({ err: true });
        }
      });
      if (!this.state.err) {
        this.setState({ isLoading: false });
        this.setState({ title: "Face Blended" });
      }
    } else {
      alert("Please select both the images");
    }
  }
  render() {
    return (
      <div className="App">
        {this.state.isLoading && <Loader />}
        <div className="main-div">
          <div className="div1">
            <h1>{this.state.title}</h1>
            <br />
            <br />
            <p>Want to see how it looks when two faces merge.</p>
            <br />
            <p>
              Then go right ahead and blend two faces. Select photo with a
              single person in it.
            </p>
          </div>
          <div className="div2">
            <label>Picture 1</label>
            <label>Picture 2</label>
          </div>
          <div className="div5">
            <img
              id="img1"
              src={require(`${this.state.imageSrc1}`)}
              alt="User1"
            ></img>
            <img
              id="img2"
              src={require(`${this.state.imageSrc2}`)}
              alt="User2"
            ></img>
          </div>
          <div className="div4">
            <input
              id="file1"
              type="file"
              accept="image/*"
              onChange={this.handleImageClick1}
            />
            <input
              id="file2"
              type="file"
              accept="image/*"
              onChange={this.handleImageClick2}
            />
          </div>
          <div className="div5">
            <button onClick={this.handleSubmit}>Blend</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
