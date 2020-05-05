import React, { Component } from "react";
import Loader from "./Loader";
import "./App.css";

class App extends Component {
  componentDidMount() {
    fetch("/count", { cache: "no-store" });
  }

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

  async handleImageClick1(event) {
    this.setState({ isLoading: true });
    document.getElementById("file1").disabled = true;
    document.getElementById("file2").disabled = true;
    document.getElementById("blend").disabled = true;
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
    var imgTag = document.getElementById("img1");
    imgTag.title = selectedFile.name;

    reader.onload = function (event) {
      imgTag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
    this.setState({ imgVal1: true });
    this.setState({ isLoading: false });
    document.getElementById("file1").disabled = false;
    document.getElementById("file2").disabled = false;
    document.getElementById("blend").disabled = false;
  }
  async handleImageClick2(event) {
    this.setState({ isLoading: true });
    document.getElementById("file1").disabled = true;
    document.getElementById("file2").disabled = true;
    document.getElementById("blend").disabled = true;
    var selectedFile = event.target.files[0];
    var reader = new FileReader();

    var imgTag = document.getElementById("img2");
    imgTag.title = selectedFile.name;

    reader.onload = function (event) {
      imgTag.src = event.target.result;
    };

    reader.readAsDataURL(selectedFile);
    this.setState({ imgVal2: true });
    this.setState({ isLoading: false });
    document.getElementById("file1").disabled = false;
    document.getElementById("file2").disabled = false;
    document.getElementById("blend").disabled = false;
  }
  async handleSubmit() {
    this.setState({ err: false });
    document.getElementById("file1").disabled = true;
    document.getElementById("file2").disabled = true;
    document.getElementById("blend").disabled = true;
    if (this.state.imgVal1 && this.state.imgVal2) {
      this.setState({ title: "Blending..." });
      this.setState({ isLoading: true });
      const data = new FormData();
      data.append("file", document.getElementById("file1").files[0]);
      data.append("file", document.getElementById("file2").files[0]);
      await fetch("/blend", {
        method: "POST",
        body: data,
        cache: "no-store",
      }).then((response) => {
        if (response.status === 200) {
          response.blob().then((blob) => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = "pic.jpeg";
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
    document.getElementById("file1").disabled = false;
    document.getElementById("file2").disabled = false;
    document.getElementById("blend").disabled = false;
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
              Go right ahead and blend two faces. Select photo with a single
              person in it.
            </p>
          </div>
          <div className="div2">
            <label>Face 1</label>
            <label>Face 2</label>
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
            <button id="blend" onClick={this.handleSubmit}>
              Blend
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
