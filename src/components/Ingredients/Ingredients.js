import React, { useReducer, useMemo, useEffect, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const ingredientReducer = (currentIngredient, action) => {
  console.log(action);
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD_INGREDIENT":
      return [...currentIngredient, action.ingredient];
    case "DELETE":
      return currentIngredient.filter(
        (ingredientD) => ingredientD.id !== action.id
      );
    default:
      throw new Error("Whoops fatal Error");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const {
    isLoading,
    error,
    data,
    sendRequest,
    requestExtra,
    requestIdentifier,
  } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && requestIdentifier === "REMOVE_INGREDIENT") {
      dispatch({ type: "DELETE", id: requestExtra });
    } else if (!isLoading && !error && requestIdentifier) {
      dispatch({
        type: "ADD_INGREDIENT",
        ingredient: { id: data.name, ...requestExtra },
      });
    }
  }, [data, requestExtra, requestIdentifier, isLoading, error]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientsHandler = useCallback((ingredient) => {
    sendRequest(
      "https://burgerbuilder-89b34-default-rtdb.firebaseio.com//ingredients.json",
      "POST",
      JSON.stringify(ingredient),
      ingredient,
      "ADD_INGREDIENT"
    );
  }, []);

  const removeIngredientHandler = useCallback(
    (ingredientID) => {
      sendRequest(
        `https://burgerbuilder-89b34-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`,
        "DELETE",
        null,
        ingredientID,
        "REMOVE_INGREDIENT"
      );
    },
    [sendRequest]
  );

  const clearError = useCallback(() => {}, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

      <IngredientForm
        onAddIngredient={addIngredientsHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
