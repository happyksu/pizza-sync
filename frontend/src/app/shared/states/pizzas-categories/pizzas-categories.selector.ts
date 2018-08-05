import { map, distinctUntilChanged } from 'rxjs/operators';
import {
  Store,
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';
import { Observable } from 'rxjs';
import * as removeAccents from 'remove-accents';
import { IStore } from 'app/shared/interfaces/store.interface';
import {
  IPizzaCategoryWithPizzas,
  IPizzasCategoriesTable,
} from 'app/shared/states/pizzas-categories/pizzas-categories.interface';
import { IPizzaWithIngredients } from 'app/shared/states/pizzas/pizzas.interface';
import { IIngredientsTable } from 'app/shared/states/ingredients/ingredients.interface';
import { pizzasCategoriesAdapter } from './pizzas-categories.reducer';
import {
  selectIngredientsAll,
  selectIngredientsEntities,
} from '../ingredients/ingredients.selector';
import {
  selectPizzasAll,
  selectPizzasEntities,
} from '../pizzas/pizzas.selector';
import { getPizzaSearch } from '../ui/ui.selector';

const {
  selectIds: _selectPizzasCategoriesIds,
  selectEntities: _selectPizzasCategoriesEntities,
  selectAll: _selectPizzasCategoriesAll,
  selectTotal: _selectPizzasCategoriesTotal,
} = pizzasCategoriesAdapter.getSelectors();

export const selectPizzasCategoriesState = createFeatureSelector<
  IPizzasCategoriesTable
>('pizzasCategories');

export const selectPizzasCategoriesIds = createSelector(
  selectPizzasCategoriesState,
  _selectPizzasCategoriesIds
);
export const selectPizzasCategoriesEntities = createSelector(
  selectPizzasCategoriesState,
  _selectPizzasCategoriesEntities
);
export const selectPizzasCategoriesAll = createSelector(
  selectPizzasCategoriesState,
  _selectPizzasCategoriesAll
);
export const selectPizzasCategoriesTotal = createSelector(
  selectPizzasCategoriesState,
  _selectPizzasCategoriesTotal
);

export const getSelectedIngredientsIds: MemoizedSelector<
  object,
  string[]
> = createSelector(selectIngredientsAll, ingredients =>
  ingredients
    .filter(ingredient => ingredient.isSelected)
    .map(ingredient => ingredient.id)
);

function doesPizzaContainsAllSelectedIngredients(
  selectedIngredientsIds: string[],
  pizza: IPizzaWithIngredients
): boolean {
  return selectedIngredientsIds.every(ingredientId =>
    pizza.ingredientsIds.includes(ingredientId)
  );
}

export const getCategoriesAndPizzas: MemoizedSelector<
  object,
  IPizzaCategoryWithPizzas[]
> = createSelector(
  getPizzaSearch,
  selectPizzasEntities,
  selectPizzasCategoriesAll,
  getSelectedIngredientsIds,
  selectIngredientsEntities,
  (
    pizzasSearch,
    pizzasEntities,
    pizzasCategoriesAll,
    selectedIngredientsIds,
    ingredientsEntities
  ) => {
    pizzasSearch = removeAccents(pizzasSearch.toLowerCase());

    return pizzasCategoriesAll
      .map(pizzasCategory => {
        const pizzasCategorie: IPizzaCategoryWithPizzas = {
          ...pizzasCategory,
          pizzas: pizzasCategory.pizzasIds
            .map(pizzaId => ({
              ...pizzasEntities[pizzaId],
              ingredients: pizzasEntities[pizzaId].ingredientsIds.map(
                ingredientId => ingredientsEntities[ingredientId]
              ),
            }))
            .filter(
              p =>
                removeAccents(p.name.toLowerCase()).includes(pizzasSearch) &&
                doesPizzaContainsAllSelectedIngredients(
                  selectedIngredientsIds,
                  p
                )
            ),
        };

        return pizzasCategorie;
      })
      .filter(pizzasCategorie => pizzasCategorie.pizzas.length);
  }
);
