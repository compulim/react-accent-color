import PropTypes     from 'prop-types';
import React         from 'react';

import arrayEqual      from './arrayEqual';
import createPalette   from './createPalette';
import mapEqual        from './mapEqual';
import memoize         from './memoize';
import PaletteProvider from './PaletteProvider';

const DEFAULT_ACCENT = '#0078D7';
const DEFAULT_THEME  = 'light';

function getAccent(props, subject) {
  const subjectValue = subject && subject.getValue();

  return props.accent || (subjectValue && subjectValue.accent) || DEFAULT_ACCENT;
}

function getTheme(props, subject) {
  const subjectValue = subject && subject.getValue();

  return props.theme || (subjectValue && subjectValue.theme) || DEFAULT_THEME;
}

function propsEqual(x, y) {
  const keys = Object.keys(x);

  return (
    arrayEqual(keys, Object.keys(y))
    && keys.every(key, x[key] === y[key])
  );
}

export default function withPalette(propsFactories) {
  return WrappedComponent => {
    const WithPalette = class extends React.Component {
      constructor(props, context) {
        super(props, context);

        const subject = context.palette && context.palette.getValue();

        this.createPalette = memoize(createPalette);
        this.state = this.createState(props, subject, true);
      }

      componentWillMount() {
        this.subscribePalette(this.context);
      }

      componentWillReceiveProps(nextProps, nextContext) {
        let shouldUpdate;

        if (nextContext.palette !== this.context.palette) {
          this.subscribePalette(nextContext);
          shouldUpdate = 1;
        }

        // React may fire componentWillReceiveProps more than it should
        // https://github.com/facebook/react/issues/3610
        if (!mapEqual(nextProps, this.props)) {
          shouldUpdate = 1;
        }

        shouldUpdate && this.setState(() => this.createState(nextProps, nextContext.palette && nextContext.palette.getValue(), true));
      }

      subscribePalette(context) {
        this.unsubscribe && this.unsubscribe();

        if (context.palette) {
          this.unsubscribe = context.palette.subscribe(palette => {
            (!this.props.accent || !this.props.theme) && this.setState(() => this.createState(this.props, palette));
          });
        }
      }

      createState(props, subjectValue = {}, propsChanged = false) {
        const nextPalette = this.createPalette(
          props.accent || subjectValue.accent || DEFAULT_ACCENT,
          props.theme || subjectValue.theme || DEFAULT_THEME
        );

        if (propsChanged || nextPalette !== this.state.palette) {
          return {
            cssProps: propsFactories && propsFactories(nextPalette, props),
            palette : nextPalette
          };
        } else {
          return {};
        }
      }

      render() {
        return (
          <WrappedComponent
            { ...this.state.cssProps }
            { ...this.props }
          />
        );
      }
    };

    WithPalette.contextTypes = PaletteProvider.childContextTypes;
    WithPalette.displayName = `withPalette(${ WrappedComponent.displayName || WrappedComponent.name })`;
    WithPalette.propTypes = {
      accent: PropTypes.string,
      theme : PropTypes.oneOf(['dark', 'light'])
    };

    return WithPalette;
  };
}
