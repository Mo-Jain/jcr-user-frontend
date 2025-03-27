import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'in.jaincarrental.www',
  appName: 'JCR',
  webDir: 'public',
  server: {
    url: 'https://carbook-user-frontend.vercel.app', 
    cleartext: true // Allow HTTP for testing
  }
};
export default config;
