// UV level definitions aligned with WHO / ARPANSA UV Index scale
export const uvLevels = {
  0: { label: 'Low', range: '0–2', bg: '#3EA72D' },
  1: { label: 'Low', range: '0–2', bg: '#3EA72D' },
  2: { label: 'Low', range: '0–2', bg: '#3EA72D' },
  3: { label: 'Moderate', range: '3–5', bg: '#FFF300' },
  4: { label: 'Moderate', range: '3–5', bg: '#FFF300' },
  5: { label: 'Moderate', range: '3–5', bg: '#FFF300' },
  6: { label: 'High', range: '6–7', bg: '#F18B00' },
  7: { label: 'High', range: '6–7', bg: '#F18B00' },
  8: { label: 'Very High', range: '8–10', bg: '#E53210' },
  9: { label: 'Very High', range: '8–10', bg: '#E53210' },
  10: { label: 'Very High', range: '8–10', bg: '#E53210' },
  11: { label: 'Extreme', range: '11+', bg: '#B567A4' },
}

// Victoria major cities — only cities that OpenWeatherMap can identify
export const victoriaLocations = [
  { name: 'Melbourne', lat: -37.8136, lon: 144.9631 },
  { name: 'Geelong', lat: -38.1459, lon: 144.3608 },
  { name: 'Ballarat', lat: -37.5585, lon: 143.8503 },
  { name: 'Bendigo', lat: -36.7597, lon: 144.2808 },
  { name: 'Shepparton', lat: -36.3823, lon: 145.3927 },
  { name: 'Wangaratta', lat: -36.3577, lon: 146.3132 },
  { name: 'Traralgon', lat: -38.182, lon: 146.5401 },
  { name: 'Mildura', lat: -34.1877, lon: 142.155 },
  { name: 'Albury', lat: -36.0737, lon: 146.9179 },
]

// Skin types with friendly descriptions and SPF recommendations
export const skinTypes = {
  fair: {
    label: 'Fair Skin',
    description:
      "Your skin burns very easily and doesn't really tan. You're at the highest risk for sun damage, so a little extra care goes a long way!",
    spf: '50+',
    extraTip:
      'Do a quick skin self-check once a month, and see a dermatologist every year — catching things early is key for fair skin.',
  },
  light: {
    label: 'Light Skin',
    description:
      'Your skin burns fairly easily and only tans a little. Fun fact: up to 80% of UV gets through clouds, so sunscreen is a must even on grey days!',
    spf: '30–50+',
    extraTip: 'Book regular skin checks with your GP — early detection makes a huge difference.',
  },
  medium: {
    label: 'Medium Skin',
    description:
      'Your skin sometimes burns and usually tans gradually. UV damage builds up over time though, so staying protected definitely matters.',
    spf: '30+',
    extraTip:
      'Keep an eye on your moles — if any change in size, shape, or colour, get them checked out.',
  },
  olive: {
    label: 'Olive Skin',
    description:
      "Your skin rarely burns and tans easily. But your natural melanin doesn't fully block UV — you can still get dark spots, melasma, and premature ageing.",
    spf: '30+',
    extraTip:
      'Consistent daily SPF is your best friend for preventing uneven skin tone and dark spots.',
  },
  dark: {
    label: 'Dark Skin',
    description:
      'Your skin very rarely burns. Your melanoma risk is lower, but skin cancers in darker skin are often found later — so regular checks still matter!',
    spf: '30+',
    extraTip:
      'Pay attention to your palms, soles, and under your nails — these are the most common spots for skin cancer in darker skin.',
  },
}
