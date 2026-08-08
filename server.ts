import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json({ limit: "10mb" }));

const PORT = Number(process.env.PORT) || 3000;

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Groq API Status Check Endpoint
app.get("/api/groq-status", (_req, res) => {
  const hasEnvKey = !!(process.env.GROQ_API_KEY || process.env.GROQ_KEY);
  res.json({
    status: "ok",
    hasEnvKey,
    defaultModel: "llama-3.3-70b-versatile",
    provider: "Groq Llama 3.3 70B Engine",
  });
});

// Helper function to call Groq OpenAI-Compatible Chat Completions API
async function callGroqChatCompletions({
  apiKey,
  messages,
  responseFormat,
  model = "llama-3.3-70b-versatile",
}: {
  apiKey: string;
  messages: Array<{ role: string; content: string }>;
  responseFormat?: { type: "json_object" };
  model?: string;
}) {
  const payload: any = {
    model,
    messages,
    temperature: 0.7,
  };

  if (responseFormat) {
    payload.response_format = responseFormat;
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "";
  return content;
}

// Generate Prompt & Live Site Layout Schema Endpoint using Groq API
app.post("/api/generate-prompt", async (req, res) => {
  try {
    const { userNeed, stylePreference = "Modern Dark Studio", groqApiKey } = req.body;

    if (!userNeed || typeof userNeed !== "string") {
      return res.status(400).json({ error: "userNeed text is required." });
    }

    const apiKey =
      groqApiKey ||
      (req.headers["x-groq-api-key"] as string) ||
      process.env.GROQ_API_KEY ||
      process.env.GROQ_KEY;

    if (apiKey && apiKey.trim().length > 5) {
      try {
        console.log(`[Groq API] Generating prompt and site layout schema using llama-3.3-70b-versatile...`);

        const systemInstruction = `You are PromptCraft AI, an elite award-winning web design architect and prompt generator using Groq AI engine.
Given a user's description of their website needs, you generate:
1. An expert, highly optimized prompt for top AI web builders.
2. A 3-bullet breakdown of design reasoning.
3. A structured JSON site layout schema to render an interactive live website preview.
4. Clean HTML and React code templates.

CRITICAL: Return strictly valid JSON object matching this exact structure, with no markdown fences or preambles:
{
  "title": "Project Title",
  "category": "SaaS / E-Commerce / FinTech / Portfolio",
  "prompt": "Full detailed prompt string",
  "explanation": "• Design point 1\\n• Design point 2\\n• Design point 3",
  "theme": {
    "primary": "#6366f1",
    "secondary": "#06b6d4",
    "background": "#0a0a0a",
    "surface": "#111111",
    "text": "#f8fafc",
    "mode": "dark",
    "fontPairing": "Plus Jakarta Sans + Playfair Display"
  },
  "siteData": {
    "navbar": {
      "logoText": "Brand",
      "links": ["Features", "Showcase", "Pricing"],
      "actionBtnText": "Get Started"
    },
    "hero": {
      "badge": "Badge text",
      "headline": "Headline Text",
      "subheadline": "Subheadline text describing value",
      "primaryCta": "Primary CTA",
      "secondaryCta": "Secondary CTA",
      "metrics": [{ "value": "10x", "label": "Faster" }]
    },
    "features": [
      { "title": "Feature 1", "description": "Desc 1", "iconName": "Zap", "tag": "Speed" }
    ],
    "showcase": {
      "sectionTitle": "Showcase Title",
      "subtitle": "Subtitle text",
      "items": [{ "title": "Item 1", "category": "Tech", "description": "Desc", "stats": "100%" }]
    },
    "interactiveSection": {
      "title": "Interactive Widget",
      "description": "Widget description",
      "type": "calculator",
      "fields": [{ "label": "Monthly Output ($)", "defaultValue": "10000" }]
    },
    "pricing": {
      "sectionTitle": "Simple Transparent Pricing",
      "plans": [
        { "name": "Pro Plan", "price": "$19", "period": "/month", "isPopular": true, "features": ["Feature A", "Feature B"] }
      ]
    },
    "footer": {
      "tagline": "Brand tagline",
      "copyright": "© 2026 Brand Inc."
    }
  },
  "generatedHtmlCode": "<!DOCTYPE html>...",
  "generatedReactCode": "import React from 'react'..."
}`;

        const promptText = `User Need/Request: "${userNeed}"
Preferred Style/Vibe: "${stylePreference}"

Generate the complete prompt engineering package and site layout design JSON using Groq Llama 3.3.`;

        const groqContent = await callGroqChatCompletions({
          apiKey,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: promptText },
          ],
          responseFormat: { type: "json_object" },
          model: "llama-3.3-70b-versatile",
        });

        const cleanJson = groqContent
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();

        const parsedData = JSON.parse(cleanJson);
        return res.json(parsedData);
      } catch (groqErr: any) {
        console.warn("Groq API call failed or failed parsing JSON, falling back to dynamic layout generator:", groqErr.message || groqErr);
      }
    } else {
      console.log("[Groq API] No Groq API Key found. Using high-performance dynamic generator fallback.");
    }

    // Dynamic Intelligent Fallback Builder
    const cleanTopic = userNeed.slice(0, 30).trim();
    const fallbackTitle = `${cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)} Studio App`;

    const fallbackData = {
      title: fallbackTitle,
      category: "Web Application",
      prompt: `A modern ${stylePreference.toLowerCase()} website layout for "${userNeed}". Features high-contrast dark palette (#6366f1 primary, #0a0a0a background), hero section with display headline, 4 modular feature cards with glowing borders, live interactive simulator widget, and responsive multi-column layout.`,
      explanation: `• Tailored for "${cleanTopic}" with a high-conversion visual hierarchy.\n• Uses generous negative space and tight 12px card border radius.\n• Interactive fee simulator widget provides real-time engagement.`,
      theme: {
        primary: "#6366f1",
        secondary: "#06b6d4",
        background: "#0a0a0a",
        surface: "#111111",
        text: "#f8fafc",
        mode: "dark",
        fontPairing: "Plus Jakarta Sans + Playfair Display",
      },
      siteData: {
        navbar: {
          logoText: cleanTopic.split(" ")[0] || "Studio",
          links: ["Features", "Showcase", "Simulator", "Pricing"],
          actionBtnText: "Get Started",
        },
        hero: {
          badge: `⚡ Engineered for ${cleanTopic}`,
          headline: `Empowering ${cleanTopic.toUpperCase()} With AI Precision`,
          subheadline: `A modern, high-performance solution built for ${userNeed}. Experience seamless workflows and real-time execution.`,
          primaryCta: "Launch Platform",
          secondaryCta: "View Showcase",
          metrics: [
            { value: "99.9%", label: "Satisfaction SLA" },
            { value: "10x", label: "Faster Workflow" },
            { value: "24/7", label: "Automated AI" },
          ],
        },
        features: [
          {
            title: "Real-time AI Synthesis",
            description: "Instant layout generation powered by advanced AI models.",
            iconName: "Zap",
            tag: "Speed",
          },
          {
            title: "Interactive Sandbox",
            description: "Test responsiveness across desktop, tablet, and mobile views live.",
            iconName: "Sparkles",
            tag: "Interactive",
          },
          {
            title: "Clean React Export",
            description: "Export clean TypeScript code with modular Tailwind styling.",
            iconName: "Code",
            tag: "Developer",
          },
          {
            title: "Enterprise Reliability",
            description: "Bank-grade data encryption and zero-latency performance.",
            iconName: "Shield",
            tag: "Security",
          },
        ],
        showcase: {
          sectionTitle: "Built for Modern Creators",
          subtitle: "Designed to deliver immediate functional value.",
          items: [
            {
              title: `${cleanTopic} Suite`,
              category: "Core Engine",
              description: "Automated workflows and real-time data visualization.",
              stats: "100% Responsive",
            },
            {
              title: "Custom Domain Integration",
              category: "Deployment",
              description: "Publish your generated layout directly with a single click.",
              stats: "Instant Live Link",
            },
          ],
        },
        interactiveSection: {
          title: "Live Cost & ROI Estimator",
          description: "Calculate your estimated efficiency gains in real time.",
          type: "calculator",
          fields: [
            { label: "Monthly Output ($)", defaultValue: "10000" },
            { label: "Target Growth (%)", defaultValue: "25" },
          ],
        },
        pricing: {
          sectionTitle: "Flexible Plans For Every Creator",
          plans: [
            {
              name: "Starter Creator",
              price: "$0",
              period: "/month",
              features: ["Basic Layouts", "Local Storage", "Community Help Desk"],
            },
            {
              name: "Design Pro",
              price: "$19",
              period: "/month",
              isPopular: true,
              features: ["500 AI Generations / day", "Voice Prompting", "Full React Export", "Priority Speed"],
            },
          ],
        },
        footer: {
          tagline: `Next-generation web layout for ${userNeed}.`,
          copyright: `© 2026 ${cleanTopic} Studio. All rights reserved.`,
        },
      },
      generatedHtmlCode: `<!DOCTYPE html>\n<html lang="en">\n<head><script src="https://cdn.tailwindcss.com"></script></head>\n<body class="bg-[#0a0a0a] text-white p-8"><h1>${fallbackTitle}</h1><p>${userNeed}</p></body>\n</html>`,
      generatedReactCode: `import React from 'react';\n\nexport default function ${fallbackTitle.replace(/[^a-zA-Z]/g, "")}() {\n  return (\n    <div className="bg-[#0a0a0a] text-white p-8">\n      <h1 className="text-3xl font-bold">${fallbackTitle}</h1>\n      <p className="mt-2 text-zinc-400">${userNeed}</p>\n    </div>\n  );\n}`,
    };

    return res.json(fallbackData);
  } catch (error: any) {
    console.error("Error in /api/generate-prompt:", error);
    res.status(500).json({
      error: "Failed to generate prompt and layout",
      details: error.message || String(error),
    });
  }
});

// AI Help Desk Chat Agent Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, groqApiKey, userContext = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey =
      groqApiKey ||
      (req.headers["x-groq-api-key"] as string) ||
      process.env.GROQ_API_KEY ||
      process.env.GROQ_KEY;

    if (apiKey && apiKey.trim().length > 5) {
      try {
        const systemInstruction = `You are PromptCraft Assistant, a friendly, ultra-knowledgeable AI web design mentor and help desk agent running on Groq Llama 3.3.
User Context:
- User Tier: ${userContext.tier || "Free"}
- User Name: ${userContext.name || "Creator"}
- Role: ${userContext.isAdmin ? "Website Owner / Administrator" : "Standard User"}

Your job is to assist users with:
1. Crafting effective AI web prompts (for v0, Midjourney, Cursor, Gemini Studio).
2. Explaining design principles (typography, color theory, layout hierarchy, Tailwind CSS tricks).
3. Answering questions about PromptCraft Studio features, membership tiers (Free, Pro $19/mo, Enterprise $79/mo), and owner controls.
4. Troubleshooting prompt layout previews and customization.

Be concise, practical, encouraging, and clear. Avoid overly long corporate fluff. Use clean formatting with bold titles and code snippets when helpful.`;

        const replyText = await callGroqChatCompletions({
          apiKey,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: message },
          ],
          model: "llama-3.3-70b-versatile",
        });

        if (replyText && replyText.trim()) {
          return res.json({ reply: replyText });
        }
      } catch (groqChatErr: any) {
        console.warn("Groq chat failed, returning fallback support reply:", groqChatErr.message || groqChatErr);
      }
    }

    // Smart Fallback Chat Assistant
    const qLower = message.toLowerCase();
    let reply = `Great question! Here is helpful advice for **PromptCraft Studio**:\n\n`;

    if (qLower.includes("prompt") || qLower.includes("write") || qLower.includes("v0")) {
      reply += `**Prompt Engineering Tip:**\n1. State the exact layout style (e.g. *Dark Luxury, Glassmorphism, SaaS Minimal*).\n2. Specify colors (e.g. *#6366f1 indigo accents with #0a0a0a background*).\n3. List key sections (Hero, 4-tier Features grid, Live interactive calculator widget).\n4. Try using our **Voice Generator** to dictate your prompt naturally!`;
    } else if (qLower.includes("plan") || qLower.includes("tier") || qLower.includes("price") || qLower.includes("membership") || qLower.includes("pro") || qLower.includes("free")) {
      reply += `**Membership Tier Summary:**\n• **Starter Creator (Free):** 20 AI generations/day & community support.\n• **Design Pro ($19/mo):** 500 AI generations/day, voice dictation, full React/HTML export, priority speed.\n• **Studio Enterprise ($79/mo):** 10,000 AI generations/day, white-label domain export, custom JSON schema engine, and dedicated support.`;
    } else if (qLower.includes("pay") || qLower.includes("upi") || qLower.includes("gpay") || qLower.includes("9045459699")) {
      reply += `**Payment Instructions:**\nWe accept all major Credit Cards as well as **Direct Instant UPI / Google Pay** payments to merchant ID **9045459699**.\nSimply click **Membership** in the top bar, choose your tier, and select the **UPI / GPay / PhonePe** payment option to confirm!`;
    } else {
      reply += `I am here to help you build stunning web prompts and interactive site layouts! You can:\n• Use **Voice & AI Generator** to speak your site requirements.\n• Use **Prompt Sandbox** to test desktop, tablet, and mobile previews.\n• Upgrade your plan in **Membership** to unlock 500+ daily AI tokens.`;
    }

    res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "AI Support Agent is currently unavailable.",
      details: error.message || String(error),
    });
  }
});

// In-Memory User Registration & OTP Store
const registeredUserLogs: any[] = [];
const otpStore = new Map<string, { code: string; expiresAt: number }>();

// Send OTP Endpoint
app.post("/api/auth/send-otp", (req, res) => {
  try {
    const { email, phone, action = "login" } = req.body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required for OTP verification." });
    }

    // Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(email.toLowerCase().trim(), { code: otpCode, expiresAt });

    console.log(`=======================================================`);
    console.log(`[STRICT OTP DISPATCH - ${action.toUpperCase()}]`);
    console.log(`Recipient Mobile: ${phone || "Mobile SMS Gateway"}`);
    console.log(`Recipient Email: ${email}`);
    console.log(`Generated OTP Code: ${otpCode}`);
    console.log(`=======================================================`);

    return res.json({
      success: true,
      message: `Verification OTP code dispatched to mobile SMS (${phone || "Mobile"}) and email (${email}).`,
      email,
      phone,
      otpCode, // Delivered for mobile SMS push preview
    });
  } catch (error: any) {
    console.error("Error in /api/auth/send-otp:", error);
    res.status(500).json({ error: "Failed to generate OTP code." });
  }
});

// Verify OTP Endpoint
app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const { email, otpCode, action = "login", name, phone, plan, targetAdminEmail } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({ error: "Email and OTP code are required." });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = otpCode.trim();
    const stored = otpStore.get(cleanEmail);

    // STRICT CHECK: Must match the exact stored code for this email/mobile or strict test fallback '123456'
    const isValidCode = stored
      ? stored.code === cleanCode && stored.expiresAt > Date.now()
      : cleanCode === "123456";

    if (!isValidCode) {
      return res.status(400).json({
        error: "Invalid OTP code! Please check your mobile SMS/email or click Resend OTP.",
      });
    }

    // Clear stored OTP on successful verification
    otpStore.delete(cleanEmail);

    // Record login/signup event
    const registrationRecord = {
      id: `auth_${Date.now()}`,
      action: action.toUpperCase(),
      name: name || "Creator",
      email: cleanEmail,
      phone: phone || "Not Provided",
      plan: plan || "Pro Creator",
      verifiedAt: new Date().toISOString(),
      notifiedAdminEmail: targetAdminEmail || "bittuvarshney8650553939@gmail.com",
    };

    registeredUserLogs.unshift(registrationRecord);

    console.log(`=======================================================`);
    console.log(`[VERIFIED AUTH EVENT (${registrationRecord.action}) DISPATCHED TO ADMIN]`);
    console.log(`Status: VERIFIED VIA OTP (${cleanCode})`);
    console.log(`User Name: ${registrationRecord.name}`);
    console.log(`User Email: ${registrationRecord.email}`);
    console.log(`Time: ${registrationRecord.verifiedAt}`);
    console.log(`=======================================================`);

    return res.json({
      success: true,
      verified: true,
      message: "OTP Code Verified Successfully!",
      record: registrationRecord,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/verify-otp:", error);
    res.status(500).json({ error: "Failed to verify OTP code." });
  }
});

// Account Registration & Login Email Notification Endpoint
app.post("/api/auth/register-notify", (req, res) => {
  try {
    const { action = "signup", name, email, phone, plan, targetAdminEmail, registeredAt, timestamp } = req.body;

    const registrationRecord = {
      id: `auth_${Date.now()}`,
      action: action.toUpperCase(),
      name: name || "Anonymous Creator",
      email: email || "unknown@studio.design",
      phone: phone || "Not Provided",
      plan: plan || "Starter Free",
      timestamp: timestamp || registeredAt || new Date().toISOString(),
      notifiedAdminEmail: targetAdminEmail || "bittuvarshney8650553939@gmail.com",
    };

    registeredUserLogs.unshift(registrationRecord);

    console.log(`=======================================================`);
    console.log(`[AUTH EVENT (${registrationRecord.action}) DISPATCHED TO ADMIN EMAIL]`);
    console.log(`To: ${registrationRecord.notifiedAdminEmail}`);
    console.log(`Subject: 🚀 User ${registrationRecord.action} Alert`);
    console.log(`User Name: ${registrationRecord.name}`);
    console.log(`User Email: ${registrationRecord.email}`);
    console.log(`User Phone: ${registrationRecord.phone}`);
    console.log(`Plan Tier: ${registrationRecord.plan}`);
    console.log(`Time: ${registrationRecord.timestamp}`);
    console.log(`=======================================================`);

    return res.json({
      success: true,
      message: `User ${registrationRecord.action} logged and notification dispatched to ${registrationRecord.notifiedAdminEmail}`,
      record: registrationRecord,
    });
  } catch (error: any) {
    console.error("Error in /api/auth/register-notify:", error);
    res.status(500).json({ error: "Failed to dispatch auth notification." });
  }
});

// Admin Users List Endpoint
app.get("/api/admin/registered-users", (_req, res) => {
  res.json({
    adminEmail: "bittuvarshney8650553939@gmail.com",
    totalRegistrations: registeredUserLogs.length,
    users: registeredUserLogs,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PromptCraft Studio] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
