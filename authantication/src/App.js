import logo from "./logo.svg";
import "./App.css";
import {} from "@chakra-ui/react";
import AllRoutes from "./Components/AllRoutes";
import Navbar from "./Components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <AllRoutes />
    </div>
  );
}

export default App;
