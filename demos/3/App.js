import React, { Component } from 'react';
import {StaggeredMotion, spring, presets} from 'react-motion';
import last from 'lodash/array/last';
import range from 'lodash/utility/range';
import classes from './styles.css'

const NUM_ITEMS = 10;
const ITEM_HEIGHT = 40;
const MAX_STIFFNESS = 500;
const MAX_DAMPING = 150;

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      stiffness: 120,
      damping: 30,
    };
  }

  toggleOpen = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  changeStiffness = e => {
    this.setState({stiffness: parseInt(e.target.value, 10)});
  }

  changeDamping = e => {
    this.setState({damping: parseInt(e.target.value, 10)});
  }

  nextStyles = prevStyles => {
    const opening = this.state.open;
    const springConfig = [this.state.stiffness, this.state.damping];
    const lastIndex = NUM_ITEMS - 1;

    return prevStyles.map((_, i) => {
      const orderedIndex = opening ? i : lastIndex - i;
      const finalPosition = opening ? lastIndex - orderedIndex : 0;
      const finalOpacity = opening ? 2 : 1;

      if (orderedIndex === 0) { // leader
        return {
          y: spring(finalPosition, springConfig),
          opacity: spring(finalOpacity, springConfig),
        };
      } else {
        const nextAhead = prevStyles[orderedIndex - 1];

        return {
          y: spring(Math.min(finalPosition, nextAhead.y || 0), springConfig),
          opacity: spring(nextAhead.opacity, springConfig),
        };
      }
    });
  }

  renderControls() {
    return (
      <div>
        <button onClick={this.toggleOpen}>
          {this.state.open ? 'close' : 'open'}
        </button>
        <input
          type="range"
          min={0}
          max={MAX_STIFFNESS}
          value={this.state.stiffness}
          onChange={this.changeStiffness}
        />
        <input
          type="range"
          min={0}
          max={MAX_DAMPING}
          value={this.state.damping}
          onChange={this.changeDamping}
        />
      </div>
    );
  }

  renderDrawing() {
    return (
      <StaggeredMotion
        defaultStyles={range(0, NUM_ITEMS).map(() => ({y: 0, opacity: 1}))}
        styles={this.nextStyles}
      >
        {interpolatedStyles =>
          <div className={classes.container} style={{height: (interpolatedStyles[0].y + 1) * ITEM_HEIGHT}}>
            {
              interpolatedStyles.map((itemStyle, i) =>
                <div
                  className={classes.item}
                  key={i}
                  style={{
                    transform: `translateY(${itemStyle.y * ITEM_HEIGHT}px)`,
                    height: ITEM_HEIGHT,
                    opacity: itemStyle.opacity - 1,
                  }}
                >
                 hello
                </div>
              )
            }
          </div>
        }
      </StaggeredMotion>
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
