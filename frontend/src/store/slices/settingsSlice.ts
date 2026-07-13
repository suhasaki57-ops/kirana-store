import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StoreSettings {
  storeName: string; storeEmail: string; storePhone: string;
  storeAddress: string; gst: string; currency: string;
  freeDeliveryAbove: number; standardDelivery: number;
  codEnabled: boolean;
}

const DEFAULTS: StoreSettings = {
  storeName: 'Kirana Store', storeEmail: 'support@kiranastore.com',
  storePhone: '+91 98765 43210', storeAddress: '42 Market Road, Mumbai - 400058',
  gst: '27AABCU9603R1ZX', currency: 'INR',
  freeDeliveryAbove: 500, standardDelivery: 49,
  codEnabled: true,
};

const load = (): StoreSettings => {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    const s = localStorage.getItem('kirana_settings');
    return s ? { ...DEFAULTS, ...JSON.parse(s) } : DEFAULTS;
  } catch { return DEFAULTS; }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: { settings: load() },
  reducers: {
    saveSettings: (state, action: PayloadAction<StoreSettings>) => {
      state.settings = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('kirana_settings', JSON.stringify(action.payload));
      }
    },
  },
});

export const { saveSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
