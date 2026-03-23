import React from 'react';
import { useGameSession } from '../application/useGameSession';
import { Leaf, Users, Thermometer, Zap, AlertTriangle, Crown, RefreshCw } from 'lucide-react';

const DILEMMAS = [
  {
    title: "Le Nexus Brisé",
    text: "Une fuite de mana irradie les forêts flottantes.",
    options: [
      { label: "Sceller la fuite", desc: "Consomme du mana, stabilise la bio.", effects: { mana: -15, bio: 10, thermal: -5 } },
      { label: "Canaliser l'énergie", desc: "Booste le mana, mais augmente le chaos.", effects: { mana: 20, chaos: 3, thermal: 10 } }
    ]
  }
];

const Stat = ({ icon: Icon, label, value, color }) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-[10px] font-bold uppercase opacity-50 tracking-widest">
      <span className="flex items-center gap-1"><Icon size={12}/> {label}</span>
      <span>{Math.round(value)}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
      <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

export default function App() {
  const { state, loading, playTurn, reset } = useGameSession();

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-indigo-500 font-mono animate-pulse uppercase tracking-widest">Initialisation...</div>;

  const dilemma = DILEMMAS[state.cycle % DILEMMAS.length];

  return (
    <div className="min-h-screen bg-[#030305] text-slate-300 font-sans p-6">
      <div className="max-w-md mx-auto flex flex-col min-h-screen">
        <header className="flex justify-between items-center py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20"><Crown className="text-indigo-500" size={20}/></div>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase text-white leading-none">Aethelgard</h1>
              <span className="text-[10px] text-slate-500 font-mono">CYCLE {state.cycle}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-red-500/5 border border-red-500/20 rounded-full">
            <AlertTriangle size={12} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-400 font-mono">χ {state.chaos.toFixed(1)}</span>
          </div>
        </header>

        <main className="flex-1 py-12 space-y-12">
          <div className="grid grid-cols-2 gap-6 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5">
            <Stat icon={Leaf} label="Bio" value={state.bio} color="bg-emerald-500" />
            <Stat icon={Users} label="Psyché" value={state.psyche} color="bg-fuchsia-500" />
            <Stat icon={Thermometer} label="Climat" value={state.thermal} color="bg-orange-500" />
            <Stat icon={Zap} label="Mana" value={state.mana} color="bg-indigo-500" />
          </div>

          {state.isGameOver ? (
            <div className="text-center space-y-8 animate-in zoom-in duration-500">
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase">Fin du Cycle</h2>
              <p className="text-red-400 text-sm font-medium">{state.deathReason}</p>
              <button onClick={reset} className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-indigo-400 transition-all flex items-center justify-center gap-2">
                <RefreshCw size={18} /> RECOMMENCER
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 space-y-8 backdrop-blur-xl">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-white tracking-tight">{dilemma.title}</h2>
                <p className="text-slate-400 text-sm leading-relaxed italic">"{dilemma.text}"</p>
              </div>
              <div className="flex flex-col gap-3">
                {dilemma.options.map((opt, i) => (
                  <button key={i} onClick={() => playTurn(opt.effects)} className="p-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-indigo-500/10 hover:border-indigo-500/50 transition-all text-left group">
                    <div className="font-bold text-slate-200 group-hover:text-indigo-400">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
