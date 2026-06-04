const Image = require('@11ty/eleventy-img');
const path = require('path');

function getImageOptions(src) {
  const extension = path.extname(src).toLowerCase();
  const isAnimatedGif = extension === '.gif';

  return {
    widths: isAnimatedGif ? [240, 320, 480] : [320, 640, 960, 1280],
    formats: isAnimatedGif ? ['webp'] : ['avif', 'webp', 'jpeg'],
    sharpOptions: isAnimatedGif ? { animated: true } : {},
    sharpAvifOptions: {
      quality: 45,
      effort: 4,
    },
    sharpWebpOptions: {
      quality: isAnimatedGif ? 70 : 75,
      effort: 4,
    },
    sharpJpegOptions: {
      quality: 82,
      progressive: true,
      mozjpeg: true,
    },
    filenameFormat: ((id, src, width, format) => {
      const extension = path.extname(src);
      const secondToLastPart = path.normalize(src).split('/').reverse()[1];
      const name = path.basename(src, extension);
      return `${secondToLastPart}-${name}-${width}w.${format}`;
    }),
    urlPath: '/img/',
    outputDir: './_site/img',
    useCache: true,
  };
}

function imageShortCode(src, alt, altShouldBeCaption = true, caption = '', loading = 'lazy', classes = '', sizes = '(min-width: 48rem) 50vw, 100vw', fetchpriority = '') {
  const options = getImageOptions(src);
  Image(src, options);

  const imageAttributes = {
    class: classes,
    alt,
    sizes,
    loading,
    decoding: 'async',
  };

  if (fetchpriority) {
    imageAttributes.fetchpriority = fetchpriority;
  }

  const metadata = Image.statsSync(src, options);
  const html = Image.generateHTML(metadata, imageAttributes, { whitespaceMode: 'inline' });
  const figureCaption = altShouldBeCaption ? alt : caption;
  return figureCaption
    ? `<figure>${html}<figcaption>${figureCaption}</figcaption></figure>`
    : html;
}

module.exports = {
  getImageOptions,
  imageShortCode,
};
