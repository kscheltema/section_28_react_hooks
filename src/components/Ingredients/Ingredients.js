import React, { useState, useEffect } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  fetch(
    "https://burgerbuilder-89b34-default-rtdb.firebaseio.com//ingredients.json"
  ).then((response) =>
    response.json().then((responseData) => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount,
        });
      }
      // setUserIngredients(loadedIngredients);
    })
  );

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
    setUserIngredients((prevIngredients) => {
      const updatedIngredients = prevIngredients.filter(
        (ingredient) => ingredient.id !== ingredientID
      );
      return updatedIngredients;
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientsHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
