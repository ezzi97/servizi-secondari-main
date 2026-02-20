import packageJson from '../package.json';

// ----------------------------------------------------------------------

export type ConfigValue = {
  appName: string;
  appVersion: string;
  /** Base URL for canonical, Open Graph, etc. Set via REACT_APP_SITE_URL. */
  siteUrl: string;
};

// ----------------------------------------------------------------------

export const CONFIG: ConfigValue = {
  appName: 'Pronto Servizi',
  appVersion: packageJson.version,
  siteUrl: process.env.REACT_APP_SITE_URL || 'https://prontoservizi.app',
};
