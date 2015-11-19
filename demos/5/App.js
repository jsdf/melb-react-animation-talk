import React, { Component } from 'react';
import {TransitionMotion, spring, presets} from 'react-motion';
import each from 'lodash/collection/each';
import map from 'lodash/collection/map';
import range from 'lodash/utility/range';
import classes from './styles.css';
import button from '../button.css';

const ITEM_HEIGHT = 120;
const SPRING_CONFIG = [19, 30];
const MAX_STIFFNESS = 500;
const MAX_DAMPING = 150;

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      stiffness: 380,
      damping: 14,
    }
  }

  willEnter = (key, style) => {
    return {
      ...style,
      opacity: spring(0),
      height: spring(0),
    };
  }

  willLeave = (key, style) => {
    const springConfig = [this.state.stiffness, this.state.damping];

    return {
      ...style,
      opacity: spring(0, springConfig),
      height: spring(0, springConfig),
    };
  }

  getStyles(items) {
    const springConfig = [this.state.stiffness, this.state.damping];

    const styles = {};
    items.forEach((item) => {
      styles[String(item.id)] = {
        item,
        opacity: spring(2, springConfig),
        height: spring(ITEM_HEIGHT, springConfig),
      };
    });
    return styles;
  }

  handleChangeStiffness = e => {
    this.setState({stiffness: parseInt(e.target.value, 10)});
  }

  handleChangeDamping = e => {
    this.setState({damping: parseInt(e.target.value, 10)});
  }

  handleRemoveItem = (id) => {
    this.setState({
      items: this.state.items.filter(f => f.id != id),
    });
  }

  handleAddItem = (id) => {
    const nextItemN = this.state.items.length;
    this.setState({
      items: this.state.items.concat({id: nextItemN, text: `Item ${nextItemN}`}),
    });
  }

  renderControls() {
    return (
      <div>
        <button onClick={this.handleAddItem} className={button.small}>
         Add item
        </button>
        <label className={classes.inputBlock}>
          stiffness
          <input
            type="range"
            min={1}
            max={MAX_STIFFNESS}
            value={this.state.stiffness}
            onChange={this.handleChangeStiffness}
          />
        </label>
        <label className={classes.inputBlock}>
          damping
          <input
            type="range"
            min={1}
            max={MAX_DAMPING}
            value={this.state.damping}
            onChange={this.handleChangeDamping}
          />
        </label>
      </div>
    );
  }

  renderItem = ({item, opacity, height}) => {
    const handleRemove = () => this.handleRemoveItem(item.id);

    return (
      <div style={{opacity, height}} key={item.id}>
        <button onClick={handleRemove} className={classes.closeButton}>&times;</button>
        {item.text}
      </div>
    );
  }

  render() {
    return (
      <div className={classes.outer}>
        <TransitionMotion
          styles={this.getStyles(this.state.items)}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {
            (intepolatedStyles) => (
              <div className={classes.items}>
                {map(intepolatedStyles, this.renderItem)}
              </div>
            )
          }
        </TransitionMotion>
        {this.renderControls()}
      </div>
    );
  }
}
