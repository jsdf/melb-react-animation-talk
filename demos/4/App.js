import React, { Component } from 'react';
import {Motion, spring, presets} from 'react-motion';
import each from 'lodash/collection/each';
import map from 'lodash/collection/map';
import range from 'lodash/utility/range';
import classes from './styles.css';

const springConfig = [300, 50];
const itemsCount = 4;

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      delta: 0,
      mouse: 0,
      isPressed: false,
      lastPressed: 0,
      order: range(itemsCount),
    };
  }

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = (pos, pressY, {pageY}) => {
    this.setState({
      delta: pageY - pressY,
      mouse: pressY,
      isPressed: true,
      lastPressed: pos,
    });
  }

  handleMouseMove = ({pageY}) => {
    const {isPressed, delta, order, lastPressed} = this.state;
    if (!isPressed) return;

    const mouse = pageY - delta;
    const row = clamp(Math.round(mouse / 100), 0, itemsCount - 1);
    const newOrder = reinsert(order, order.indexOf(lastPressed), row);

    this.setState({mouse: mouse, order: newOrder});
  }

  handleMouseUp = () => {
    this.setState({isPressed: false, delta: 0});
  }

  renderItem = (i) => {
    const {mouse, isPressed, lastPressed, order} = this.state;

    const style = lastPressed === i && isPressed ?
      {
        scale: spring(1.1, springConfig),
        shadow: spring(16, springConfig),
        y: mouse,
      } :
      {
        scale: spring(1, springConfig),
        shadow: spring(1, springConfig),
        y: spring(order.indexOf(i) * 100, springConfig),
      };

    return (
      <Motion style={style} key={i}>
        {({scale, shadow, y}) =>
          <div
            onMouseDown={(e) => this.handleMouseDown(i, y, e)}
            className={classes.item}
            style={{
              boxShadow: `rgba(0, 0, 0, 0.2) 0px ${shadow}px ${2 * shadow}px 0px`,
              transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
              WebkitTransform: `translate3d(0, ${y}px, 0) scale(${scale})`,
              zIndex: i === lastPressed ? 99 : i,
            }}>
            {order.indexOf(i) + 1}
          </div>
        }
      </Motion>
    );
  }

  renderItems() {
    return this.state.order.map(this.renderItem);
  }

  render() {
    const {order} = this.state;

    return (
      <div className={classes.outer}>
        <div className={classes.root}>
          {order.map(this.renderItem)}
        </div>
      </div>
    );
  }
}

function reinsert(arr, from, to) {
  const _arr = arr.slice(0);
  const val = _arr[from];
  _arr.splice(from, 1);
  _arr.splice(to, 0, val);
  return _arr;
}

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}
