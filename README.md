# Accent color palette for React

[![Build Status](https://travis-ci.org/compulim/react-accent-color.svg?branch=master)](https://travis-ci.org/compulim/react-accent-color) [![npm version](https://badge.fury.io/js/react-accent-color.svg)](https://badge.fury.io/js/react-accent-color)

Inspired by [UWP color design](https://docs.microsoft.com/en-us/windows/uwp/design/style/color), with light and dark theme.

## Introduction

Theming is tricky.

We believe designers should have ultimate controls on overall design, like margin, padding, and roundness. But sometimes, they may want to delegate some customizations to web developers, like [accent color](https://support.microsoft.com/en-us/help/17144/windows-10-change-desktop-background). We made this library to make the job a little bit easier.

This library is designed to play nice with [`glamor`](https://github.com/threepointone/glamor) and [Redux](https://github.com/reactjs/redux).

## How to use

> Alternatively, you can find our demo at [react-accent-color-testbed](https://github.com/compulim/react-accent-color-testbed) repository.

Do `npm install react-accent-color --save`.

Then, in your code:

* [Hoist colors to props using `withPalette()`](#hoist-colors-to-props-using-withpalette)
* [Add `<PaletteProvider>` to the root of your app](#add-paletteprovider-to-the-root-of-your-app)

### Hoist colors to props using `withPalette()`

Like Redux `connect()`, we use [Higher-Order Components](https://reactjs.org/docs/higher-order-components.html) pattern to hoist colors to props. So you are in control of which colors should be hoisted.

In this example, `accent` color is extracted from `withPalette()` and passed into the component as `fillColor` prop.

You can see list of colors in the palette [here](#colors).

```jsx
import React from 'react';

class MyButton extends React.Component {
  render() {
    return (
      <button style={{ backgroundColor: this.props.fillColor }}>
        { this.props.children }
      </button>
    );
  }
}

export default withPalette(({ palette }) => ({
  fillColor: palette.accent
}))(MyButton)
```

> Tips: You can also hoist on [stateless component](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d).

### Add `<PaletteProvider>` to the root of your app

Select your accent color and theme, then wrap your app with `<PaletteProvider>`.

> See [list of accent colors](https://docs.microsoft.com/en-us/windows/uwp/design/style/color#accent-color) for your project from UWP color design article.

```jsx
import React               from 'react';
import { PaletteProvider } from 'react-prime-ui';

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

> You can choose between `"light"` or `"dark"` theme. We prefer it "light", just like [GitHub](https://github.com/desktop/desktop/issues/2557).

## What's next?

Now you can start using accent colors in your app and components. There are few things you will want to try out.

* [Overriding color for some components](#overriding-color-for-some-components)
* [Mixing colors with props](#mixing-colors-with-props)
* [Creating your color based on theme](#creating-your-color-based-on-theme)
  * [Non-color customization](#non-color-customization)
* [Working with `glamor`](#working-with-glamor)
  * [Making it render fast with `glamor`](#making-it-render-fast-with-glamor)
* [My component has already `connect`-ed with Redux](#my-component-has-already-connect-ed-with-redux)

### Overriding color for some components

If you provide `accent` or `theme` props to the hoisted component, you can override the accent color provided from `<PaletteProvider>`.

The following example added `accent="#E81123"` to `<MyButton>` and will fill it red.

```jsx
<PaletteProvider accent="#0078D7" theme="light">
  <MyButton accent="#E81123">I am red, instead of blue.</MyButton>
</PaletteProvider>
```

> Tips: You can also override accent color by adding another layer of `<PaletteProvider>`.

### Mixing colors with props

In addition to our predefined palette, you can also create new colors from props.

In this example, we set the opacity of the background color by using [`color`](https://npmjs.com/package/color) and varied by passing an `opacity` prop.

```jsx
import color from 'color';

// ...

export default withPalette(({ palette }, props) => ({
  fillColor: color(palette.accent).alpha(props.opacity)
}))(MyButton)
```

And in your app,

```jsx
<PaletteProvider accent="#0078D7" theme="light">
  <MyButton opacity={ 0.5 }>I am transparent</MyButton>
</PaletteProvider>
```

### Creating your color based on theme

In addition to the color palette, you can also create your own colors using `theme` from `<PaletteProvider>`.

```jsx
export default withPalette(({ palette, theme }, props) => ({
  fillColor: theme === 'light' ? palette.accentDark1 : palette.accentLight1
}))(MyButton)
```

#### Non-color customization

In addition to `palette`, all props from `<PaletteProvider>` are passed as first argument to your props factory. In the following example, we are passing `roundness` of `0.5` to `<PaletteProvider>` and it will be piped to `withPalette()`.

```jsx
export default withPalette(({ roundness }) => ({
  borderRadius: 10 * roundness
}))(MyButton)
```

And in your app,

```jsx
<PaletteProvider roundness={ 0.5 }>
  <MyButton>This button is round.</MyButton>
</PaletteProvider>
```

> Tips: You should always consult your designer before customizing any UI designs, they may have designed it intentionally. Don't over-customize!

### Working with glamor

`react-accent-color` is designed to play nice with [`glamor`](https://github.com/threepointone/glamor).

Instead of using `style` props, we can use `glamor` to create CSS style when accent color has updated.

```jsx
import React   from 'react';
import { css } from 'glamor';

const createCSS = palette => css({
  backgroundColor: palette.backgroundColor
});

class MyButton extends React.Component {
  render() {
    return (
      <button { ...this.props.css }>
        { this.props.children }
      </button>
    );
  }
}

export default withPalette(({ palette }) => ({
  css: createCSS(palette)
}))(MyButton)
```

#### Making it render fast with `glamor`

> Tips: `glamor.css()` calls should be done outside of `render()` and avoid calling it more than you need.

The factory function passed to `withPalette` will be called when:

* Any props on `<PaletteProvider>` has changed
* Any props on your component has changed

This could means, every time a prop on `MyButton` has changed, we will call `glamor.css()`. If the props are updated but not leading to any visible change, it could be saved to improve performance.

You can use a memoizer to call `css()` only when there are "meaningful" changes, i.e. changes that would lead to style update. In the following example, `css()` will only be called when either `palette.accent` or `props.opacity` has changed.

> For your convenience, we exported our shallow memoizer with FIFO = 1, inspired by [`reselect`](https://github.com/reactjs/reselect).

```jsx
import { memoize } from 'react-accent-color';

const createCSS = memoize((accent, opacity) => css({
  backgroundColor: color(accent).alpha(opacity)
}));

export default withPalette(({ palette }, props) => ({
  css: createCSS(palette.accent, props.opacity)
}))(MyButton)
```

### My component has already `connect`-ed with Redux

No worries. HOC pattern is designed to play nice with each other, like `connect()` from Redux.

```jsx
export default connect(state => ({
  name: state.userProfile.name
}))(withPalette(({ palette }) => ({
  fillColor: palette.accent
}))(MyButton))
```

> Tips: You can also pass `accent` prop from `connect()` to make your accent color reactive to Redux.

## Colors

We follow [UWP color design](https://docs.microsoft.com/en-us/windows/uwp/design/style/color) and exposed the following colors:

| Color name | Light theme | Dark theme |
| - | - | - |
| `accentDark1` | `{ accentColor.darken(.2) }` | *(Same as light)* |
| `accentDark2` | `{ accentColor.darken(.4) }` | *(Same as light)* |
| `accentDark3` | `{ accentColor.darken(.6) }` | *(Same as light)* |
| `accentLight1` | `{ accentColor.lighten(.2) }` | *(Same as light)* |
| `accentLight2` | `{ accentColor.lighten(.4) }` | *(Same as light)* |
| `accentLight3` | `{ accentColor.lighten(.6) }` | *(Same as light)* |
| `background` | `#FFF` | `#000` |
| `foreground` | `#000` | `#FFF` |
| `baseLow` | `rgba(0, 0, 0, .2)` | `rgba(255, 255, 255, .2)` |
| `baseMediumLow` | `rgba(0, 0, 0, .4)` | `rgba(255, 255, 255, .4)` |
| `baseMedium` | `rgba(0, 0, 0, .6)` | `rgba(255, 255, 255, .6)` |
| `baseMediumHigh` | `rgba(0, 0, 0, .8)` | `rgba(255, 255, 255, .8)` |
| `baseHigh` | `#000` | `#FFF` |
| `altLow` | `rgba(255, 255, 255, .2)` | `rgba(0, 0, 0, .2)` |
| `altMediumLow` | `rgba(255, 255, 255, .4)` | `rgba(0, 0, 0, .4)` |
| `altMedium` | `rgba(255, 255, 255, .6)` | `rgba(0, 0, 0, .6)` |
| `altMediumHigh` | `rgba(255, 255, 255, .8)` | `rgba(0, 0, 0, .8)` |
| `altHigh` | `#FFF` | `#000` |
| `listLow` | `rgba(0, 0, 0, .1)` | `rgba(255, 255, 255, .1)` |
| `listMedium` | `rgba(0, 0, 0, .2)` | `rgba(255, 255, 255, .2)` |
| `listAccentLow` | `{ accentColor.fade(.4) }` | *(Same as light)* |
| `listAccentMedium` | `{ accentColor.fade(.6) }` | *(Same as light)* |
| `listAccentHigh` | `{ accentColor.fade(.7) }` | *(Same as light)* |
| `chromeLow` | `#F2F2F2` | `#171717` |
| `chromeMediumLow` | `#F2F2F2` | `#2B2B2B` |
| `chromeMedium` | `#E6E6E6` | `#1F1F1F` |
| `chromeHigh` | `#CCC` | `#767676` |
| `chromeAltLow` | `#171717` | `#F2F2F2` |
| `chromeDisabledLow` | `#7A7A7A` | `#858585` |
| `chromeDisabledHigh` | `#CCC` | `#333` |
| `chromeBlackLow` | `rgba(0, 0, 0, .2)` | *(Same as light)* |
| `chromeBlackMediumLow` | `rgba(0, 0, 0, .4)` | *(Same as light)* |
| `chromeBlackMedium` | `rgba(0, 0, 0, .8)` | *(Same as light)* |
| `chromeBlackHigh` | `#000` | *(Same as light)* |
| `chromeWhite` | `#FFF` | *(Same as light)* |
| `primaryText` | *(Same as `baseHigh`)* | *(Same as `baseHigh`)* |
| `secondaryText` | *(Same as `baseMedium`)* | *(Same as `baseMedium`)* |
| `disabledUI` | *(Same as `baseMediumLow`)* | *(Same as `baseMediumLow`)* |

### Foreground color

Finding the right foreground color can be tricky because the fill color can be too bright for white text, and vice versa. What's more, for accessibility, it should have contrast ratio of [4.5:1](http://www.w3.org/TR/WCAG20-TECHS/G18.html).

We provide foreground colors from `palette.textOn` maps. For example, to get the foreground color for `listLow` color, you can get it from `palette.textOn.listLow`. For example,

```js
export default withPalette(({ palette }) => ({
  fillColor: palette.listLow,
  color    : palette.textOn.listLow
}))(MyButton)
```

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
