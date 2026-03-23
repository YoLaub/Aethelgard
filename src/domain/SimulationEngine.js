export const INITIAL_STATE = {
  cycle: 1,
  bio: 60,
  psyche: 60,
  thermal: 50,
  mana: 70,
  chaos: 1.0,
  isGameOver: false,
  deathReason: ""
};

export class SimulationEngine {
  static processTurn(state, effects) {
    let next = { ...state };
    const chaosFactor = 1 + (next.chaos / 10);

    Object.entries(effects).forEach(([key, value]) => {
      if (key in next) {
        next[key] = this._clamp(next[key] + (value * chaosFactor));
      }
    });

    const thermalGap = Math.abs(next.thermal - 50);
    if (thermalGap > 15) next.bio = this._clamp(next.bio - (thermalGap / 5));
    if (next.mana > 85) next.chaos += 0.4;
    if (next.psyche < 35) next.mana = this._clamp(next.mana - 2);

    next.chaos = Math.max(1, next.chaos * 0.97);
    next.cycle += 1;

    return this._checkVitals(next);
  }

  static _checkVitals(state) {
    if (state.bio <= 0) return { ...state, isGameOver: true, deathReason: "L'écosystème est mort." };
    if (state.psyche <= 0) return { ...state, isGameOver: true, deathReason: "Folie collective." };
    if (state.mana <= 0) return { ...state, isGameOver: true, deathReason: "L'île s'est effondrée." };
    if (state.cycle > 100) return { ...state, isGameOver: true, deathReason: "Victoire de l'équilibre." };
    return state;
  }

  static _clamp(val) {
    return Math.min(100, Math.max(0, val));
  }
}
