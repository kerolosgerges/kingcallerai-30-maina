export interface TwilioConfig {
  accountSid: string;
  authToken: string; // Should be stored securely, not in frontend
  phoneNumber: string;
  webhookUrl?: string;
  apiVersion?: string;
}

// Twilio configuration - NOTE: AUTH_TOKEN should be stored securely in backend
export const twilioConfig: TwilioConfig = {
  accountSid: 'AC9103cd7f476d66fb8955dba9be35f9ee',
  authToken: 'cb75940173a326705c35fd44c4e3536f', // Your master auth token
  phoneNumber: '+15128616098',
  webhookUrl: '', // Set webhook URL for incoming calls/SMS
  apiVersion: '2010-04-01'
};

// For development/testing - load from localStorage if available
export const getTwilioConfig = (): TwilioConfig => {
  if (typeof window !== 'undefined') {
    const storedConfig = localStorage.getItem('twilioConfig');
    if (storedConfig) {
      return { ...twilioConfig, ...JSON.parse(storedConfig) };
    }
  }
  return twilioConfig;
};

// Save config to localStorage (for frontend-only approach)
export const saveTwilioConfig = (config: Partial<TwilioConfig>): void => {
  if (typeof window !== 'undefined') {
    const currentConfig = getTwilioConfig();
    const updatedConfig = { ...currentConfig, ...config };
    localStorage.setItem('twilioConfig', JSON.stringify(updatedConfig));
  }
};