import React, { Component } from 'react';
import {TransitionMotion, spring, presets} from 'react-motion';
import each from 'lodash/collection/each';
import map from 'lodash/collection/map';
import range from 'lodash/utility/range';
import classes from './styles.css';
import button from '../button.css';

const ITEM_HEIGHT = 120;
const SPRING_CONFIG = [19, 30];

const ItemTransition = {
  willEnter(key, style) {
    return {
      ...style,
      opacity: spring(0),
      height: spring(0),
    };
  },

  willLeave(key, style) {
    return {
      ...style,
      opacity: spring(0, SPRING_CONFIG),
      height: spring(0, SPRING_CONFIG),
    };
  },

  getStyles(items) {
    const styles = {};
    items.forEach((item) => {
      styles[String(item.id)] = {
        item,
        opacity: spring(2, SPRING_CONFIG),
        height: spring(ITEM_HEIGHT, SPRING_CONFIG),
      };
    });
    return styles;
  },
};

export class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
    }
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

  renderItem = ({item, opacity, height}) => {
    return (
      <div style={{opacity, height}} key={item.id}>
        <button onClick={() => this.handleRemoveItem(item.id)} className={button.small}>&times;</button>
        {item.text}
      </div>
    );
  }

  render() {
    return (
      <div className={classes.outer}>
        <TransitionMotion
          styles={ItemTransition.getStyles(this.state.items)}
          willEnter={ItemTransition.willEnter}
          willLeave={ItemTransition.willLeave}
        >
          {
            (intepolatedStyles) => (
              <div>
                {map(intepolatedStyles, this.renderItem)}
              </div>
            )
          }
        </TransitionMotion>
        <button onClick={this.handleAddItem} className={button.small}>
         Add item
        </button>
      </div>
    );
  }
}
