import React, { Component } from 'react';
import ReactDOM from 'react-dom'; // <~~~ for mouse coordinates
import Life from './life';
import './App.css';

/**
 * Life canvas
 */
class LifeCanvas extends Component {

  /**
   * Constructor
   */
  constructor(props) {
    super(props);

    this.life = new Life(props.width, props.height);
    this.life.randomize();
    this.state = { x: 0, y: 0 };

  }

  /**
   * Component did mount
   */
  componentDidMount() {
    requestAnimationFrame(() => {this.animFrame()});
  }

  /**
   * Handle an animation frame
   */
  animFrame() {
    let width = this.props.width;
    let height = this.props.height;

    // Update life and get cells
    let cells = this.life.getCells();

    // Get canvas framebuffer, a packed RGBA array
    let canvas = this.refs.canvas;
    let ctx = canvas.getContext('2d');
    let imageData = ctx.getImageData(0, 0, width, height);

    // Convert the cell values into white or black for the canvas
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {

        // Index needs to be multiplied by 4 because there are 4 array
        // entries per pixel, Red, Green, Blue, and Alpha:
        let index = (y * width + x) * 4;

        let lifeStatus = cells[y][x];
        let color = lifeStatus === 0? 0x00: 0xff;

        // FYI: Alpha channel controls how transparent a pixel is.

        imageData.data[index + 0] = color; // Red channel
        imageData.data[index + 1] = color; // Green channel
        imageData.data[index + 2] = color; // Blue channel
        imageData.data[index + 3] = 0xff;  // Alpha channel, 0xff = opaque
      }
    }

    // Put the new image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    // Next generation of life
    this.life.step();

    // // Request another animation frame
    // requestAnimationFrame(() => {this.animFrame()});
    // After render, draw another frame
    if (!this.stopRequested) {
      requestAnimationFrame(() => {this.animFrame()});
    }
  }

  start() {
    this.stopRequested = false;
    requestAnimationFrame(() => { this.animFrame(); });
  }

  _onMouseMove(e) {
    const position = ReactDOM.findDOMNode(this.refs.elem).getBoundingClientRect();
    console.log(position, e.nativeEvent.offsetX, e.screenX);

    this.setState({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
  }

  /**
   * Render
   */
  render() {
    const { x, y } = this.state;
    const count = `Generations: ${this.life.generation}`;
    return (
      <div ref="elem">
        <canvas ref="canvas" width={this.props.width} height={this.props.height} onMouseMove={this._onMouseMove.bind(this)} />
        <div>
          <button onClick={() => { this.life.randomize(); } }>Randomize</button>
          <button onClick={() => { this.life.clear(); }}>Clear</button>
          <button onClick={() => { this.stopRequested = true; }}>Stop</button>
          <button onClick={() => { this.start(); }}>Start</button>
          <button onClick={console.log("Add a Glider")}>Add a Glider</button>
          <button onClick={console.log("Add a Gosper Glider Gun")}>Add a Gosper Glider Gun</button>
        </div>
        <div>
          <h1>Mouse coordinates: { x } { y }</h1>
        </div>
        <div>
          <h2>{ count }</h2>
        </div>
      </div>
    )
  }
}

/**
 * Life holder component
 */
class LifeApp extends Component {

  /**
   * Render
   */
  render() {
    return (
      <div>
        <LifeCanvas width={400} height={300} />
      </div>
    )
  }
}

/**
 * Outer App component
 */
class App extends Component {

  /**
   * Render
   */
  render() {
    return (
      <div className="App">
        <LifeApp />
      </div>
    );
  }
}

export default App;
