import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; // Import the Toaster
import Layout from "./components/Layout";
import PollList from "./pages/PollList";
import PollRoom from "./pages/PollRoom";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<PollList />} />
          <Route path="/poll/:id" element={<PollRoom />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" expand={true} richColors />
    </BrowserRouter>
  );
}

export default App;
