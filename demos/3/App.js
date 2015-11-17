import React, { Component } from 'react';
import {TransitionMotion, spring, presets} from 'react-motion';
import each from 'lodash/collection/each';
import map from 'lodash/collection/map';
import pairs from 'lodash/object/pairs';

const CENTRE = 32;
const MAX_POINTS = 12;

const VASE_PATH = {
  a: {type: 'M', x: 22, y: 44,},
  b: {type: 'L', x: 24, y: 54,},
  c: {type: 'L', x: 28, y: 54,},
  d: {type: 'L', x: 34, y: 54,},
  e: {type: 'L', x: 36, y: 44,},
  f: {type: 'L', x: 40, y: 24,},
  g: {type: 'L', x: 38, y: 16,},
  h: {type: 'L', x: 34, y: 12,},
  i: {type: 'L', x: 38, y: 8,},
  j: {type: 'L', x: 20, y: 8,},
  k: {type: 'L', x: 24, y: 12,},
  l: {type: 'L', x: 20, y: 16,},
  m: {type: 'L', x: 18, y: 24,},
};

const HEAD_PATH = {
  a: {type: 'M', x: 22, y: 36,},
  b: {type: 'L', x: 22, y: 44,},
  c: {type: 'L', x: 20, y: 54,},
  d: {type: 'L', x: 24, y: 54,},
  e: {type: 'L', x: 32, y: 48,},
  f: {type: 'L', x: 34, y: 42,},
  g: {type: 'L', x: 36, y: 28,},
  h: {type: 'L', x: 40, y: 8,},
  i: {type: 'L', x: 34, y: 6,},
  j: {type: 'L', x: 30, y: 12,},
  k: {type: 'L', x: 30, y: 20,},
  l: {type: 'L', x: 20, y: 30,},
  m: {type: 'L', x: 24, y: 34,},
};

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drawing: 'a',
      pointsVisible: MAX_POINTS,
      preset: Object.keys(presets)[0],
    };
  }

  toggleDrawing = () => {
    this.setState({
      drawing: this.state.drawing == 'vase' ? 'head' : 'vase',
    });
  }

  addPoint = () => {
    this.setState({
      pointsVisible: this.state.pointsVisible + 1,
    });
  }

  removePoint = () => {
    this.setState({
      pointsVisible: this.state.pointsVisible - 1,
    });
  }

  changePreset = e => {
    this.setState({preset: e.target.value});
  }

  getStyles() {
    const {pointsVisible} = this.state;
    const path = this.state.drawing == 'vase' ? VASE_PATH : HEAD_PATH;
    const pathPoints = pairs(path).slice(0, 1+pointsVisible);

    const styles = {};
    each(pathPoints, ([key, {type, x, y}]) => {
      styles[key] = {
        type,
        x: spring(x, presets[this.state.preset]),
        y: spring(y, presets[this.state.preset]),
      };
    });
    return styles;
  }

  willEnter = (key, {type}) => {
    return {
      type,
      x: spring(CENTRE, presets[this.state.preset]),
      y: spring(CENTRE, presets[this.state.preset]),
    };
  }

  willLeave = (key, {type}) => {
    return {
      type,
      x: spring(CENTRE, presets[this.state.preset]),
      y: spring(CENTRE, presets[this.state.preset]),
    };
  }


  buildPath(interpolatedStyles) {
    return map(interpolatedStyles, ({type, x, y}) => `${type}${x} ${y}`).join(' ') + ' Z';
  }

  renderControls() {
    return (
      <div>
        <button onClick={this.toggleDrawing}>
          show {this.state.drawing == 'vase' ? 'head' : 'vase'}
        </button>
        <button
          onClick={this.addPoint}
          disabled={this.state.pointsVisible == MAX_POINTS}
        >
          +
        </button>
        <button
          onClick={this.removePoint}
          disabled={this.state.pointsVisible == 0}
        >
          -
        </button>
        <select
          value={this.state.preset}
          onChange={this.changePreset}
        >
          {map(presets, (preset, name) => <option key={name} value={name}>{name} {JSON.stringify(preset)}</option>)}
        </select>
      </div>
    );
  }

  renderDrawing() {
    return (
      <TransitionMotion
        styles={this.getStyles()}
        willEnter={this.willEnter}
        willLeave={this.willLeave}>
        {
          interpolatedStyles =>
            <svg
              viewBox='0 0 64 64'
              width='256'
              height='256'
              fill='currentcolor'
            >
              <path
                d={this.buildPath(interpolatedStyles)}
              />
            </svg>
        }
      </TransitionMotion>
    );
  }

  render() {
    return (
      <div>
        {this.renderControls()}
        {this.renderDrawing()}
      </div>
    );
  }
}
