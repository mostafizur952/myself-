import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fastyt.downloader',
  appName: 'Fast YT',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
