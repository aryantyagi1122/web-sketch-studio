import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, type = 'html' } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    let systemMessage = '';
    let userPrompt = '';

    switch (type) {
      case 'html':
        systemMessage = `You are an expert web developer. Generate complete, modern, and responsive HTML code with inline CSS and JavaScript when needed. 
        - Always include proper DOCTYPE, meta tags, and semantic HTML
        - Use modern CSS features like flexbox, grid, and animations
        - Make it mobile-responsive
        - Include proper accessibility attributes
        - Add interactive JavaScript functionality when appropriate
        - Use beautiful color schemes and typography
        - Return only the HTML code without any explanation`;
        userPrompt = `Create HTML code for: ${prompt}`;
        break;
      
      case 'css':
        systemMessage = `You are an expert CSS developer. Generate modern, clean, and efficient CSS code.
        - Use modern CSS features like flexbox, grid, custom properties
        - Include smooth animations and transitions
        - Make it responsive with media queries
        - Use proper naming conventions
        - Include hover effects and interactive states
        - Return only the CSS code without any explanation`;
        userPrompt = `Create CSS code for: ${prompt}`;
        break;
      
      case 'js':
        systemMessage = `You are an expert JavaScript developer. Generate clean, modern JavaScript code.
        - Use ES6+ features
        - Include proper error handling
        - Write clean, readable code with comments
        - Use modern DOM manipulation techniques
        - Include event listeners and interactive functionality
        - Return only the JavaScript code without any explanation`;
        userPrompt = `Create JavaScript code for: ${prompt}`;
        break;
      
      default:
        throw new Error('Invalid code type. Must be html, css, or js');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedCode = data.choices[0].message.content;

    // Clean up the code (remove markdown formatting if present)
    const cleanCode = generatedCode
      .replace(/```html/g, '')
      .replace(/```css/g, '')
      .replace(/```javascript/g, '')
      .replace(/```js/g, '')
      .replace(/```/g, '')
      .trim();

    return new Response(JSON.stringify({ 
      code: cleanCode,
      type: type,
      prompt: prompt 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-code function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});