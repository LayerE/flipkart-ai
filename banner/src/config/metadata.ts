import packageJson from '~/../package.json';

const cleanUrl = 'banner-ashy.vercel.app'
;

const metadata = {
  website: {
    name: 'Banner-Generator',
    slogan: 'Simple Canvas Banner Generation App',
    description: 'canvas drawing web application, built with TypeScript, React, and Next.js.',
    cleanUrl,
    email: `hello@${cleanUrl}`,
    url: `https://${cleanUrl}`,
    manifest: `https://${cleanUrl}/manifest.json`,
    thumbnail: `https://${cleanUrl}/images/thumbnail.jpg`,
    locale: 'en',
    themeColor: '#FFFFFF',
    version: packageJson.version,
  },
  social: {
    twitter: 'aiboysavr',
  },
  links: {
    github: 'https://github.com/aiboisavr/banner',
  },
  services: {
    googleAnalyticsMeasurementId: 'G-EZDBLF0NEZ',
  },
};

export default metadata;
