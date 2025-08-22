// import { KINGCALLER_API_BASE } from '@/services/kingcaller/kingCallerTypes'; // disabled

export const testKingCallerConnection = async (): Promise<boolean> => {
  console.log('KingCaller API testing disabled - staging endpoint removed');
  return false;
};

export const debugKingCallerAPI = async () => {
  console.log('=== KingCaller API Debug Information ===');
  console.log('API Base URL: disabled - staging endpoint removed');
  console.log('Current Origin:', window.location.origin);
  console.log('Current Protocol:', window.location.protocol);
  
  return {
    apiBase: 'disabled',
    origin: window.location.origin,
    protocol: window.location.protocol,
    isReachable: false
  };
};