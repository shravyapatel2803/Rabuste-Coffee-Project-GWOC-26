import Item from "../models/Item.model.js";
import Art from "../models/Art.model.js";
import AIConfig from "../models/aiConfig.model.js";
import AIResponse from "../models/aiResponse.model.js";


export const getDiscoveryFilters = async () => {
  const filter = { "availability.isAvailable": true };

  const [moods, times, flavors] = await Promise.all([
    Item.distinct("bestForMood", filter),
    Item.distinct("bestTime", filter),
    Item.distinct("flavorNotes", filter)
  ]);

  const formatList = (list) => list
    .filter(i => i && typeof i === 'string')
    .map(i => i.trim().charAt(0).toUpperCase() + i.trim().slice(1))
    .sort();

  let uniqueMoods = [...new Set(formatList(moods))];
  let uniqueTimes = [...new Set(formatList(times))];
  let uniqueFlavors = [...new Set(formatList(flavors))];

  if (!uniqueMoods.length) uniqueMoods = ["Focused", "Energetic", "Calm", "Cozy", "Creative"];
  if (!uniqueTimes.length) uniqueTimes = ["Morning", "Afternoon", "Evening", "Late Night"];
  if (!uniqueFlavors.length) uniqueFlavors = ["Nutty", "Chocolatey", "Smoky", "Fruity"];

  return { moods: uniqueMoods, times: uniqueTimes, flavors: uniqueFlavors };
};

// aret suggection
export const getCoffeeRecommendations = async ({ mood, time, strength, bitterness, caffeine, flavor }) => {
   
  let weights = { mood: 30, time: 15, flavor: 20, strength: 15, bitterness: 10, caffeine: 10 };
  try {
    const configDoc = await AIConfig.findOne({ feature: "coffee-discovery" });
    if (configDoc && configDoc.isEnabled) weights = { ...weights, ...configDoc.config }; 
  } catch (err) {}
 
  const [allCoffees, moodMatchingArt, featuredArt] = await Promise.all([
    Item.find({ "availability.isAvailable": true }),
     
    mood 
      ? Art.find({ 
          visibility: "public", 
          availabilityStatus: "available",
          artMood: { $regex: new RegExp(mood, "i") } 
        }).limit(1) 
      : Promise.resolve([]),
 
    Art.find({ visibility: "public", availabilityStatus: "available" }).limit(5)
  ]);

  if (!allCoffees.length) return { coffees: [], suggestion: null };

  //  COFFEE SCORING LOGIC  
  const scoredCoffees = allCoffees.map((coffee) => {
    let currentScore = 0;
    let maxPossibleScore = 0; 
    let reasons = [];

    // Mood
    if (mood) {
        maxPossibleScore += weights.mood;
        if (coffee.bestForMood && coffee.bestForMood.some(m => m.toLowerCase() === mood.toLowerCase())) {
            currentScore += weights.mood;
            reasons.push(`Perfect match for your ${mood} mood.`);
        }
    }
    // Time
    if (time) {
        maxPossibleScore += weights.time;
        if (coffee.bestTime && coffee.bestTime.some(t => t.toLowerCase() === time.toLowerCase())) {
            currentScore += weights.time;
            reasons.push(`Great for ${time} vibes.`);
        }
    }
    // Flavor
    if (flavor) {
        maxPossibleScore += weights.flavor;
        if (coffee.flavorNotes && coffee.flavorNotes.some(f => f.toLowerCase().includes(flavor.toLowerCase()))) {
            currentScore += weights.flavor;
            reasons.push(`Contains distinct ${flavor} notes.`);
        }
    }
    // Levels
    const checkLevelMatch = (userVal, itemVal, weight, label) => {
        if (!userVal) return;
        maxPossibleScore += weight;
        const u = parseInt(userVal);
        const i = itemVal || 0; 
        let isMatch = false;
        if (u === 1 && i <= 1) isMatch = true;       
        else if (u === 3 && (i === 2 || i === 3)) isMatch = true; 
        else if (u === 5 && i >= 4) isMatch = true;  
        if (isMatch) {
            currentScore += weight;
            if (u === 5) reasons.push(`High ${label} as requested.`);
        }
    };
    checkLevelMatch(strength, coffee.strengthLevel, weights.strength, "strength");
    checkLevelMatch(bitterness, coffee.bitterness, weights.bitterness, "bitterness");
    checkLevelMatch(caffeine, coffee.caffeineLevel, weights.caffeine, "caffeine");

    let matchPercentage = maxPossibleScore > 0 ? (currentScore / maxPossibleScore) * 100 : 0;

    return { ...coffee.toObject(), score: matchPercentage, matchReason: reasons.length > 0 ? reasons[0] : "A solid choice." };
  });

  // SORTING
  let validMatches = scoredCoffees.filter(item => item.score > 0);
  validMatches.sort((a, b) => b.score - a.score);
  let finalResults = [];

  if (validMatches.length > 0) {
      finalResults = validMatches.slice(0, 3);
  } else {
      finalResults = allCoffees.filter(c => c.tags && c.tags.includes("bestseller")).slice(0, 3);
      finalResults = finalResults.map(c => ({...c.toObject(), matchReason: "Our crowd favorite (Best Seller)."}));
      if(finalResults.length === 0) finalResults = allCoffees.slice(0, 3);
  }


  let suggestion = null;
  if (moodMatchingArt.length > 0) {
      suggestion = { 
          type: "art", 
          data: moodMatchingArt[0], 
          message: `This artwork matches your "${mood}" vibe.` 
      };
  }
  
  // PRIORITY 
  else if (featuredArt.length > 0) {
      const randomArt = featuredArt[Math.floor(Math.random() * featuredArt.length)];
      suggestion = { 
          type: "art", 
          data: randomArt, 
          message: "Explore our curated art collection." 
      };
  }

  return {
    coffees: finalResults,
    suggestion: suggestion 
  };
};

export const getArtPairing = async (coffeeId) => {
    const coffee = await Item.findById(coffeeId);
    if (!coffee) throw new Error("Coffee not found");
    if (!coffee.bestPairedArtMood || coffee.bestPairedArtMood.length === 0) return { message: "No pairing found." };
    const pairedArts = await Art.find({ artMood: { $in: coffee.bestPairedArtMood }, availabilityStatus: "available", visibility: "public" }).limit(2);
    let explanation = "Matches the vibe.";
    if (coffee.pairingExplanation && coffee.pairingExplanation.get("general")) explanation = coffee.pairingExplanation.get("general");
    return { coffeeName: coffee.name, pairingExplanation: explanation, arts: pairedArts };
};

export const fetchAIConfig = async () => {
    let config = await AIConfig.findOne({ feature: "coffee-discovery" });
    if (!config) config = await AIConfig.create({ feature: "coffee-discovery", config: { moodWeight: 30, timeWeight: 15, strengthWeight: 15, flavorWeight: 20, bitternessWeight: 10, caffeineWeight: 10 }, isEnabled: true });
    return config;
};

// import AIResponse from "../models/aiResponse.model.js";

/**
 * Normalize text: lowercase, remove symbols, trim spaces
 */
const normalizeText = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Optional typo / synonym map (safe, rule-based)
 */
const typoMap = {
  rabustato: "rabusta",
  rabustaa: "rabusta",
  rabasto: "rabusta",
  rabusto: "rabusta",
  robusto: "robusta",
};

/**
 * Normalize word with typo map
 */
const normalizeWord = (word) => typoMap[word] || word;

/**
 * MAIN CHATBOT FUNCTION
 */
export const getChatbotResponse = async (userQuery = "") => {
  try {
    if (!userQuery || typeof userQuery !== "string") return null;

    const cleanQuery = normalizeText(userQuery);

    if (!cleanQuery) return null;

    const queryWords = cleanQuery
      .split(" ")
      .map(normalizeWord)
      .filter(Boolean);

    const directKey = cleanQuery.replace(/\s+/g, "_");

    const directMatch = await AIResponse.findOne({
      key: directKey,
      isActive: true,
    }).lean();

    if (directMatch) return directMatch;

    const responses = await AIResponse.find({ isActive: true }).lean();

    let bestMatch = null;
    let bestScore = 0;

    for (const doc of responses) {
      let score = 0;

      if (doc.question) {
        const q = normalizeText(doc.question);
        if (q.includes(cleanQuery)) score += 10;
      }

      if (Array.isArray(doc.tags)) {
        doc.tags.forEach((tag) => {
          const t = normalizeText(tag);

          if (queryWords.includes(t)) score += 6;

          queryWords.forEach((w) => {
            if (t.includes(w) || w.includes(t)) score += 2;
          });
        });
      }

      if (
        doc.category &&
        queryWords.includes(normalizeText(doc.category))
      ) {
        score += 3;
      }

      if (score > 0 && doc.answer) {
        score += Math.max(0, 5 - doc.answer.length / 100);
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = doc;
      }
    }

    if (bestMatch && bestScore >= 4) {
      return bestMatch;
    }

    return null;

  } catch (error) {
    console.error("AI Chatbot Error:", error);
    return null;
  }
};


// Ensure fetchAllQAs uses proper sorting
export const fetchAllQAs = async () => AIResponse.find().sort({ createdAt: -1 });
export const createNewQA = async (data) => AIResponse.create(data);
export const modifyQA = async (id, data) => AIResponse.findByIdAndUpdate(id, data, { new: true });
export const removeQA = async (id) => AIResponse.findByIdAndDelete(id);
