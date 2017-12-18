import PropTypes from 'prop-types';
import React     from 'react';

import createPalette from './createPalette';
import Subject       from './Subject';

// Based on https://docs.microsoft.com/en-us/windows/uwp/style/color#color-palette-building-blocks

export default class Palette extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      palette: new Subject({
        accent : props.accent,
        palette: createPalette(props.accent, props.theme),
        theme  : props.theme
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.accent !== this.props.accent
      || nextProps.theme !== this.props.theme
    ) {
      this.state.palette.next({
        accent : nextProps.accent,
        palette: createPalette(nextProps.accent, nextProps.theme),
        theme  : nextProps.theme
      });
    }
  }

  getChildContext() {
    return this.state;
  }

  render() {
    return this.props.children;
  }
}

Palette.childContextTypes = {
  palette: PropTypes.instanceOf(Subject)
};

Palette.defaultProps = {
  accent: '#0078D7',
  theme : 'light'
};

Palette.propTypes = {
  accent: PropTypes.string,
  theme : PropTypes.oneOf(['dark', 'light'])
};

Palette.defaultAccents = [
  '#FFB900',
  '#FF8C00',
  '#F7630C',
  '#CA5010',
  '#DA3B01',
  '#EF6950',
  '#D13438',
  '#FF4343',
  '#E74856',
  '#E81123',
  '#EA005E',
  '#C30052',
  '#E3008C',
  '#BF0077',
  '#C239B3',
  '#9A0089',
  '#0078D7',
  '#0063B1',
  '#8E8CD8',
  '#6B69D6',
  '#8764B8',
  '#744DA9',
  '#B146C2',
  '#881798',
  '#0099BC',
  '#2D7D9A',
  '#00B7C3',
  '#038387',
  '#00B294',
  '#018574',
  '#00CC6A',
  '#10893E',
  '#7A7574',
  '#5D5A58',
  '#68768A',
  '#515C6B',
  '#567C73',
  '#486860',
  '#498205',
  '#107C10',
  '#767676',
  '#4C4A48',
  '#69797E',
  '#4A5459',
  '#647C64',
  '#525E54',
  '#847574',
  '#7E735F'
].reduce((defaultAccents, color) => {
  defaultAccents[color] = color;

  return defaultAccents;
}, {})
