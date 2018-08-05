import { map, combineLatest } from 'rxjs/operators';
import {
  Store,
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import { IStore } from 'app/shared/interfaces/store.interface';
import {
  IIngredientsTable,
  IIngredientCommon,
} from 'app/shared/states/ingredients/ingredients.interface';
import { getCategoriesAndPizzas } from 'app/shared/states/pizzas-categories/pizzas-categories.selector';
import { ingredientsAdapter } from './ingredients.reducer';

const {
  selectIds: _selectIngredientsIds,
  selectEntities: _selectIngredientsEntities,
  selectAll: _selectIngredientsAll,
  selectTotal: _selectIngredientsTotal,
} = ingredientsAdapter.getSelectors();

export const selectIngredientsState = createFeatureSelector<IIngredientsTable>(
  'ingredients'
);

export const selectIngredientsIds = createSelector(
  selectIngredientsState,
  _selectIngredientsIds
);
export const selectIngredientsEntities = createSelector(
  selectIngredientsState,
  _selectIngredientsEntities
);
export const selectIngredientsAll = createSelector(
  selectIngredientsState,
  _selectIngredientsAll
);
export const selectIngredientsTotal = createSelector(
  selectIngredientsState,
  _selectIngredientsTotal
);

const getIngredientsOfFilteredPizzas: MemoizedSelector<
  object,
  string[]
> = createSelector(getCategoriesAndPizzas, categoriesAndPizzas => {
  const ingredientsOfFilteredPizzas: Set<string> = new Set();

  categoriesAndPizzas.forEach(categorieAndPizzas => {
    categorieAndPizzas.pizzas.forEach(pizza => {
      pizza.ingredientsIds.forEach(ingredientId =>
        ingredientsOfFilteredPizzas.add(ingredientId)
      );
    });
  });

  return Array.from(ingredientsOfFilteredPizzas);
});

export const getIngredients: MemoizedSelector<
  object,
  IIngredientCommon[]
> = createSelector(
  selectIngredientsAll,
  getIngredientsOfFilteredPizzas,
  (ingredients, ingredientsOfFilteredPizzas) =>
    ingredients.map(ingredient => ({
      ...ingredient,
      isSelectable: ingredientsOfFilteredPizzas.includes(ingredient.id),
    }))
);

export const getSelectedIngredientsIds: MemoizedSelector<
  object,
  string[]
> = createSelector(selectIngredientsAll, ingredients =>
  ingredients
    .filter(ingredient => ingredient.isSelected)
    .map(ingredient => ingredient.id)
);

export const getNbIngredientsSelected = createSelector(
  getSelectedIngredientsIds,
  selectedIngredientsIds => selectedIngredientsIds.length
);
