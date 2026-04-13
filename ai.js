// src/services/ai.js
const HF_API_KEY = import.meta.env.VITE_HF_API_KEY || '';
const MODEL = 'mistralai/Mistral-7B-Instruct-v0.3'; // Free tier available

export async function getAIResponse(messages) {
  // If no API key, use smart mock responses (perfect for dev/demo)
  if (!HF_API_KEY) {
    return generateMockResponse(messages[messages.length - 1].content);
  }

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${MODEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: formatPrompt(messages),
          parameters: { max_new_tokens: 120, temperature: 0.6 }
        })
      }
    );

    if (!response.ok) throw new Error('AI service unavailable');
    const data = await response.json();
    return data[0]?.generated_text?.trim() || 'I couldn\'t generate a response.';
  } catch (error) {
    console.warn('AI API failed, using mock:', error.message);
    return generateMockResponse(messages[messages.length - 1].content);
  }
}

function formatPrompt(messages) {
  return messages.map(m => `${m.role === 'ai' ? 'Assistant' : 'User'}: ${m.content}`).join('\n') + '\nAssistant:';
}

function generateMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.includes('price') || msg.includes('cost') || msg.includes('mad')) 
    return 'Classic brownies: 25 MAD each. Half Dozen: 135 MAD (save 10%). Dozen: 250 MAD (save 17%). Free delivery over 200 MAD! 🍫';
  if (msg.includes('delivery') || msg.includes('ship') || msg.includes('time')) 
    return 'We deliver in Salé within 2-6 hours. Orders placed before 4 PM ship same-day. 🚚';
  if (msg.includes('allerg') || msg.includes('nut') || msg.includes('gluten')) 
    return 'Walnut brownies contain nuts. All others are nut-free but baked in a facility that handles wheat/soy. Let us know your allergies!';
  if (msg.includes('order') || msg.includes('buy')) 
    return 'Click "Add to Cart" on any brownie, then checkout. We\'ll confirm via WhatsApp instantly! 📱';
  return 'Ask me about pricing, delivery times, allergies, or how to place an order. I\'m here to help! 🍫✨';
}
