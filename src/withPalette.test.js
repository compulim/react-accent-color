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
  const WrappedDummy = withPalette((palette, props) => ({
    accent             : palette.accent,
    theme              : palette.theme,
    hoistedFourFiveSize: props.fourFiveSix
  }))(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00" theme="light">
      <WrappedDummy oneTwoThree="123" fourFiveSix="456" />
    </PaletteProvider>
  );

  expect(provider.find('Dummy').props().oneTwoThree).toBe('123');
  expect(provider.find('Dummy').props().accent).toBe('#F00');
  expect(provider.find('Dummy').props().theme).toBe('light');
  expect(provider.find('Dummy').props().hoistedFourFiveSize).toBe('456');
});

it('should refresh with accent color change', () => {
  const paletteFactory = jest.fn();
  const WrappedDummy = withPalette((palette, props) => {
    paletteFactory();

    return {
      myAccent: palette.accent
    };
  })(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00">
      <WrappedDummy oneTwoThree="123" />
    </PaletteProvider>
  );

  expect(paletteFactory).toHaveBeenCalledTimes(1);

  provider.setProps({ accent: '#0F0' });

  expect(provider.find('Dummy').props().oneTwoThree).toBe('123');
  expect(provider.find('Dummy').props().myAccent).toBe('#0F0');

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
});

it('should override palette with accent props', () => {
  const paletteFactory = jest.fn();
  const WrappedDummy = withPalette((palette, props) => {
    paletteFactory();

    return { myAccent: palette.accent + palette.theme };
  })(Dummy);

  const provider = mount(
    <PaletteProvider accent="#F00" theme="dark">
      <WrappedDummy accent="#999" />
    </PaletteProvider>
  );

  expect(provider.getDOMNode()).toMatchSnapshot();
  expect(provider.find('Dummy').props().myAccent).toBe('#999dark');

  provider.setProps({ accent: '#FFF' });

  // Changing provider.accent should not trigger a new update because we have already overrode the accent color
  expect(paletteFactory).toHaveBeenCalledTimes(1);

  provider.setProps({ dummy: '123' });

  // Changing any unrelated provider.props should not trigger any update
  expect(paletteFactory).toHaveBeenCalledTimes(1);

  provider.setProps({ theme: 'light' });

  expect(paletteFactory).toHaveBeenCalledTimes(2);
  expect(provider.find('Dummy').props().myAccent).toBe('#999light');
});

it('should recalculate palette on props change', () => {
  const paletteFactory = jest.fn();
  const WrappedDummy = withPalette((palette, props) => {
    paletteFactory();

    return { myAccent: palette.accent + (props.dummy || '') };
  })(Dummy);

  const wrappedDummy = mount(<WrappedDummy accent="#999" />);

  expect(paletteFactory).toHaveBeenCalledTimes(1);
  expect(wrappedDummy.find('Dummy').props().myAccent).toBe('#999');

  wrappedDummy.setProps({ dummy: 123 });

  expect(paletteFactory).toHaveBeenCalledTimes(2);
  expect(wrappedDummy.find('Dummy').props().myAccent).toBe('#999123');
});

it('should work without <PaletteProvider>', () => {
  const WrappedDummy = withPalette((palette, props) => ({
    accent             : palette.accent,
    theme              : palette.theme,
    hoistedFourFiveSize: props.fourFiveSix
  }))(Dummy);

  const wrappedDummy = mount(
    <WrappedDummy accent="#F00" theme="dark" oneTwoThree="123" fourFiveSix="456" />
  );

  expect(wrappedDummy.find('Dummy').props().oneTwoThree).toBe('123');
  expect(wrappedDummy.find('Dummy').props().accent).toBe('#F00');
  expect(wrappedDummy.find('Dummy').props().theme).toBe('dark');
  expect(wrappedDummy.find('Dummy').props().hoistedFourFiveSize).toBe('456');
});
