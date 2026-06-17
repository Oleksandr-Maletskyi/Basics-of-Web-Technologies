const dictionary = {
  "сонце": "☀️",
  "хмара": "☁️",
  "дощ": "🌧️",
  "сніг": "❄️",
  "серце": "❤️",
  "усмішка": "😊",
  "крапка": ".",
  // ... ще 10
};

function translate(text) {
    return text
    .split(/(\p{L}+)/u)
    .map(part => {
            const lowerPart = part.toLowerCase()
            return dictionary[lowerPart] !== undefined ? dictionary[lowerPart] : part;
    })
    .join('');
}
function translateReverse(text) {
    return Object.entries(dictionary).reduce((acc, [word, emoji]) => {
    return acc.replaceAll(emoji, word);
  }, text);
  
}

console.log(translate("Привіт, сонце, хмара, дощ, земля, автобус"));
console.log(translateReverse("Привіт, ☀️, ☁️, 🌧️, земля, автобус"));
