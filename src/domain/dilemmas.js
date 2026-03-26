// Chaque dilemme affecte les piliers : bio, psyche, thermal, mana, chaos
// Règle d'équilibre : chaque option doit avoir au moins un chemin "viable".
// Effets plafonnés à ±18 sur un seul pilier, chaos max +5 par dilemme.

export const DILEMMAS = [

  // ── PILIER BIO ────────────────────────────────────────────────────────────
  {
    title: "Le Réveil des Racines",
    text: "Les réserves de nourriture s'épuisent. Les alchimistes proposent d'injecter du Mana pur dans le sol.",
    options: [
      { label: "Injecter le Mana",    desc: "Nourriture abondante, instabilité magique.",    effects: { mana: -12, bio: +16, chaos: +2 } },
      { label: "Rationner et Prier",  desc: "Préserve l'équilibre, le peuple endure.",       effects: { psyche: -8, bio: -3, mana: +4, chaos: -1 } }
    ]
  },
  {
    title: "La Sécheresse",
    text: "Les canaux s'assèchent. Sans irrigation, les champs mourront avant la prochaine pluie.",
    options: [
      { label: "Détourner le Mana",   desc: "Irrigation magique efficace, mais instable.",   effects: { bio: +14, mana: -10, chaos: +2 } },
      { label: "Rationner l'eau",     desc: "Préserve les ressources, le peuple endure.",    effects: { bio: -5, psyche: -6, thermal: -3 } }
    ]
  },
  {
    title: "L'Invasion de Spores",
    text: "Une nuée de spores étranges s'abat sur les cultures. Leur nature — parasite ou mutualiste — est inconnue.",
    options: [
      { label: "Brûler les champs",   desc: "Élimine les spores, détruit la récolte.",       effects: { bio: -12, thermal: +10, mana: +4 } },
      { label: "Inoculer le sol",     desc: "Risqué, potentiellement transformateur.",        effects: { bio: +10, chaos: +3, mana: -4 } }
    ]
  },
  {
    title: "La Forêt Sentinelle",
    text: "Des arbres anciens bougent la nuit. Les druides y voient une bénédiction, les gardes une menace.",
    options: [
      { label: "S'allier aux arbres", desc: "Alliance mystique, régénération biologique.",   effects: { bio: +18, mana: -12, chaos: +2 } },
      { label: "Les surveiller",      desc: "Prudence raisonnée, légère tension.",           effects: { bio: +5, psyche: -4 } }
    ]
  },
  {
    title: "La Moisson Bénie",
    text: "Une saison extraordinaire laisse présager une récolte record si des rituels de fertilité sont accomplis.",
    options: [
      { label: "Accomplir les rituels", desc: "Récolte abondante, foi renforcée.",           effects: { bio: +14, psyche: +8, mana: -8 } },
      { label: "Conserver le Mana",     desc: "Énergie préservée, occasion partiellement manquée.", effects: { mana: +6, bio: +5 } }
    ]
  },

  // ── PILIER PSYCHÉ ─────────────────────────────────────────────────────────
  {
    title: "Le Festival de la Lueur",
    text: "Le peuple veut illuminer l'île entière pour chasser la peur du vide.",
    options: [
      { label: "Autoriser la fête",       desc: "Moral en fête, Mana en cendres.",           effects: { psyche: +20, mana: -16, chaos: +1 } },
      { label: "Organiser une cérémonie", desc: "Sobre mais unificateur, coût modéré.",      effects: { psyche: +10, mana: -5 } }
    ]
  },
  {
    title: "Le Schisme Religieux",
    text: "Deux sectes se disputent l'origine du Mana. La violence menace de déchirer la société.",
    options: [
      { label: "Trancher par décret",  desc: "Stabilise vite, minorité frustrée.",           effects: { psyche: -5, chaos: +3 } },
      { label: "Organiser un concile", desc: "Unificateur mais coûteux en énergie.",         effects: { psyche: +16, mana: -8, chaos: -2 } }
    ]
  },
  {
    title: "La Fièvre du Vide",
    text: "Une maladie psychique frappe ceux qui regardent trop longtemps l'abîsse sous l'île.",
    options: [
      { label: "Voiler l'abîsse",     desc: "Calme les esprits, coûte en ressources.",       effects: { psyche: +16, bio: -5, mana: -5 } },
      { label: "Accepter la vision",  desc: "Mysticisme croissant, instabilité intérieure.", effects: { psyche: -10, mana: +10, chaos: +3 } }
    ]
  },
  {
    title: "Les Pillards du Ciel",
    text: "Des corsaires sur des vaisseaux volants razzient les périphéries de l'île.",
    options: [
      { label: "Organiser la milice", desc: "Défense efficace, peuple épuisé.",              effects: { psyche: +5, bio: -8, chaos: +2 } },
      { label: "Payer un tribut",     desc: "La paix achetée fragilise les réserves.",       effects: { mana: -12, psyche: +8 } }
    ]
  },
  {
    title: "L'École des Sages",
    text: "Un groupe de savants propose de fonder une académie pour transmettre les savoirs anciens.",
    options: [
      { label: "Financer l'académie", desc: "Savoir préservé, investissement durable.",      effects: { psyche: +14, mana: -8, bio: +4 } },
      { label: "Refuser pour l'instant", desc: "Ressources préservées, tension intellectuelle.", effects: { mana: +5, psyche: -5 } }
    ]
  },

  // ── PILIER THERMAL ────────────────────────────────────────────────────────
  {
    title: "La Faille Thermique",
    text: "Une crevasse crache une vapeur brûlante qui réchauffe l'île mais terrifie les habitants.",
    options: [
      { label: "Laisser ouvert",       desc: "Réchauffe l'air, le moral s'érode.",           effects: { thermal: +16, psyche: -8 } },
      { label: "Sceller avec le Mana", desc: "Stabilise le climat, coûte de l'énergie.",     effects: { thermal: -14, mana: -8, psyche: +5 } }
    ]
  },
  {
    title: "L'Épidémie Fongique",
    text: "Des champignons parasites dévorent les cultures. Ils prolifèrent dans le froid humide.",
    options: [
      { label: "Surchauffer l'île",   desc: "Tue le champignon, stresse la biosphère.",      effects: { thermal: +18, bio: +8, mana: -4 } },
      { label: "Purger par le chaos", desc: "Magie instable mais efficace.",                 effects: { bio: +12, chaos: +4, psyche: -4 } }
    ]
  },
  {
    title: "Le Sacrifice Thermique",
    text: "Un prêtre propose de canaliser la chaleur volcanique dans les leylines magiques de l'île.",
    options: [
      { label: "Accepter le rituel",       desc: "Refroidit l'île, recharge le Mana.",       effects: { thermal: -18, mana: +16, chaos: +4 } },
      { label: "Refroidir naturellement",  desc: "Lent mais sûr, sans risque magique.",      effects: { thermal: -8, bio: +4 } }
    ]
  },
  {
    title: "La Pluie de Cendres",
    text: "Un volcan lointain couvre l'île de cendres. Fertilisantes mais étouffantes.",
    options: [
      { label: "Laisser se déposer",  desc: "Terres enrichies, air vicié.",                  effects: { bio: +12, thermal: +8, psyche: -6 } },
      { label: "Disperser par magie", desc: "Ciel dégagé, Mana consommé.",                   effects: { psyche: +6, mana: -8, thermal: -5 } }
    ]
  },

  // ── PILIER MANA ───────────────────────────────────────────────────────────
  {
    title: "Les Réfugiés du Ciel",
    text: "Un navire volant en détresse demande l'asile. Leurs bouches consommeront nos réserves limitées.",
    options: [
      { label: "Les accueillir",  desc: "Grand boost de moral, forte ponction biologique.",  effects: { psyche: +18, bio: -10, chaos: +2 } },
      { label: "Les orienter",    desc: "Aide partielle, conscience tranquille.",             effects: { psyche: +6, mana: -4 } }
    ]
  },
  {
    title: "La Cristallisation",
    text: "L'air est trop pur. Le Mana se cristallise sur les arbres, les étouffant lentement.",
    options: [
      { label: "Récolter les cristaux", desc: "Regain de Mana massif, la flore s'effondre.", effects: { mana: +18, bio: -16, chaos: +3 } },
      { label: "Briser les cristaux",  desc: "Sauve les arbres, pertes énergétiques.",       effects: { bio: +12, mana: -10 } }
    ]
  },
  {
    title: "Le Vortex de Mana",
    text: "Un tourbillon d'énergie brute tourbillonne à la lisière de l'île. Instable mais immense.",
    options: [
      { label: "Absorber le vortex",  desc: "Gain massif, risque de surcharge catastrophique.", effects: { mana: +18, chaos: +5, bio: -4 } },
      { label: "Disperser le vortex", desc: "Sécurise l'île au prix de l'énergie.",          effects: { mana: -6, chaos: -4, psyche: +5 } }
    ]
  },

  // ── DILEMMES COMPLEXES ────────────────────────────────────────────────────
  {
    title: "L'Oracle Silencieux",
    text: "Un oracle prédit une catastrophe imminente sans en révéler la nature. Croire ou ignorer ?",
    options: [
      { label: "Croire et préparer",     desc: "Renforcement général. Coûteux mais rassurant.", effects: { bio: +6, mana: -8, psyche: +10, chaos: -3 } },
      { label: "Enquêter discrètement", desc: "Informations partielles, sans dépense.",         effects: { psyche: +4, chaos: -1 } }
    ]
  },
  {
    title: "L'Alliance Contre-Nature",
    text: "Une créature du Vide propose une alliance : sa magie en échange d'un tribut de Mana.",
    options: [
      { label: "Accepter l'alliance", desc: "Pouvoir immense, corrupteur à terme.",             effects: { mana: +14, bio: +8, chaos: +5 } },
      { label: "La bannir",           desc: "Pureté préservée, occasion perdue.",               effects: { psyche: +8, chaos: -3 } }
    ]
  },
  {
    title: "Le Chant des Pierres",
    text: "Les leylines de l'île se mettent à vibrer, comme si la roche elle-même cherchait à communiquer.",
    options: [
      { label: "Écouter les pierres", desc: "Révèle les flux naturels, rééquilibre l'île.",    effects: { bio: +8, thermal: -6, mana: +6, chaos: -2 } },
      { label: "Ignorer le phénomène", desc: "Rien ne change, l'occasion est manquée.",        effects: { chaos: -1 } }
    ]
  },
];
