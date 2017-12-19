import PropTypes from 'prop-types';
import React     from 'react';

import createPalette from './createPalette';
import mapExcept     from './mapExcept';
import memoize       from './memoize';
import Subject       from './Subject';
import withPalette   from './withPalette';

// Based on https://docs.microsoft.com/en-us/windows/uwp/style/color#color-palette-building-blocks

class Provider extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.createAndMemoizePalette = memoize(createPalette);

    this.state = {
      palette: new Subject(this.createSubjectValue(props))
    };
  }

  componentWillReceiveProps(nextProps) {
    this.state.palette.next(this.createSubjectValue(nextProps));
  }

  createSubjectValue(props) {
    return {
      palette: this.createAndMemoizePalette(props.accent, props.theme),
      ...mapExcept(props, ['children'])
    };
  }

  getChildContext() {
    return this.state;
  }

  render() {
    return this.props.children;
  }
}

Provider.propTypes = {
  accent: PropTypes.string,
  theme : PropTypes.oneOf(['dark', 'light'])
};

Provider.childContextTypes = {
  palette: PropTypes.instanceOf(Subject)
};

export default withPalette((paletteProps, ownProps) => ({
  ...paletteProps,
  ...ownProps
}))(Provider)
