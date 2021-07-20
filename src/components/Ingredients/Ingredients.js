import React, { useState, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients) => {
      setUserIngredients(filteredIngredients);
    },
    [setUserIngredients]
  ); //need to specify al dependancies
  //setUserIngredients will not cause a rerun, thus an example of an empty dependancy

  const addIngredientsHandler = (ingredient) => {
    setIsLoading(true);
    fetch(
      "https://burgerbuilder-89b34-default-rtdb.firebaseio.com//ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (ingredientID) => {
    setIsLoading(true);
    fetch(
      `https://burgerbuilder-89b34-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`,
      { method: "DELETE" }
    ).then((response) => {
      setIsLoading(false);
      setUserIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== ingredientID)
      );
    });
  };

  return (
    <div className="App">
      <IngredientForm
        onAddIngredient={addIngredientsHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
