import { configure, mount } from 'enzyme';
import Adapter              from 'enzyme-adapter-react-16';
import React                from 'react';
import renderer             from 'react-test-renderer';

import PaletteProvider from './PaletteProvider';
import withPalette     from './withPalette';

configure({ adapter: new Adapter() });

const Dummy = props => <div data-accent={ props.accent } />;

Dummy.displayName = 'Dummy';

it('should wrap component with CSS factories', () => {
  const WrappedDummy = withPalette(({ accent, palette, theme }, props) => ({
    accent,
    background: palette.background,
    hoistedFourFiveSix: props.fourFiveSix,
    theme
  }))(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00" theme="light">
      <WrappedDummy oneTwoThree="123" fourFiveSix="456" />
    </PaletteProvider>
  );

  expect(provider.find('Dummy').props()).toHaveProperty('oneTwoThree', '123');
  expect(provider.find('Dummy').props()).toHaveProperty('fourFiveSix', '456');
  expect(provider.find('Dummy').props()).toHaveProperty('accent', '#F00');
  expect(provider.find('Dummy').props()).toHaveProperty('background', '#FFF');
  expect(provider.find('Dummy').props()).toHaveProperty('theme', 'light');
  expect(provider.find('Dummy').props()).toHaveProperty('hoistedFourFiveSix', '456');
});

it('should refresh with accent color change', () => {
  const paletteFactory = jest.fn();
  const WrappedDummy = withPalette(({ palette }, props) => {
    paletteFactory();

    return {
      background: palette.background
    };
  })(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00">
      <WrappedDummy oneTwoThree="123" />
    </PaletteProvider>
  );

  expect(paletteFactory).toHaveBeenCalledTimes(1);

  expect(provider.find('Dummy').props()).toHaveProperty('oneTwoThree', '123');
  expect(provider.find('Dummy').props()).toHaveProperty('background', '#FFF');

  provider.setProps({ accent: '#0F0' });

  expect(provider.find('Dummy').props()).toHaveProperty('oneTwoThree', '123');
  expect(provider.find('Dummy').props()).toHaveProperty('background', '#FFF');

  // React may call componentWillReceiveProps more than it should, so we can't say it called 2 times exactly
  expect(paletteFactory).toHaveBeenCalledTimes(2);
});

it('should not refresh with no color change', () => {
  const paletteFactory = jest.fn();
  const WrappedDummy = withPalette((palette, props) => {
    paletteFactory();

    return {};
  })(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00" theme="light">
      <WrappedDummy oneTwoThree="123" />
    </PaletteProvider>
  );

  expect(paletteFactory).toHaveBeenCalledTimes(1);

  provider.setProps({ accent: '#F00', theme: 'light' });

  // We should not call paletteFactory if there is nothing actually changed
  expect(paletteFactory).toHaveBeenCalledTimes(1);

  provider.setProps({ dummy: '123' });

  // We added a dummy prop to <PaletteProvider>, we should let paletteFactory know about it
  expect(paletteFactory).toHaveBeenCalledTimes(2);
});

it('should override palette with accent props', () => {
  const paletteFactory = jest.fn();
  const WrappedDummy = withPalette(({ accent, palette, theme }, props) => {
    paletteFactory();

    return {
      accent,
      background: palette.background,
      theme
    };
  })(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00" theme="dark">
      <WrappedDummy accent="#999" />
    </PaletteProvider>
  );

  expect(provider.getDOMNode()).toMatchSnapshot();
  expect(provider.find('Dummy').props()).toHaveProperty('accent', '#999');
  expect(provider.find('Dummy').props()).toHaveProperty('background', '#000');
  expect(provider.find('Dummy').props()).toHaveProperty('theme', 'dark');

  provider.setProps({ accent: '#FFF' });

  // Changing provider.accent should not trigger a new update because we have already overrode the accent color
  expect(paletteFactory).toHaveBeenCalledTimes(1);

  provider.setProps({ dummy: '123' });

  expect(paletteFactory).toHaveBeenCalledTimes(2);

  provider.setProps({ theme: 'light' });

  expect(paletteFactory).toHaveBeenCalledTimes(3);
  expect(provider.find('Dummy').props()).toHaveProperty('accent', '#999');
  expect(provider.find('Dummy').props()).toHaveProperty('background', '#FFF');
  expect(provider.find('Dummy').props()).toHaveProperty('theme', 'light');
});

it('should recalculate palette on props change', () => {
  const paletteFactory = jest.fn();
  const WrappedDummy = withPalette(({ palette }, props) => {
    paletteFactory();

    return {
      myAccent: palette.accent + (props.dummy || '')
    };
  })(Dummy);

  const wrappedDummy = mount(<WrappedDummy accent="#999" />);

  expect(paletteFactory).toHaveBeenCalledTimes(1);
  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('myAccent', '#999');

  wrappedDummy.setProps({ dummy: 123 });

  expect(paletteFactory).toHaveBeenCalledTimes(2);
  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('myAccent', '#999123');
});

it('should work without <PaletteProvider>', () => {
  const WrappedDummy = withPalette(({ accent, palette, theme }, props) => ({
    accent,
    background        : palette.background,
    hoistedFourFiveSix: props.fourFiveSix,
    theme
  }))(Dummy);

  const wrappedDummy = mount(
    <WrappedDummy accent="#F00" theme="dark" oneTwoThree="123" fourFiveSix="456" />
  );

  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('oneTwoThree', '123');
  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('fourFiveSix', '456');
  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('accent', '#F00');
  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('background', '#000');
  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('theme', 'dark');
  expect(wrappedDummy.find('Dummy').props()).toHaveProperty('hoistedFourFiveSix', '456');
});

it('should hoist all props from <PaletteProvider>', () => {
  const WrappedDummy = withPalette(({ oneTwoThree }, props) => ({
    hoistedOneTwoThree: oneTwoThree
  }))(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00" theme="light" oneTwoThree={ 123 }>
      <WrappedDummy />
    </PaletteProvider>
  );

  expect(provider.find('Dummy').props().oneTwoThree).toBeUndefined();
  expect(provider.find('Dummy').props()).toHaveProperty('hoistedOneTwoThree', 123);
});

it('should stack multiple <PaletteProvider>', () => {
  const propFactory = jest.fn();
  const WrappedDummy = withPalette(({
    accent,
    fourFiveSix,
    oneTwoThree,
    palette,
    theme
  }, props) => {
    propFactory();

    return {
      accent,
      background: palette.background,
      oneTwoThree,
      fourFiveSix,
      theme
    };
  })(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00" theme="dark" oneTwoThree={ 123 }>
      <PaletteProvider accent="#0F0" fourFiveSix={ 456 } debug={ true }>
        <WrappedDummy />
      </PaletteProvider>
    </PaletteProvider>
  );

  expect(provider.find('Dummy').props()).toHaveProperty('accent', '#0F0');
  expect(provider.find('Dummy').props()).toHaveProperty('background', '#000');
  expect(provider.find('Dummy').props()).toHaveProperty('theme', 'dark');
  expect(provider.find('Dummy').props()).toHaveProperty('oneTwoThree', 123);
  expect(provider.find('Dummy').props()).toHaveProperty('fourFiveSix', 456);
  expect(propFactory).toHaveBeenCalledTimes(1);
});
