# react-accent-color

Accent color management for React, inspired by [UWP color design](https://docs.microsoft.com/en-us/windows/uwp/design/style/color).

## Introduction

Theming is tricky.

We believe designers should have ultimate controls on overall design, like margin, padding, and roundness. But sometimes, they may want to delegate some customizations to web developers, like [accent color](https://support.microsoft.com/en-us/help/17144/windows-10-change-desktop-background). We made this library to make the job a little bit easier.

This library is designed to play nice with [`glamor`](https://github.com/threepointone/glamor) and [`redux`](https://github.com/reactjs/redux).

## How to use

Do `npm install react-accent-color color --save`.

### Add `<PaletteProvider>` to the root of your app

```jsx
import React from 'react';

import { PaletteProvider, withPalette } from 'react-prime-ui';
import MyButton from './UI/MyButton';

export default class App extends React.Component {
  render() {
    return (
      <PaletteProvider accent="#0078D7" theme="light">
        <MyButton>Woohoo!</MyButton>
      </PaletteProvider>
    )
  }
}
```

> You can set `theme` prop to `"light"` or `"dark"`.

### Hoist your component using `withPalette` HOC

In this example, `accent` color is extracted from palette and passed into the component as `fillColor` prop.

```jsx
class MyButton extends React.Component {
  render() {
    return (
      <button style={{ backgroundColor: this.props.fillColor }}>
        { this.props.children }
      </button>
    );
  }
}

export default withPalette(palette => ({
  fillColor: palette.accent
}))(MyButton);
```

### Overriding color

If you provide `accent` or `theme` props to the hoisted component, you can override the accent color provided from `<PaletteProvider>`.

In the previous example, add `accent` props to `<MyButton>`.

```jsx
<PaletteProvider accent="#0078D7" theme="light">
  <MyButton accent="#E81123">I am red, instead of blue.</MyButton>
</PaletteProvider>
```

> You can also override accent color by adding another layer of `<PaletteProvider>`.

### Working with glamor

`react-accent-color` is designed to play nice with [`glamor`](https://github.com/threepointone/glamor).

For example, in the `MyButton`, instead of using `style` props, we can use `glamor` to create CSS style.

```jsx
import { css } from 'glamor';

const createCSS = palette => css({
  backgroundColor: palette.backgroundColor
})

class MyButton extends React.Component {
  render() {
    return (
      <button { ...this.props.css }>
        { this.props.children }
      </button>
    );
  }
}

export default withPalette(palette => ({
  css: createCSS(palette)
}))(MyButton);
```

### Create styles from props

In addition to palette, you can also create style from props.

In this example, we set the opacity of the background color by using [`color`](https://npmjs.com/package/color) and varied by passing `opacity` prop.

```jsx
import color from 'color';

// ...

export default withPalette((palette, props) => ({
  buttonColor: color(palette.accent).alpha(props.opacity)
}))(MyButton)
```

And in your app:

```jsx
<PaletteProvider accent="#0078D7" theme="light">
  <MyButton opacity={ 0.5 }>I am transparent</MyButton>
</PaletteProvider>
```

### My component is `connect`-ed with Redux

No worries. HOC pattern is designed to play nice with each other, like `connect` from `redux`.

```jsx
export default withPalette(palette => ({
  fillColor: palette.accent
}))(connect(state => ({
  name: state.userProfile.name
}))(MyButton))
```

> You can also pass `accent` prop from `connect` to make your accent color available thru `redux`.

## Styles

We follow [UWP color design](https://docs.microsoft.com/en-us/windows/uwp/design/style/color) and exposed the following colors:

> `light` means `theme` prop is set to `"light"`, instead of `"dark"`

| Color name | |
| - | - |
| accentDark1 | `accentColor.darken(.2).string()` |
| accentDark2 | `accentColor.darken(.4).string()` |
| accentDark3 | `accentColor.darken(.6).string()` |
| accentLight1 | `accentColor.lighten(.2).string()` |
| accentLight2 | `accentColor.lighten(.4).string()` |
| accentLight3 | `accentColor.lighten(.6).string()` |
| background | `light ? '#FFF' : '#000'` |
| foreground | `light ? '#000' : '#FFF'` |
| baseLow | `light ? 'rgba(0, 0, 0, .2)' : 'rgba(255, 255, 255, .2)'` |
| baseMediumLow | `light ? 'rgba(0, 0, 0, .4)' : 'rgba(255, 255, 255, .4)'` |
| baseMedium | `light ? 'rgba(0, 0, 0, .6)' : 'rgba(255, 255, 255, .6)'` |
| baseMediumHigh | `light ? 'rgba(0, 0, 0, .8)' : 'rgba(255, 255, 255, .8)'` |
| baseHigh | `light ? '#000' : '#FFF'` |
| altLow | `light ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .2)'` |
| altMediumLow | `light ? 'rgba(255, 255, 255, .4)' : 'rgba(0, 0, 0, .4)'` |
| altMedium | `light ? 'rgba(255, 255, 255, .6)' : 'rgba(0, 0, 0, .6)'` |
| altMediumHigh | `light ? 'rgba(255, 255, 255, .8)' : 'rgba(0, 0, 0, .8)'` |
| altHigh | `light ? '#FFF' : '#000'` |
| listLow | `light ? 'rgba(0, 0, 0, .1)' : 'rgba(255, 255, 255, .1)'` |
| listMedium | `light ? 'rgba(0, 0, 0, .2)' : 'rgba(255, 255, 255, .2)'` |
| listAccentLow | `accentColor.fade(.4)` |
| listAccentMedium | `accentColor.fade(.6)` |
| listAccentHigh | `accentColor.fade(.7)` |
| chromeLow | `light ? '#F2F2F2' : '#171717'` |
| chromeMediumLow | `light ? '#F2F2F2' : '#2B2B2B'` |
| chromeMedium | `light ? '#E6E6E6' : '#1F1F1F'` |
| chromeHigh | `light ? '#CCC' : '#767676'` |
| chromeAltLow | `light ? '#171717' : '#F2F2F2'` |
| chromeDisabledLow | `light ? '#7A7A7A' : '#858585'` |
| chromeDisabledHigh | `light ? '#CCC' : '#333'` |
| chromeBlackLow | `'rgba(0, 0, 0, .2)'` |
| chromeBlackMediumLow | `'rgba(0, 0, 0, .4)'` |
| chromeBlackMedium | `'rgba(0, 0, 0, .8)'` |
| chromeBlackHigh | `'#000'` |
| chromeWhite | `'#FFF'` |

### Foreground color

Finding the right foreground color can be tricky because the fill color can be too bright for white text, and vice versa. What's more, for accessibility, it should have contrast ratio of 4.5:1.

We provide foreground colors from `palette.textOn` maps. For example, to get the foreground color for `listLow` color, you can get it from `palette.textOn.listLow`.

The foreground color is by calculating if the fill color is "dark", using the following algorithm (inspired from UWP):

```js
function isDark(color) {
  return color.green() * 5 + color.red() * 2 + color.blue() <= 8 * 128;
}
```

> Foreground color is either `"white"` or `"black"`.

## Contribution

Like us? [Star](https://github.com/compulim/react-accent-color/stargazers) us.

Doesn't like something? File us an [issue](https://github.com/compulim/react-accent-color/issues).
