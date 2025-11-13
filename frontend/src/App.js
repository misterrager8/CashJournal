import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./App.css";
import Display from "./components/Display";
import ContextProvider from "./Context";

function App() {
  return (
    <ContextProvider>
      <Display />
    </ContextProvider>
  );
}

export default App;
