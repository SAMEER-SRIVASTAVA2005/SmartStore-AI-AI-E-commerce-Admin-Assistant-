const { GoogleGenerativeAI } = require('@google/generative-ai');

// Generate Content via Gemini SDK
const generateProductAIContent = async (req, res) => {
  const { title, category, keywords } = req.body;

  if (!title || !category) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both a product title and a category',
    });
  }

  const keywordStr = keywords ? ` keywords: ${keywords}` : '';
  const prompt = `
You are an expert e-commerce SEO specialist and professional copywriter.
Generate optimized content for a product with the following details:
- Title: ${title}
- Category: ${category}
${keywordStr}

Please generate:
1. A compelling, premium e-commerce product description (around 3-4 sentences, highlighting features and user benefit).
2. Exactly 5 highly relevant SEO search tags/keywords.
3. An engaging, high-conversion social media marketing caption with hashtags.

You MUST respond ONLY with a valid JSON object matching this structure exactly (do not wrap it in markdown code blocks like \`\`\`json ... \`\`\` or include any other text, just raw JSON):
{
  "description": "The product description text here",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "marketingCaption": "The social media marketing caption here"
}
`;

  try {
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      console.log('Using Gemini API for content generation...');
      // Initialize Gemini
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      
      // Clean potential JSON markdown wrapping
      let cleanedText = text;
      if (text.startsWith('```json')) {
        cleanedText = text.substring(7, text.length - 3).trim();
      } else if (text.startsWith('```')) {
        cleanedText = text.substring(3, text.length - 3).trim();
      }

      try {
        const aiResponse = JSON.parse(cleanedText);
        return res.json({
          success: true,
          data: aiResponse,
        });
      } catch (parseError) {
        console.error('Failed to parse Gemini JSON output:', text);
        // Fall back to simple parsing or mock if raw text parser fails
        throw new Error('Gemini API did not return standard JSON format');
      }
    } else {
      console.log('No Gemini API Key found or default key used. Falling back to offline Rich AI Mock Engine...');
      // Rich Mock AI Engine
      // Generates tailored content based on input keywords and category
      const words = keywords ? keywords.split(',') : [category];
      const primaryKeyword = words[0]?.trim() || category;
      
      const mockDescription = `Elevate your lifestyle with the all-new premium ${title}. Thoughtfully designed for modern users, this state-of-the-art ${category} masterpiece blends unparalleled functionality with beautiful aesthetics. Engineered with high-quality materials to guarantee long-lasting durability, it is the ultimate choice for anyone looking to optimize their daily routine with a touch of elegance.`;
      
      const mockTags = [
        primaryKeyword.toLowerCase().replace(/\s+/g, ''),
        category.toLowerCase().replace(/\s+/g, ''),
        'premiumquality',
        'smartstoreai',
        'musthave'
      ];
      
      const mockMarketingCaption = `✨ Experience the future of convenience with the brand-new ${title}! 🚀 Perfectly designed to enhance your lifestyle, this is the ultimate ${category} upgrade you've been waiting for. 🛒 Get yours today and shop smarter! #SmartStoreAI #${primaryKeyword.replace(/\s+/g, '')} #NewRelease #ShopOnline`;

      // Simulate a small network delay for a real AI feel in frontend
      await new Promise((resolve) => setTimeout(resolve, 800));

      return res.json({
        success: true,
        data: {
          description: mockDescription,
          tags: mockTags,
          marketingCaption: mockMarketingCaption,
        },
      });
    }
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({
      success: false,
      message: `AI Generation failed: ${error.message}`,
    });
  }
};

module.exports = {
  generateProductAIContent,
};
