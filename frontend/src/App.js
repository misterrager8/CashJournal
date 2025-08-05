import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import Container from "./Container";
import MultiProvider from "./MultiContext";
import AuthProvider from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <MultiProvider>
        <Container />
      </MultiProvider>
    </AuthProvider>
  );
}

export default App;
