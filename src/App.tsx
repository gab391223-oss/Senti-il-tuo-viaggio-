import React, { useState, useEffect } from 'react';
import { UserProfile, TravelPlan } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { generateTravelPlan } from './services/gemini';
import { Loader2, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOnboardingComplete = async (userProfile: UserProfile) => {
    setProfile(userProfile);
    setLoading(true);
    setError(null);
    
    try {
      // Get current location if possible
      let location = "Roma, Italia"; // Default fallback
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          // In a real app, we'd reverse geocode this. For now, we'll just pass coords or a hint.
          location = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        } catch (e) {
          console.log("Geolocation failed, using default");
        }
      }

      const generatedPlan = await generateTravelPlan(userProfile, location);
      setPlan(generatedPlan);
    } catch (err) {
      console.error(err);
      setError("Impossibile generare il tuo viaggio. Per favore riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProfile(null);
    setPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0502] text-white selection:bg-orange-500/30">
      <AnimatePresence mode="wait">
        {!profile && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Onboarding onComplete={handleOnboardingComplete} />
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0502]/80 backdrop-blur-xl"
          >
            <div className="atmosphere" />
            <div className="relative">
              <Compass className="w-24 h-24 text-orange-500 animate-spin-slow mb-8" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full"
              />
            </div>
            <h2 className="text-3xl font-serif mb-2">Consultando le Stelle</h2>
            <p className="text-white/50 font-mono text-xs uppercase tracking-[0.3em]">
              Sintetizzando il tuo viaggio a {profile?.destination || 'destinazione'}...
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="atmosphere" />
            <h2 className="text-3xl font-serif mb-4 text-red-400">Qualcosa è andato storto</h2>
            <p className="text-white/60 mb-8 max-w-md">{error}</p>
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              Riprova
            </button>
          </motion.div>
        )}

        {plan && profile && !loading && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Dashboard plan={plan} profile={profile} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
