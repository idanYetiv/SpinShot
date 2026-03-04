import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { CreateGamePage } from "./pages/CreateGamePage";
import { JoinGamePage } from "./pages/JoinGamePage";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";
import { ResultsPage } from "./pages/ResultsPage";
import { useDirection } from "./hooks/useDirection";

export default function App() {
  useDirection();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/create" element={<CreateGamePage />} />
        <Route path="/join" element={<JoinGamePage />} />
        <Route path="/lobby/:code" element={<LobbyPage />} />
        <Route path="/game/:code" element={<GamePage />} />
        <Route path="/results/:code" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
