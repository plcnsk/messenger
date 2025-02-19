import { createFeature, createReducer, on } from '@ngrx/store';
import * as action from './settings.action';

export type AppTheme = 'dark-app-theme' | 'light-app-theme';

export interface SettingsState {
  theme: AppTheme;
}

const initialState: SettingsState = {
  theme: 'dark-app-theme',
};

const feature = createFeature({
  name: 'settingsFeatureKey',
  reducer: createReducer(
    initialState,
    on(
      action.setTheme,
      (state, { theme }): SettingsState => ({
        ...state,
        theme,
      }),
    ),
  ),
});

export const { selectTheme, reducer } = feature;
