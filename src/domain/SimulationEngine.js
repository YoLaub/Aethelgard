// seed : 0 est un placeholder — useGameSession injecte un vrai seed aléatoire à chaque partie
export const INITIAL_STATE = {
  cycle:        1,
  bio:          65,
  psyche:       65,
  thermal:      50,
  mana:         70,
  chaos:        1.0,
  seed:         0,
  isGameOver:   false,
  isVictory:    false,
  deathReason:  "",
};

export class SimulationEngine {

  static processTurn(state, effects) {
    let next = { ...state };

    // ── 1. MÉTRIQUES DÉRIVÉES ─────────────────────────────────────────────
    // Peur (inverse de la psyché) : alimente le chaos
    const fear        = Math.max(0, 100 - next.psyche);
    // Équilibre thermique : 100 = parfait (50°), 0 = extrême
    const thermalEq   = Math.max(0, 100 - Math.abs(next.thermal - 50) * 2);
    // Stabilité globale : moyenne des trois piliers les plus prévisibles
    const stability   = Math.max(0.5, (next.bio + next.psyche + thermalEq) / 3);

    // ── 2. APPLICATION DES EFFETS avec amplification chaotique ────────────
    const chaosMult = 1 + (next.chaos / 8);
    const SKIP      = new Set(['chaos', 'isGameOver', 'isVictory', 'deathReason', 'cycle']);

    Object.entries(effects).forEach(([key, value]) => {
      if (key in next && !SKIP.has(key)) {
        next[key] = this._clamp(next[key] + value * chaosMult);
      }
    });

    // ── 3. FORMULE DU CHAOS  χ_{n+1} = χ_n + (|ΔMana|×Peur)/Stabilité ──
    const deltaMana        = Math.abs(effects.mana || 0) * chaosMult;
    const chaosFromFormula = (deltaMana * fear) / (stability * 22);
    const chaosFromEffects = effects.chaos ? effects.chaos * chaosMult : 0;
    next.chaos = next.chaos + chaosFromFormula + chaosFromEffects;

    // ── 4. CASCADES INTERNES (interdépendances des 5 piliers) ─────────────

    // Thermal : dérive naturelle vers l'équilibre (6 % par cycle)
    next.thermal += (50 - next.thermal) * 0.06;

    // Thermal extrême → détruit la Bio (cultures, épidémies)
    const tGap = Math.abs(next.thermal - 50);
    if (tGap > 12) next.bio = this._clamp(next.bio - (tGap - 12) / 6);

    // Bio critique → Psyché chute (famine, désespoir)
    if (next.bio < 30)
      next.psyche = this._clamp(next.psyche - (30 - next.bio) / 8);

    // Psyché faible → Bio recule (abandon des cultures)
    if (next.psyche < 35)
      next.bio = this._clamp(next.bio - (35 - next.psyche) / 14);

    // Psyché faible → Mana fuit (la foi est le carburant de la magie)
    if (next.psyche < 40)
      next.mana = this._clamp(next.mana - (40 - next.psyche) / 10);

    // Mana excessif → anomalies biologiques + chaos
    if (next.mana > 82) {
      next.chaos += 0.7;
      next.bio    = this._clamp(next.bio - 2);
    }

    // ── 5. CHAOS EXTRÊME → dommages imprévisibles ─────────────────────────
    // Déterministe (basé sur le cycle) : pas de Math.random() pour la cohérence React
    if (next.chaos > 7) {
      const targets = ['bio', 'psyche', 'mana', 'thermal'];
      const target  = targets[next.cycle % targets.length];
      const damage  = (next.chaos - 7) * 0.9;
      if (target === 'thermal') {
        // Le Chaos peut chauffer ou refroidir selon la parité du cycle
        next.thermal += damage * (next.cycle % 2 === 0 ? 1 : -1);
      } else {
        next[target] = this._clamp(next[target] - damage);
      }
    }

    // ── 6. DÉCROISSANCE NATURELLE DU CHAOS ────────────────────────────────
    next.chaos = Math.max(1.0, next.chaos * 0.93);

    next.cycle += 1;
    return this._checkVitals(next);
  }

  // ── CONDITIONS DE FIN ─────────────────────────────────────────────────────
  static _checkVitals(state) {
    if (state.bio     <=  0)  return { ...state, isGameOver: true, deathReason: "L'écosystème s'est effondré. La famine a tout emporté." };
    if (state.psyche  <=  0)  return { ...state, isGameOver: true, deathReason: "La folie collective a consumé chaque habitant." };
    if (state.mana    <=  0)  return { ...state, isGameOver: true, deathReason: "Le mana s'est épuisé. L'île s'est abîmée dans le vide." };
    if (state.thermal >= 98)  return { ...state, isGameOver: true, deathReason: "Un inferno thermique a calciné toute vie." };
    if (state.thermal <=  2)  return { ...state, isGameOver: true, deathReason: "Le gel éternel a figé l'île pour l'éternité." };
    if (state.chaos   >= 18)  return { ...state, isGameOver: true, deathReason: "Le Chaos a déchiré le tissu de la réalité." };
    if (state.cycle   >  50)  return { ...state, isGameOver: true, isVictory: true, deathReason: "Cinquante cycles d'équilibre. L'île est immortelle." };
    return state;
  }

  static _clamp(val) {
    return Math.min(100, Math.max(0, val));
  }
}
