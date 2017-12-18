import color from 'color';

function isDark(color) {
  return color.green() * 5 + color.red() * 2 + color.blue() <= 8 * 128;
}

export default function createPalette(accent, theme) {
  const accentColor = color(accent);
  const light = theme === 'light';

  const palette = {
    accent,
    theme,

    accentDark1 : accentColor.darken(.2).string(),
    accentDark2 : accentColor.darken(.4).string(),
    accentDark3 : accentColor.darken(.6).string(),
    accentLight1: accentColor.lighten(.2).string(),
    accentLight2: accentColor.lighten(.4).string(),
    accentLight3: accentColor.lighten(.6).string(),
    background  : light ? '#FFF' : '#000',
    foreground  : light ? '#000' : '#FFF',

    baseLow       : light ? 'rgba(0, 0, 0, .2)' : 'rgba(255, 255, 255, .2)',
    baseMediumLow : light ? 'rgba(0, 0, 0, .4)' : 'rgba(255, 255, 255, .4)',
    baseMedium    : light ? 'rgba(0, 0, 0, .6)' : 'rgba(255, 255, 255, .6)',
    baseMediumHigh: light ? 'rgba(0, 0, 0, .8)' : 'rgba(255, 255, 255, .8)',
    baseHigh      : light ? '#000' : '#FFF',

    altLow       : light ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .2)',
    altMediumLow : light ? 'rgba(255, 255, 255, .4)' : 'rgba(0, 0, 0, .4)',
    altMedium    : light ? 'rgba(255, 255, 255, .6)' : 'rgba(0, 0, 0, .6)',
    altMediumHigh: light ? 'rgba(255, 255, 255, .8)' : 'rgba(0, 0, 0, .8)',
    altHigh      : light ? '#FFF' : '#000',

    listLow         : light ? 'rgba(0, 0, 0, .1)' : 'rgba(255, 255, 255, .1)',
    listMedium      : light ? 'rgba(0, 0, 0, .2)' : 'rgba(255, 255, 255, .2)',
    listAccentLow   : accentColor.fade(.4),
    listAccentMedium: accentColor.fade(.6),
    listAccentHigh  : accentColor.fade(.7),

    chromeLow           : light ? '#F2F2F2' : '#171717',
    chromeMediumLow     : light ? '#F2F2F2' : '#2B2B2B',
    chromeMedium        : light ? '#E6E6E6' : '#1F1F1F',
    chromeHigh          : light ? '#CCC' : '#767676',
    chromeAltLow        : light ? '#171717' : '#F2F2F2',
    chromeDisabledLow   : light ? '#7A7A7A' : '#858585',
    chromeDisabledHigh  : light ? '#CCC' : '#333',
    chromeBlackLow      : 'rgba(0, 0, 0, .2)',
    chromeBlackMediumLow: 'rgba(0, 0, 0, .4)',
    chromeBlackMedium   : 'rgba(0, 0, 0, .8)',
    chromeBlackHigh     : '#000',
    chromeWhite         : '#FFF'
  };

  palette.textOn = Object.keys(palette).reduce((textPalettes, name) => {
    if (name !== 'theme') {
      textPalettes[name] = isDark(color(palette[name])) ? 'white' : 'black';
    }

    return textPalettes;
  }, {});

  palette.primaryText   = palette.baseHigh;
  palette.secondaryText = palette.baseMedium;
  palette.disabledUI    = palette.baseMediumLow;
  palette.contentArea   = palette.contentArea;

  return palette;
}
