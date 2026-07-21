export const analyticsConfig = {
  gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  clarityId: process.env.NEXT_PUBLIC_CLARITY_ID,
  pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
};

export const isAnalyticsEnabled = () => {
  return typeof window !== 'undefined' && (analyticsConfig.gaId || analyticsConfig.gtmId || analyticsConfig.clarityId || analyticsConfig.pixelId);
};
