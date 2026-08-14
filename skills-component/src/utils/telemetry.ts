export const logEvent = (eventName: string, metadata: object = {}) => {
  // In a production environment, this would send data to your analytics endpoint
  // For now, we log to the browser console to verify the data pipe is open
  console.log(`[TELEMETRY_LOG]: ${eventName}`, metadata);
};
