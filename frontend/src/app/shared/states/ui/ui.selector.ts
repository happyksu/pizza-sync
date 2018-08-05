import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IUi } from './ui.interface';

export const selectUiState = createFeatureSelector<IUi>('ui');

export const getPizzaSearch = createSelector(
  selectUiState,
  ui => ui.pizzaSearch
);

export const getIsFilterIngredientVisible = createSelector(
  selectUiState,
  ui => ui.isFilterIngredientVisible
);

export const getIsDialogIdentificationOpen = createSelector(
  selectUiState,
  ui => ui.isDialogIdentificationOpen
);

export const getIsDialogOrderSummaryOpen = createSelector(
  selectUiState,
  ui => ui.isDialogOrderSummaryOpen
);
