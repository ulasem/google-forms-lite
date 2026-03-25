import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Home</div>} />
        <Route path="/forms/new" element={<div>Create</div>} />
      </Routes>
    </BrowserRouter>
  );
}
