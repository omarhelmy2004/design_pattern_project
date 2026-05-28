import Groq from 'groq-sdk';

let groqInstance = null;
const getGroq = () => {
  if (!import.meta.env.VITE_GROQ_API_KEY) {
    console.warn('VITE_GROQ_API_KEY is not set. Groq features will be disabled.');
    return null;
  }
  if (!groqInstance) {
    groqInstance = new Groq({
      apiKey: import.meta.env.VITE_GROQ_API_KEY,
      dangerouslyAllowBrowser: true
    });
  }
  return groqInstance;
};

const MODEL = 'llama-3.3-70b-versatile'; // Fast, highly capable open-source model

/**
 * Chat with the AI Listener
 * @param {Array} messages - Array of {role, content} objects representing the conversation history
 */
export async function chatWithCompanion(messages) {
  const groq = getGroq();
  if (!groq) return "I'm sorry, my AI features aren't configured right now.";
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are WithMe's highly empathetic, non-judgmental AI Companion. 
Your purpose is to actively listen, validate feelings, and provide a safe space for the user to vent.
Rules:
1. NEVER give medical or psychiatric advice. If the user mentions self-harm or suicide, gently provide the 988 lifeline.
2. Keep responses concise (2-4 sentences max). People venting don't want to read essays.
3. Be warm and human-like. Use validating phrases ("That sounds really hard", "I hear you").
4. Do not try to "fix" their problems unless they explicitly ask for solutions. Just listen.`
        },
        ...messages
      ],
      model: MODEL,
      temperature: 0.6,
      max_tokens: 250,
      top_p: 0.9,
    });
    return response.choices[0]?.message?.content || "I'm having trouble connecting right now, but I'm here for you.";
  } catch (error) {
    console.error("Groq chat error:", error);
    return "I'm sorry, I'm having trouble hearing you right now. Please try again in a moment.";
  }
}

/**
 * Generate a personalized daily insight based on recent check-ins
 * @param {Array} recentCheckins - Array of recent check-in objects from Supabase
 */
export async function generateDailyInsight(recentCheckins) {
  const groq = getGroq();
  if (!groq) return null;
  if (!recentCheckins || recentCheckins.length === 0) return null;

  try {
    const checkinText = recentCheckins.map(c => `Date: ${c.check_in_date}, Mood (1-5): ${c.mood_score}, Note: ${c.note || 'None'}`).join('\n');
    
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an insightful, highly empathetic mental health assistant analyzing a user's recent daily check-ins.
Your goal is to find patterns or offer a comforting, personalized observation based ONLY on the data provided.
Rules:
1. Write EXACTLY 2 sentences. No more.
2. Be incredibly warm and encouraging.
3. If they are consistently low (1-2), validate their resilience for continuing to check in.
4. If they had a good day recently, point it out.
5. Do NOT give medical advice or use clinical terms.`
        },
        {
          role: 'user',
          content: `Here are my recent check-ins:\n${checkinText}\n\nWhat is your insight?`
        }
      ],
      model: MODEL,
      temperature: 0.5,
      max_tokens: 100,
      top_p: 0.9,
    });
    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error("Groq insight error:", error);
    return null;
  }
}

/**
 * Generate a supportive AI reply to a Vent
 * @param {string} ventContent - The text of the anonymous vent
 */
export async function generateEmpathyReply(ventContent) {
  const groq = getGroq();
  if (!groq) return null;
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an anonymous community member in a peer support group reading a vent.
Rule 1: Leave a supportive, empathetic comment in exactly 1 or 2 short sentences.
Rule 2: Do NOT give advice. Just validate their feelings.
Rule 3: Sound like a normal, caring human passing by, not like an AI/robot.`
        },
        {
          role: 'user',
          content: ventContent
        }
      ],
      model: MODEL,
      temperature: 0.7,
      max_tokens: 60,
      top_p: 0.9,
    });
    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error("Groq reply error:", error);
    return null;
  }
}
