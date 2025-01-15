import React from "react";
import List from "./components/List";
import Button from "./components/Button";
import Card from "./components/Card";


const App = () => (
  <div className="p-6">
    <List />
    <div className="flex justify-center mt-4">
      <Button />
    </div>
    <div className="flex justify-center mt-6">
      <Card />
    </div>
  </div>
);

export default App;