const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', '_site', 'assets', 'manifest.json');

module.exports = function () {
  const fallback = {
    mainCss: '/assets/main.css',
    mainJs: '/assets/main.js',
  };

  if (!fs.existsSync(manifestPath)) {
    return fallback;
  }

  try {
    return {
      ...fallback,
      ...JSON.parse(fs.readFileSync(manifestPath, 'utf8')),
    };
  } catch (error) {
    console.warn(`Could not read webpack asset manifest at ${manifestPath}: ${error.message}`);
    return fallback;
  }
};
