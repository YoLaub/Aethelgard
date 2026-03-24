// Chaque dilemme affecte les 5 piliers : bio, psyche, thermal, mana, chaos
// Les effets sont amplifiés par chaosMult dans le moteur — choisir prudemment.

export const DILEMMAS = [

  // ── PILIER BIO ────────────────────────────────────────────────────────────
  {
    title: "Le Réveil des Racines",
    text: "Les réserves de nourriture s'épuisent. Les alchimistes proposent d'injecter du Mana pur dans le sol.",
    options: [
      { label: "Injecter le Mana",    desc: "Nourriture abondante, instabilité magique.",      effects: { mana: -15, bio: +20, chaos: +4, thermal: +5 } },
      { label: "Rationner et Prier",  desc: "Préserve l'équilibre, mais le peuple souffre.",   effects: { psyche: -15, bio: -5, mana: +5, chaos: -1 } }
    ]
  },
  {
    title: "La Sécheresse",
    text: "Les canaux s'assèchent. Sans irrigation, les champs mourront avant la prochaine pluie.",
    options: [
      { label: "Détourner le Mana",   desc: "Irrigation magique efficace, mais instable.",     effects: { bio: +18, mana: -14, chaos: +3 } },
      { label: "Rationner l'eau",     desc: "Préserve les ressources, le peuple endure.",       effects: { bio: -8, psyche: -12 } }
    ]
  },
  {
    title: "L'Invasion de Spores",
    text: "Une nuée de spores étranges s'abat sur les cultures. Leur nature — parasite ou mutualiste — est inconnue.",
    options: [
      { label: "Brûler les champs",   desc: "Élimine les spores, détruit la récolte.",          effects: { bio: -18, thermal: +12, psyche: -5 } },
      { label: "Inoculer le sol",     desc: "Risqué, potentiellement transformateur.",           effects: { bio: +12, chaos: +6, mana: -5 } }
    ]
  },
  {
    title: "La Forêt Sentinelle",
    text: "Des arbres anciens bougent la nuit. Les druides y voient une bénédiction, les gardes une menace.",
    options: [
      { label: "S'allier aux arbres", desc: "Alliance mystique, régénération biologique.",      effects: { bio: +22, mana: -16, chaos: +3 } },
      { label: "Les abattre",         desc: "Élimine la menace, ravage l'écosystème.",           effects: { bio: -18, psyche: -8, mana: +5 } }
    ]
  },

  // ── PILIER PSYCHÉ ─────────────────────────────────────────────────────────
  {
    title: "Le Festival de la Lueur",
    text: "Le peuple veut illuminer l'île entière pour chasser la peur du vide. Cela exige une dépense massive de Mana.",
    options: [
      { label: "Autoriser la fête",   desc: "Moral en fête, Mana en cendres.",                  effects: { psyche: +25, mana: -22, chaos: +2 } },
      { label: "Interdire le gaspillage", desc: "Économies préservées, désespoir croissant.",   effects: { psyche: -20, mana: +5 } }
    ]
  },
  {
    title: "Le Schisme Religieux",
    text: "Deux sectes se disputent l'origine du Mana. La violence menace de déchirer la société.",
    options: [
      { label: "Trancher par décret", desc: "Stabilise vite, mais la minorité se radicalise.", effects: { psyche: -8, chaos: +4 } },
      { label: "Organiser un concile",desc: "Unificateur mais coûteux en énergie.",             effects: { psyche: +18, mana: -8, chaos: -2 } }
    ]
  },
  {
    title: "La Fièvre du Vide",
    text: "Une maladie psychique frappe ceux qui regardent trop longtemps l'abîsse sous l'île.",
    options: [
      { label: "Voiler l'abîsse",     desc: "Calme les esprits, coûte en ressources.",          effects: { psyche: +20, bio: -8, mana: -6 } },
      { label: "Accepter la vision",  desc: "Mysticisme croissant, instabilité intérieure.",    effects: { psyche: -14, mana: +12, chaos: +5 } }
    ]
  },
  {
    title: "Les Pillards du Ciel",
    text: "Des corsaires sur des vaisseaux volants razzient les périphéries de l'île.",
    options: [
      { label: "Organiser la milice", desc: "Défense efficace mais épuisante.",                 effects: { psyche: -5, bio: -10, chaos: +3 } },
      { label: "Payer un tribut",     desc: "La paix achetée fragilise les réserves.",          effects: { mana: -15, psyche: +8 } }
    ]
  },

  // ── PILIER THERMAL ────────────────────────────────────────────────────────
  {
    title: "La Faille Thermique",
    text: "Une crevasse crache une vapeur brûlante qui réchauffe l'île mais terrifie les habitants.",
    options: [
      { label: "Laisser ouvert",      desc: "Réchauffe l'air, le moral s'érode.",               effects: { thermal: +20, psyche: -10 } },
      { label: "Sceller avec le Mana",desc: "Stabilise le climat, coûte de l'énergie.",         effects: { thermal: -15, mana: -10, psyche: +5 } }
    ]
  },
  {
    title: "L'Épidémie Fongique",
    text: "Des champignons parasites dévorent les cultures. Ils prolifèrent dans le froid humide.",
    options: [
      { label: "Surchauffer l'île",   desc: "Tue le champignon mais stresse la biosphère.",     effects: { thermal: +25, bio: +10, mana: -5 } },
      { label: "Purger par le chaos", desc: "Magie instable mais efficace.",                    effects: { bio: +15, chaos: +8, psyche: -5 } }
    ]
  },
  {
    title: "Le Sacrifice Thermique",
    text: "Un prêtre propose de canaliser la chaleur volcanique dans les leylines magiques de l'île.",
    options: [
      { label: "Accepter le rituel",  desc: "Refroidit l'île, surcharge le Mana.",              effects: { thermal: -22, mana: +22, chaos: +7 } },
      { label: "Interdire le rituel", desc: "Préserve la stabilité magique, chaleur persistante.", effects: { thermal: +6, psyche: -8 } }
    ]
  },

  // ── PILIER MANA ───────────────────────────────────────────────────────────
  {
    title: "Les Réfugiés du Ciel",
    text: "Un navire volant en détresse demande l'asile. Leurs bouches consommeront nos réserves limitées.",
    options: [
      { label: "Les accueillir",      desc: "Grand boost de moral, forte ponction biologique.", effects: { psyche: +20, bio: -15, chaos: +3 } },
      { label: "Les repousser",       desc: "Ressources préservées, culpabilité collective.",   effects: { psyche: -15, bio: +5 } }
    ]
  },
  {
    title: "La Cristallisation",
    text: "L'air est trop pur. Le Mana se cristallise sur les arbres, les étouffant lentement.",
    options: [
      { label: "Récolter les cristaux", desc: "Regain de Mana massif, la flore s'effondre.",   effects: { mana: +30, bio: -22, chaos: +4 } },
      { label: "Briser les cristaux",  desc: "Sauve les arbres, pertes énergétiques.",          effects: { bio: +15, mana: -15 } }
    ]
  },
  {
    title: "Le Vortex de Mana",
    text: "Un tourbillon d'énergie brute tourbillonne à la lisière de l'île. Instable mais immense.",
    options: [
      { label: "Absorber le vortex",  desc: "Gain massif, risque de surcharge catastrophique.", effects: { mana: +28, chaos: +8, bio: -6 } },
      { label: "Disperser le vortex", desc: "Sécurise l'île au prix de l'énergie.",             effects: { mana: -10, chaos: -4, psyche: +6 } }
    ]
  },

  // ── DILEMME COMPLEXE ──────────────────────────────────────────────────────
  {
    title: "L'Oracle Silencieux",
    text: "Un oracle prédit une catastrophe imminente sans en révéler la nature. Croire ou ignorer ?",
    options: [
      { label: "Croire et préparer",  desc: "Renforcement général. Coûteux mais rassurant.",    effects: { bio: +5, mana: -10, psyche: +12, chaos: -3 } },
      { label: "Ignorer la prophétie",desc: "Préserve les ressources, le doute s'installe.",    effects: { psyche: -12, chaos: +5 } }
    ]
  },
];
