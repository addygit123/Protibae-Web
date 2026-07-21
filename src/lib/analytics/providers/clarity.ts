export const pushClarityEvent = (eventName: string, params?: Record<string, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof window !== 'undefined' && typeof (window as any).clarity === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).clarity('set', eventName, params);
  }
};
