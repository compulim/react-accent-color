import PropTypes     from 'prop-types';
import React         from 'react';

import arrayEqual      from './arrayEqual';
import createPalette   from './createPalette';
import mapEqual        from './mapEqual';
import memoize         from './memoize';
import PaletteProvider from './PaletteProvider';

const DEFAULT_ACCENT = '#0078D7';
const DEFAULT_THEME  = 'light';

function propsEqual(x, y) {
  const keys = Object.keys(x);

  return (
    arrayEqual(keys, Object.keys(y))
    && keys.every(key, x[key] === y[key])
  );
}

function mapExcept(map = {}, keys) {
  return Object.keys(map).reduce((nextMap, key) => {
    if (!keys.includes(key)) {
      nextMap[key] = map[key];
    }

    return nextMap;
  }, {});
}

export default function withPalette(propsFactory) {
  return WrappedComponent => {
    const WithPalette = class extends React.Component {
      constructor(props, context) {
        super(props, context);

        const subject = context.palette && context.palette.getValue();

        this.createAndMemoizePalette = memoize(createPalette);
        this.state = this.createState({}, props, subject, true);
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

        shouldUpdate && this.setState(state => this.createState(state, nextProps, nextContext.palette && nextContext.palette.getValue(), true));
      }

      subscribePalette(context) {
        this.unsubscribe && this.unsubscribe();

        if (context.palette) {
          this.unsubscribe = context.palette.subscribe(subjectValue => {
            this.setState(state => this.createState(state, this.props, subjectValue));
          });
        }
      }

      createState(state, props, subjectValue = {}, propsChanged = false) {
        const accent      = props.accent || subjectValue.accent || DEFAULT_ACCENT;
        const theme       = props.theme  || subjectValue.theme  || DEFAULT_THEME;
        const palette     = accent === subjectValue.accent && theme === subjectValue.theme ? subjectValue.palette : this.createAndMemoizePalette(accent, theme);
        const nextHoistedProps = Object.assign(
          {},
          subjectValue,
          {
            accent,
            palette,
            theme
          }
        );
        const hoistedPropsChanged = !mapEqual(
          mapExcept(nextHoistedProps, ['children', 'palette']),
          mapExcept(state.hoistedProps, ['children', 'palette']),
        );

        if (propsChanged || hoistedPropsChanged) {
          return {
            cssProps    : Object.assign({ accent, theme }, propsFactory && propsFactory(nextHoistedProps, props)),
            hoistedProps: nextHoistedProps
          };
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
