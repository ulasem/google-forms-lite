import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import { FormBuilderPage } from './pages/FormBuilderPage/FormBuilderPage';
import { FormFillerPage } from './pages/FormFillerPage/FormFillerPage';
import { FormResponsesPage } from './pages/FormResponsesPage/FormResponsesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/forms/new" element={<FormBuilderPage />} />
        <Route path="/forms/:id/fill" element={<FormFillerPage />} />
        <Route path="/forms/:id/responses" element={<FormResponsesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
