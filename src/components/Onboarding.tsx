import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Mood } from '../types';
import { Sparkles, ArrowRight, Camera, Cloud, Coffee, MapPin } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const VIBE_IMAGES = [
  { id: 'urban', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80', label: 'Metropoli Vibrante', vibe: 'energia urbana e grattacieli' },
  { id: 'nightlife', url: 'https://images.unsplash.com/photo-1514525253361-bee8718a740b?auto=format&fit=crop&w=800&q=80', label: 'Vita Notturna & Club', vibe: 'discoteche, club, pub e divertimento notturno' },
  { id: 'nature', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&q=80', label: 'Natura Incontaminata', vibe: 'pace, foreste e aria pulita' },
  { id: 'history', url: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80', label: 'Borghi e Storia', vibe: 'architettura antica e borghi storici' },
];

const MOODS: { id: Mood; label: string; icon: React.ReactNode }[] = [
  { id: 'adventurous', label: 'Voglia di Avventura', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'relaxed', label: 'Puro Relax', icon: <Cloud className="w-5 h-5" /> },
  { id: 'cultural', label: 'Sete di Cultura', icon: <Camera className="w-5 h-5" /> },
  { id: 'social', label: 'Voglia di Compagnia', icon: <Coffee className="w-5 h-5" /> },
  { id: 'fun', label: 'Divertimento & Nightlife', icon: <Sparkles className="w-5 h-5 text-orange-500" /> },
  { id: 'solitary', label: 'Momento per Me', icon: <MapPin className="w-5 h-5" /> },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedVibe, setSelectedVibe] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('relaxed');
  const [energy, setEnergy] = useState(50);
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState('medio');

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete({
        mood: selectedMood,
        energy,
        interests: [selectedVibe],
        vibe: selectedVibe,
        destination,
        duration,
        budget,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="atmosphere" />
      
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full text-center"
          >
            <h1 className="text-5xl md:text-7xl font-serif mb-4 tracking-tight">
              Inizia il tuo viaggio
            </h1>
            <p className="text-white/60 text-lg mb-12 font-serif italic">Seleziona l'atmosfera che desideri vivere</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {VIBE_IMAGES.map((vibe) => (
                <motion.button
                  key={vibe.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedVibe(vibe.vibe);
                    setStep(2);
                  }}
                  className="relative aspect-video rounded-3xl overflow-hidden group border-2 border-transparent hover:border-orange-500/50 transition-colors"
                >
                  <img
                    src={vibe.url}
                    alt={vibe.label}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                    <span className="text-xl font-medium">{vibe.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl w-full text-center"
          >
            <h1 className="text-5xl font-serif mb-4 tracking-tight">Qual è il tuo spirito?</h1>
            <p className="text-white/60 text-lg mb-12 font-serif italic">Dicci come ti senti oggi per personalizzare l'esperienza</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
              {MOODS.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedMood(mood.id);
                    setStep(3);
                  }}
                  className="p-6 rounded-2xl flex flex-col items-center gap-3 transition-all bg-white/5 hover:bg-orange-600 hover:text-white hover:shadow-lg hover:shadow-orange-900/20 text-white/70"
                >
                  {mood.icon}
                  <span className="font-medium">{mood.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full text-center"
          >
            <h1 className="text-5xl font-serif mb-12 tracking-tight">Il tuo livello di energia?</h1>
            <div className="mb-16">
              <input
                type="range"
                min="0"
                max="100"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between mt-4 text-sm text-white/50 font-mono uppercase tracking-widest">
                <span>Batteria Scarica</span>
                <span>Carica Massima</span>
              </div>
              <div className="text-8xl font-serif mt-8 text-orange-500">{energy}%</div>
            </div>
            <button
              onClick={() => setStep(4)}
              className="px-12 py-5 bg-orange-600 hover:bg-orange-500 rounded-full text-xl font-medium flex items-center gap-2 mx-auto transition-colors shadow-2xl shadow-orange-900/40"
            >
              Prossimo <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full text-center"
          >
            <h1 className="text-5xl font-serif mb-12 tracking-tight">Dove vuoi andare?</h1>
            <div className="mb-12">
              <input
                type="text"
                placeholder="Es: Parigi, Tokyo, New York..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-2xl font-serif focus:outline-none focus:border-orange-500 transition-colors text-center"
              />
            </div>
            <button
              disabled={!destination}
              onClick={() => setStep(5)}
              className="px-12 py-5 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xl font-medium flex items-center gap-2 mx-auto transition-colors shadow-2xl shadow-orange-900/40"
            >
              Quasi fatto <ArrowRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full text-center"
          >
            <h1 className="text-5xl font-serif mb-12 tracking-tight">Dettagli del viaggio</h1>
            
            <div className="space-y-12 mb-16">
              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Durata (Giorni)</label>
                <div className="flex items-center justify-center gap-8">
                  <button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-2xl hover:bg-white/5">-</button>
                  <span className="text-6xl font-serif text-orange-500">{duration}</span>
                  <button onClick={() => setDuration(duration + 1)} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-2xl hover:bg-white/5">+</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-white/40 mb-4">Budget</label>
                <div className="flex gap-4">
                  {['economico', 'medio', 'lusso'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`flex-1 py-4 rounded-2xl border transition-all capitalize ${
                        budget === b ? 'bg-orange-600 border-orange-500' : 'bg-white/5 border-white/10 text-white/50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="px-12 py-5 bg-orange-600 hover:bg-orange-500 rounded-full text-xl font-medium flex items-center gap-2 mx-auto transition-colors shadow-2xl shadow-orange-900/40"
            >
              Rivela il Mio Viaggio <Sparkles className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
