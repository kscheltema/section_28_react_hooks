import React, { useState, useCallback } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients) => {
      setUserIngredients(filteredIngredients);
    },
    [setUserIngredients]
  ); //need to specify al dependancies
  //setUserIngredients will not cause a rerun, thus an example of an empty dependancy

  const addIngredientsHandler = (ingredient) => {
    fetch(
      "https://burgerbuilder-89b34-default-rtdb.firebaseio.com//ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingredient),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((response) => {
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
    fetch(
      `https://burgerbuilder-89b34-default-rtdb.firebaseio.com/ingredients/${ingredientID}.json`,
      { method: "DELETE" }
    ).then((response) => {
      setUserIngredients((prevIngredients) =>
        prevIngredients.filter((ingredient) => ingredient.id !== ingredientID)
      );
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientsHandler} />

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
