import { Route, Routes } from "react-router-dom";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import "./tailwind.css";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ChatbotPage />} />
        <Route path="/staff" element={<StaffDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
