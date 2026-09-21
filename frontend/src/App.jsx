import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import PriceAnalysisCharts from './components/PriceAnalysisCharts';
import CarComparison from './components/CarComparison';
import ModelInsights from './components/ModelInsights';
import HowItWorks from './components/HowItWorks';
import PredictionHistory from './components/PredictionHistory';
import Footer from './components/Footer';
import { api } from './services/api';
import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'autoprice_ai_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('predictor');
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [currentCarInput, setCurrentCarInput] = useState(null);
  const [history, setHistory] = useState([]);
  
  // Metadata from backend
  const [brandModels, setBrandModels] = useState({});
  const [sampleCars, setSampleCars] = useState([]);
  const [modelMeta, setModelMeta] = useState(null);
  const [errorBanner, setErrorBanner] = useState(null);

  const resultRef = useRef(null);
  const formRef = useRef(null);

  // Load persistent history on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  // Fetch backend data and verify connectivity
  const checkBackendData = async () => {
    try {
      setErrorBanner(null);
      const health = await api.checkHealth();
      setIsOnline(health.status === 'healthy');

      // Fetch supporting metadata
      const [bmData, scData, metaData] = await Promise.allSettled([
        api.getBrandsAndModels(),
        api.getSampleCars(),
        api.getModelInfo()
      ]);

      if (bmData.status === 'fulfilled') setBrandModels(bmData.value.brands || {});
      if (scData.status === 'fulfilled') setSampleCars(scData.value.sample_cars || []);
      if (metaData.status === 'fulfilled') setModelMeta(metaData.value || null);
    } catch (err) {
      console.warn('Backend connection warning:', err);
      setIsOnline(false);
      setErrorBanner(
        'Backend server is currently offline. Please ensure FastAPI is running with: python -m uvicorn backend.main:app --port 8000'
      );
    }
  };

  useEffect(() => {
    checkBackendData();
  }, []);

  const saveToHistory = (carInput, result) => {
    const newEntry = {
      id: Date.now(),
      brand: carInput.brand,
      model: carInput.model,
      year: carInput.year,
      km_driven: carInput.km_driven,
      fuel_type: carInput.fuel_type,
      transmission: carInput.transmission,
      predicted_price: result.predicted_price,
      formatted_price: result.formatted_price,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      inputData: carInput
    };

    const updated = [newEntry, ...history.filter(h => h.id !== newEntry.id)].slice(0, 20);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history to storage:', e);
    }
  };

  const handlePredict = async (carData) => {
    try {
      setIsLoading(true);
      setErrorBanner(null);

      // Progressive realistic loading indicators
      setLoadingStage('Validating vehicle parameters...');
      await new Promise(r => setTimeout(r, 180));

      setLoadingStage('Encoding mechanical telemetry & age factor...');
      await new Promise(r => setTimeout(r, 220));

      setLoadingStage('Evaluating Random Forest 120 decision trees...');
      const result = await api.predictPrice(carData);

      setLoadingStage('Computing confidence intervals & depreciation...');
      await new Promise(r => setTimeout(r, 150));

      setPredictionResult(result);
      setCurrentCarInput(carData);
      saveToHistory(carData, result);

      // Smooth scroll to result
      setTimeout(() => {
        const el = document.getElementById('prediction-result');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      setErrorBanner(err.message || 'Prediction failed. Please verify the backend is running.');
    } finally {
      setIsLoading(false);
      setLoadingStage('');
    }
  };

  const handleDownloadReport = async (carData) => {
    await api.downloadPdfReport(carData);
  };

  const handlePredictAgain = () => {
    const el = document.getElementById('prediction-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCompareWithThisCar = (carData) => {
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryCar = (carData) => {
    setActiveTab('predictor');
    handlePredict(carData);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all saved valuations?')) {
      setHistory([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 bg-radial-mesh">
      
      {/* Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        historyCount={history.length}
        isOnline={isOnline}
      />

      {/* Backend Offline Warning Banner */}
      {errorBanner && (
        <div className="bg-rose-950/90 border-b border-rose-800 text-rose-200 px-4 py-3 text-xs sm:text-sm flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorBanner}</span>
          </div>
          <button 
            onClick={checkBackendData}
            className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-100 flex items-center gap-1 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* TAB 1: PREDICTOR (Home / Prediction) */}
        {activeTab === 'predictor' && (
          <div className="space-y-12">
            
            {/* Hero Banner */}
            <Hero 
              onPredictClick={() => {
                const el = document.getElementById('prediction-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onInsightsClick={() => setActiveTab('insights')}
            />

            {/* Prediction Form */}
            <PredictionForm 
              onPredict={handlePredict} 
              isLoading={isLoading} 
              loadingStage={loadingStage}
              sampleCars={sampleCars}
              brandModels={brandModels}
            />

            {/* Prediction Result Display */}
            {predictionResult && currentCarInput && (
              <PredictionResult 
                result={predictionResult} 
                carInput={currentCarInput}
                onPredictAgain={handlePredictAgain}
                onCompareWithThisCar={handleCompareWithThisCar}
                onDownloadReport={handleDownloadReport}
              />
            )}

            {/* Price Analysis & Recharts */}
            {predictionResult && (
              <PriceAnalysisCharts result={predictionResult} />
            )}

          </div>
        )}

        {/* TAB 2: COMPARE TWO CARS */}
        {activeTab === 'compare' && (
          <CarComparison 
            brandModels={brandModels} 
            sampleCars={sampleCars} 
          />
        )}

        {/* TAB 3: MODEL INSIGHTS */}
        {activeTab === 'insights' && (
          <ModelInsights modelMeta={modelMeta} />
        )}

        {/* TAB 4: HOW IT WORKS */}
        {activeTab === 'how-it-works' && (
          <HowItWorks onTryPredictor={() => setActiveTab('predictor')} />
        )}

        {/* TAB 5: PREDICTION HISTORY */}
        {activeTab === 'history' && (
          <PredictionHistory 
            history={history}
            onSelectCar={handleSelectHistoryCar}
            onClearHistory={handleClearHistory}
            onGoToPredictor={() => setActiveTab('predictor')}
          />
        )}

      </main>

      {/* Footer with Mandatory Disclaimer */}
      <Footer onNavigate={setActiveTab} />

    </div>
  );
}
