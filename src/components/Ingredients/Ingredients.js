import React, { useState } from "react";
import IngredientList from "./IngredientList";
import IngredientForm from "./IngredientForm";
import Search from "./Search";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  return (
    <div className="App">
      <IngredientForm />

      <section>
        <Search />
        <IngredientList ingredients={userIngredients} />
      </section>
    </div>
  );
};

export default Ingredients;
