import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

import Container from "./Container";
import MultiProvider from "./MultiContext";
import AuthProvider from "./AuthContext";
import Accounts from "./components/pages/Accounts";
import Bills from "./components/pages/Bills";
import ShoppingList from "./components/pages/ShoppingList";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./components/pages/Users";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MultiProvider>
          <Routes>
            <Route path="/" element={<Container />}>
              <Route path="accounts" element={<Accounts />} />
              <Route path="bills" element={<Bills />} />
              <Route path="shopping" element={<ShoppingList />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Routes>
          <Container />
        </MultiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
