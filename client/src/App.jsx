import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AuthModal from './components/modals/AuthModal';
import ReportModal from './components/modals/ReportModal';
import ItemDetailModal from './components/modals/ItemDetailModal';
import ClaimModal from './components/modals/ClaimModal';
import ActivityModal from './components/modals/ActivityModal';

export default function App() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'LOST' | 'FOUND'
  const [filterMode, setFilterMode] = useState('CATEGORIES'); // 'CATEGORIES' | 'LOCATIONS'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchMeta();
    fetchStats();
  }, []);

  useEffect(() => {
    fetchItems();
  }, [activeTab, selectedCategory, selectedLocation]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchMeta = async () => {
    try {
      const [catRes, locRes] = await Promise.all([
        api.get('/meta/categories'),
        api.get('/meta/locations'),
      ]);
      if (catRes.data?.data) setCategories(catRes.data.data);
      if (locRes.data?.data) setLocations(locRes.data.data);
    } catch (e) {
      console.error('Error fetching metadata:', e);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/meta/stats');
      if (res.data?.data) setStats(res.data.data);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== 'ALL') params.type = activeTab;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedLocation) params.locationId = selectedLocation;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/items', { params });
      if (res.data?.data?.items) {
        setItems(res.data.data.items);
      }
    } catch (e) {
      console.error('Error fetching items:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const handleOpenClaim = (item) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedItem(item);
    setClaimModalOpen(true);
  };

  const handleOpenReport = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setReportModalOpen(true);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-[#191712] selection:text-[#fbf6e6]">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#191712] text-[#fbf6e6] px-5 py-3 rounded-2xl border-2 border-[#191712] shadow-[4px_5px_0_#ffd32a] flex items-center gap-3 animate-in slide-in-from-bottom-5 font-hand text-2xl">
            <CheckCircle className="w-5 h-5 text-[#2ed573]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Navigation */}
        <Navbar
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenReport={handleOpenReport}
          onOpenActivity={() => setActivityModalOpen(true)}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Page Routing */}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                items={items}
                categories={categories}
                locations={locations}
                stats={stats}
                loading={loading}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                filterMode={filterMode}
                setFilterMode={setFilterMode}
                onSearchSubmit={handleSearchSubmit}
                onCardClick={handleCardClick}
                onOpenReport={handleOpenReport}
                onRefresh={() => {
                  fetchItems();
                  fetchStats();
                }}
              />
            }
          />
        </Routes>

        {/* Global Footer */}
        <Footer />

        {/* Global Modals */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />

        <ReportModal
          isOpen={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          categories={categories}
          locations={locations}
          onItemCreated={(newItem) => {
            showToast(`Notice for "${newItem.title}" pinned successfully!`);
            fetchItems();
            fetchStats();
          }}
        />

        <ItemDetailModal
          isOpen={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          item={selectedItem}
          onOpenClaim={handleOpenClaim}
          onRefresh={() => {
            fetchItems();
            fetchStats();
          }}
        />

        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          item={selectedItem}
          onClaimSubmitted={() => {
            showToast('Ownership claim submitted! Finder will review.');
            fetchItems();
            fetchStats();
          }}
        />

        <ActivityModal
          isOpen={activityModalOpen}
          onClose={() => setActivityModalOpen(false)}
        />
      </div>
    </Router>
  );
}
