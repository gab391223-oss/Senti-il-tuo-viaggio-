import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TravelPlan, UserProfile, ItineraryItem } from '../types';
import { Clock, MapPin, Utensils, Info, RefreshCw, Zap, ArrowLeft, Calendar, ChevronRight, ChevronLeft, Star } from 'lucide-react';

interface DashboardProps {
  plan: TravelPlan;
  profile: UserProfile;
  onReset: () => void;
}

export default function Dashboard({ plan, profile, onReset }: DashboardProps) {
  const [activeDay, setActiveDay] = useState(1);

  const currentDayPlan = plan.days.find(d => d.day === activeDay) || plan.days[0];
  const foodItems = plan.days.flatMap(d => d.items).filter(i => i.type === 'food' && !i.isAlternative);

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto relative">
      <div className="atmosphere" />
      
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <button 
            onClick={onReset}
            className="flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Cambia Umore
          </button>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight mb-4">
            {plan.personaName}
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1 rounded-full bg-orange-600/20 border border-orange-500/30 text-orange-400 text-sm font-medium uppercase tracking-wider">
              {profile.destination || profile.mood}
            </span>
            <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-3 h-3" /> {profile.duration} Giorni
            </span>
            <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3 h-3" /> Budget {profile.budget}
            </span>
            {profile.mood === 'fun' && (
              <span className="px-4 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                <Star className="w-3 h-3" /> Divertimento
              </span>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md text-right md:text-right text-white/70 text-lg leading-relaxed italic font-serif"
        >
          "{plan.summary}"
        </motion.div>
      </header>

      {/* Day Selector */}
      <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {plan.days.map((day) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(day.day)}
            className={`px-6 py-3 rounded-2xl border transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDay === day.day 
                ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/20' 
                : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" /> Giorno {day.day}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Itinerary Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif flex items-center gap-3">
              <Clock className="w-6 h-6 text-orange-500" />
              Programma Orario - Giorno {activeDay}
            </h2>
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono uppercase tracking-widest">
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              Sincronizzazione in tempo reale
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeDay}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-white/10"
            >
              {currentDayPlan.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative pl-12 group ${item.isAlternative ? 'opacity-60 hover:opacity-100' : ''}`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 top-2 w-10 h-10 rounded-full bg-zinc-900 border flex items-center justify-center z-10 group-hover:border-orange-500/50 transition-colors ${item.isAlternative ? 'border-dashed border-white/20' : 'border-white/10'}`}>
                    {item.type === 'food' ? <Utensils className="w-4 h-4 text-orange-500" /> : <MapPin className="w-4 h-4 text-white/50" />}
                  </div>

                  <div 
                    onClick={() => {
                      const query = encodeURIComponent(`${item.title} ${item.location}`);
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }}
                    className={`glass-card overflow-hidden hover:bg-white/[0.12] transition-all cursor-pointer group/card relative ${item.isAlternative ? 'border-dashed' : ''}`}
                  >
                    <div className="p-6 relative">
                      <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 transition-opacity">
                        <div className="p-2 rounded-full bg-orange-500/20 text-orange-500">
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-orange-500 tracking-widest uppercase">{item.time}</span>
                          {item.isAlternative && (
                            <span className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded uppercase tracking-widest">Alternativa</span>
                          )}
                        </div>
                        <div className="flex gap-1 pr-8">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className={`w-1 h-3 rounded-full ${i < item.priceLevel ? 'bg-orange-500' : 'bg-white/10'}`} />
                          ))}
                        </div>
                      </div>
                      <h3 className="text-xl font-medium mb-2 group-hover/card:text-orange-400 transition-colors">{item.title}</h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-4">{item.description}</p>
                      
                      {(item.hours || item.priceInfo) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
                          {item.hours && (
                            <div className="text-[10px] font-mono uppercase tracking-tighter text-white/40">
                              <span className="text-orange-500 block mb-1">Orari</span>
                              {item.hours}
                            </div>
                          )}
                          {item.priceInfo && (
                            <div className="text-[10px] font-mono uppercase tracking-tighter text-white/40">
                              <span className="text-orange-500 block mb-1">Prezzo</span>
                              {item.priceInfo}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-white/40 font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                        <span className="flex items-center gap-1 capitalize"><Info className="w-3 h-3" /> {item.type}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-mono uppercase tracking-widest text-orange-500/0 group-hover/card:text-orange-500/100 transition-all flex items-center gap-2">
                        Vedi su Google Maps <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Local Taste Column */}
        <div className="space-y-8">
          <h2 className="text-2xl font-serif flex items-center gap-3">
            <Utensils className="w-6 h-6 text-orange-500" />
            Motore del Gusto Locale
          </h2>
          
          <div className="space-y-6">
            {foodItems.slice(0, 3).map((item, index) => (
              <motion.div
                key={`taste-${item.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                onClick={() => {
                  const query = encodeURIComponent(`${item.title} ${item.location}`);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                }}
                className="glass-card overflow-hidden group cursor-pointer hover:border-orange-500/30 transition-all"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-medium group-hover:text-orange-400 transition-colors">{item.title}</h4>
                      <p className="text-xs text-white/50 font-mono uppercase tracking-widest">Ricetta Autentica</p>
                    </div>
                    <div className="p-2 rounded-full bg-orange-500/20 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MapPin className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 text-sm text-white/70 leading-relaxed">
                    <div className="mt-1 p-1 rounded bg-orange-500/10">
                      <Info className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <span className="text-orange-500 font-serif italic text-base block mb-1">La Storia:</span>
                      {item.history || "Un classico locale preparato con ingredienti di stagione."}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 text-[10px] font-mono uppercase tracking-widest text-orange-500/0 group-hover:text-orange-500/100 transition-all flex items-center gap-2">
                    Trova questo locale <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contextual Tip */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="p-6 rounded-3xl bg-orange-600/10 border border-orange-500/20"
          >
            <h4 className="text-orange-400 font-medium mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Consiglio Pro
            </h4>
            <p className="text-sm text-white/70 italic leading-relaxed">
              {profile.mood === 'fun' 
                ? "Abbiamo aggiunto opzioni alternative per ogni fascia oraria: scegli quella che ti ispira di più per massimizzare il divertimento!"
                : `Dato che la tua energia è al ${profile.energy}%, abbiamo dato priorità a luoghi con posti a sedere comodi e tempi di attesa brevi.`}
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
