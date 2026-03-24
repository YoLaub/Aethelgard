import React from 'react';
import { useGameSession } from '../application/useGameSession';
import { Leaf, Users, Thermometer, Zap, AlertTriangle, Crown, RefreshCw, Trophy } from 'lucide-react';
import { Island3D } from './components/Island3D';
import { DILEMMAS } from '../domain/dilemmas';

// ── STAT BAR ──────────────────────────────────────────────────────────────────
const Stat = ({ icon: Icon, label, value, color }) => {
  const isCritical = value < 20;
  const isWarning  = value < 40;
  return (
    <div className="flex flex-col gap-1">
      <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest
        ${isCritical ? 'text-red-400' : isWarning ? 'text-orange-400 opacity-80' : 'opacity-50'}`}>
        <span className="flex items-center gap-1"><Icon size={12}/> {label}</span>
        <span>{Math.round(value)}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className={`h-full transition-all duration-1000
            ${isCritical ? 'bg-red-500 animate-pulse' : isWarning ? 'bg-orange-500' : color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// Sélection non-séquentielle : 7 est copremier avec 15 → parcourt tout avant de répéter
function selectDilemma(cycle, chaos) {
  const shift = Math.floor(chaos) % DILEMMAS.length;
  return DILEMMAS[(cycle * 7 + shift) % DILEMMAS.length];
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const { state, loading, playTurn, reset } = useGameSession();

  if (loading || !state) return (
    <div className="h-screen bg-black flex items-center justify-center text-indigo-500 font-mono animate-pulse uppercase tracking-widest">
      Initialisation...
    </div>
  );

  const dilemma   = selectDilemma(state.cycle, state.chaos);
  const chaosHigh = state.chaos >= 7;
  const chaosCrit = state.chaos >= 12;

  return (
    // Desktop : h-screen flex colonne → header fixe + contenu remplit le reste
    // Mobile  : min-h-screen scroll normal
    <div className="bg-[#030305] text-slate-300 font-sans min-h-screen md:h-screen md:flex md:flex-col">

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 flex justify-between items-center px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Crown className="text-indigo-500" size={20}/>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase text-white leading-none">Aethelgard</h1>
            <span className="text-[10px] text-slate-500 font-mono">CYCLE {state.cycle} / 50</span>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all
          ${chaosCrit ? 'bg-red-500/20 border-red-400/50 animate-pulse'
          : chaosHigh ? 'bg-orange-500/15 border-orange-400/40'
          : 'bg-red-500/5 border-red-500/20'}`}>
          <AlertTriangle size={12} className={chaosCrit ? 'text-red-400' : chaosHigh ? 'text-orange-400' : 'text-red-500'} />
          <span className={`text-[10px] font-bold font-mono
            ${chaosCrit ? 'text-red-400' : chaosHigh ? 'text-orange-400' : 'text-red-400'}`}>
            χ {state.chaos.toFixed(2)}
          </span>
        </div>
      </header>

      {/* ── CONTENU PRINCIPAL ───────────────────────────────────────────── */}
      {/* Mobile : flex-col  |  Desktop : flex-row, overflow caché sur le conteneur */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden">

        {/* ── GAUCHE : carte 3D ───────────────────────────────────────── */}
        <div className="md:flex-1 p-4 md:p-6 md:pr-3">
          {/* Mobile : hauteur fixe  |  Desktop : remplit la hauteur disponible */}
          <Island3D state={state} className="h-[380px] md:h-full" />
        </div>

        {/* ── DROITE : panneau de jeu ──────────────────────────────────── */}
        {/* Mobile : largeur pleine  |  Desktop : largeur fixe + scroll interne */}
        <div className="md:w-[400px] md:overflow-y-auto flex-shrink-0 px-4 pb-6 md:px-5 md:py-6 space-y-5">

          {/* Jauges */}
          <div className="grid grid-cols-2 gap-5 bg-white/[0.02] p-5 rounded-[2rem] border border-white/5">
            <Stat icon={Leaf}        label="Bio"    value={state.bio}     color="bg-emerald-500" />
            <Stat icon={Users}       label="Psyché" value={state.psyche}  color="bg-fuchsia-500" />
            <Stat icon={Thermometer} label="Climat" value={state.thermal} color="bg-orange-500"  />
            <Stat icon={Zap}         label="Mana"   value={state.mana}    color="bg-indigo-500"  />
          </div>

          {/* Fin de partie */}
          {state.isGameOver ? (
            <div className="text-center space-y-6 py-4">
              {state.isVictory
                ? <Trophy className="mx-auto text-yellow-400" size={44} />
                : <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Fin du Cycle</h2>
              }
              {state.isVictory && (
                <h2 className="text-3xl font-black text-yellow-400 italic tracking-tighter uppercase">Victoire</h2>
              )}
              <p className={`text-sm font-medium ${state.isVictory ? 'text-yellow-300' : 'text-red-400'}`}>
                {state.deathReason}
              </p>
              <button
                onClick={reset}
                className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-indigo-400 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> RECOMMENCER
              </button>
            </div>

          ) : (
            /* Dilemme */
            <div className={`border rounded-[2rem] p-6 space-y-6 backdrop-blur-xl transition-all
              ${chaosCrit ? 'bg-red-900/20 border-red-500/30'
              : chaosHigh ? 'bg-orange-900/10 border-orange-500/20'
              : 'bg-slate-900/40 border-white/5'}`}>
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{dilemma.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{dilemma.text}"</p>
              </div>
              <div className="flex flex-col gap-3">
                {dilemma.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => playTurn(opt.effects)}
                    className="p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all text-left group"
                  >
                    <div className="font-bold text-slate-200 group-hover:text-indigo-400 text-sm">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
