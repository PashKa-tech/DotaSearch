const { shell } = require('electron');

module.exports = {
  openExternal: (url) => shell.openExternal(url)
};
