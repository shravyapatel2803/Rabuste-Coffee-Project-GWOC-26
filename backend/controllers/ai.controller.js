import * as AIService from "../services/ai.service.js";

//user side
export const getAIFilters = async (req, res) => {
  try {
    const filters = await AIService.getDiscoveryFilters();
    res.status(200).json({
      success: true,
      data: filters
    });
  } catch (error) {
    console.error("Filter Fetch Error:", error);
    res.status(500).json({ message: "Failed to fetch AI filters" });
  }
};

export const recommendCoffee = async (req, res) => {
  try {
    const { mood, time, strength, bitterness, caffeine, flavor } = req.body;
    
    const result = await AIService.getCoffeeRecommendations({ 
      mood, 
      time, 
      strength,
      bitterness, 
      caffeine, 
      flavor 
    });

    res.status(200).json({
      success: true,
      data: result.coffees,      
      suggestion: result.suggestion  
    });

  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const pairArt = async (req, res) => {
  try {
    const { coffeeId } = req.params;
    const pairing = await AIService.getArtPairing(coffeeId);
    res.status(200).json({ success: true, data: pairing });
  } catch (error) {
    console.error("AI Pairing Error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const chatWithAI = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Query is required" });

    // Service ab hamesha ek object return karega (Answer ya Fallback)
    const response = await AIService.getChatbotResponse(query);
    
    res.status(200).json({ 
        success: true, 
        data: response 
    });

  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ 
        success: false, 
        message: "AI brain is sleeping. Try again later." 
    });
  }
};


// admin side

export const getAIConfig = async (req, res) => {
  try {
    const config = await AIService.fetchAIConfig();
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch config" });
  }
};

export const updateAIConfig = async (req, res) => {
  try {
    const updatedConfig = await AIService.modifyAIConfig(req.body);
    res.status(200).json(updatedConfig);
  } catch (error) {
    res.status(500).json({ message: "Failed to update config" });
  }
};

export const getAllQAs = async (req, res) => {
  try {
    const qas = await AIService.fetchAllQAs();
    res.status(200).json(qas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Q&As" });
  }
};

export const createQA = async (req, res) => {
  try {
    const newQA = await AIService.createNewQA(req.body);
    res.status(201).json(newQA);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateQA = async (req, res) => {
  try {
    const updatedQA = await AIService.modifyQA(req.params.id, req.body);
    if (!updatedQA) return res.status(404).json({ message: "Q&A not found" });
    res.status(200).json(updatedQA);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

export const deleteQA = async (req, res) => {
  try {
    await AIService.removeQA(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};