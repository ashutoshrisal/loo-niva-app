import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.looniva.app',
  appName: 'Loo Niva',
  webDir: '.next',

  server: {
    url: 'http://192.168.1.19:3000',
    cleartext: true
  }
};

export default config;