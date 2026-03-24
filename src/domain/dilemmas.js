export const DILEMMAS = [
  {
    title: "Le Réveil des Racines",
    text: "Les réserves de nourriture s'épuisent. Les alchimistes proposent d'injecter du Mana pur dans le sol.",
    options: [
      { label: "Injecter le Mana", desc: "Nourriture abondante, mais instabilité magique.", effects: { mana: -15, bio: +20, chaos: +5, thermal: +5 } },
      { label: "Rationner et Prier", desc: "Préserve l'équilibre, mais le peuple souffre.", effects: { psyche: -15, bio: -5, mana: +5, chaos: -2 } }
    ]
  },
  {
    title: "La Faille Thermique",
    text: "Une crevasse s'est ouverte, crachant une vapeur brûlante qui réchauffe l'île mais terrifie les habitants.",
    options: [
      { label: "Laisser ouvert", desc: "Réchauffe l'air, baisse le moral.", effects: { thermal: +20, psyche: -10 } },
      { label: "Sceller avec la magie", desc: "Coûte du mana, stabilise le climat.", effects: { thermal: -15, mana: -10, psyche: +5 } }
    ]
  },
  {
    title: "Les Réfugiés du Ciel",
    text: "Un navire volant en détresse demande l'asile. Ils consommeront nos ressources limitées.",
    options: [
      { label: "Les accueillir", desc: "Grand boost de moral, forte ponction biologique.", effects: { psyche: +20, bio: -15, chaos: +3 } },
      { label: "Les repousser", desc: "Préserve les ressources, culpabilité collective.", effects: { psyche: -15, bio: +5 } }
    ]
  },
  {
    title: "Le Festival de la Lueur",
    text: "Le peuple veut organiser une grande fête pour oublier la peur du vide. Cela demande d'illuminer l'île entière.",
    options: [
      { label: "Autoriser la fête", desc: "Le moral explose, le mana s'effondre.", effects: { psyche: +25, mana: -20, chaos: +2 } },
      { label: "Interdire le gaspillage", desc: "Économise l'énergie, le désespoir monte.", effects: { psyche: -20, mana: +5 } }
    ]
  },
  {
    title: "L'Épidémie Fongique",
    text: "Des champignons parasites dévorent nos cultures. Ils prolifèrent avec l'humidité froide.",
    options: [
      { label: "Surchauffer l'île", desc: "Tue le champignon par la chaleur.", effects: { thermal: +25, bio: +10, mana: -5 } },
      { label: "Purger par le chaos", desc: "Utilise la magie instable pour les détruire.", effects: { bio: +15, chaos: +8, psyche: -5 } }
    ]
  },
  {
    title: "La Cristallisation",
    text: "L'air devient trop pur, le mana se cristallise sur les arbres, les étouffant.",
    options: [
      { label: "Récolter les cristaux", desc: "Regain de mana massif, perte de la flore.", effects: { mana: +30, bio: -20, chaos: +4 } },
      { label: "Briser les cristaux", desc: "Sauve les arbres, perte d'énergie.", effects: { bio: +15, mana: -15 } }
    ]
  }
];