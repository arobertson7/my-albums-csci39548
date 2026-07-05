import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import CatalogPage from './pages/CatalogPage';
import FilteredCatalogPage from './pages/FilteredCatalogPage';
import AlbumDetailPage from './pages/AlbumDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/404Page';

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="list/:status" element={<FilteredCatalogPage />} />
        <Route path="items/:id" element={<AlbumDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

    </Routes>
  );
}