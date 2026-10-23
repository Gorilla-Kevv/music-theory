import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { SearchProvider } from "./components/SearchDialog";
import { ReviewProvider } from "./context/ReviewContext";
import { TransportProvider } from "./context/TransportContext";
import { Agent } from "./routes/Agent";
import { Atlas } from "./routes/Atlas";
import { Books } from "./routes/Books";
import { ConceptPage } from "./routes/ConceptPage";
import { Drill } from "./routes/Drill";
import { Home } from "./routes/Home";
import { Library } from "./routes/Library";
import { NotFound } from "./routes/NotFound";
import { References } from "./routes/References";

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ReviewProvider>
        <TransportProvider>
          <SearchProvider>
            <Routes>
              <Route element={<Shell />}>
                <Route index element={<Home />} />
                <Route path="library" element={<Library />} />
                <Route path="books" element={<Books />} />
                <Route path="atlas" element={<Atlas />} />
                <Route path="theory/:slug" element={<ConceptPage />} />
                <Route path="drill" element={<Drill />} />
                <Route path="references" element={<References />} />
                <Route path="agent" element={<Agent />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </SearchProvider>
        </TransportProvider>
      </ReviewProvider>
    </BrowserRouter>
  );
}
