# Tilly — setup

Static prototype (`tilly-prototype.html`) plus one serverless function (`api/chat.js`)
that talks to Claude Haiku. The API key lives only on the server.

## What's here
- `tilly-prototype.html` — the app (open directly to use the built-in coach)
- `api/chat.js` — serverless function calling Claude Haiku
- `package.json` — declares the Anthropic SDK

## 1. Push to GitHub
From the MoneyCoach folder in a terminal:

```bash
git init
git add .
git commit -m "Tilly prototype + Claude Haiku API"
git branch -M main
git remote add origin https://github.com/SamOHON0/moneycoachtest.git
git push -u origin main
```

If it asks you to authenticate, log in with GitHub in the browser window that opens
(or use a Personal Access Token as the password).

## 2. Deploy on Vercel
1. Go to vercel.com, "Add New… Project", import `SamOHON0/moneycoachtest`.
2. Framework preset: **Other**. No build command needed.
3. Before deploying, open **Environment Variables** and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your new key from console.anthropic.com (starts `sk-ant-...`)
4. Deploy.

Your app will be live at `https://<project>.vercel.app/tilly-prototype.html`.

## 3. Turn on AI in the app
Open the deployed URL, go to the **Tilly** tab, tap the status bar at the top,
choose **Use Claude Haiku**. Done. The chat now uses Claude; numbers still come
from the engine.

## Cost & safety
- Haiku is about €0.002 per message. Set a low spend cap in the Anthropic console while testing.
- Never put the key in the HTML or commit it. It belongs only in the Vercel env var.
- The `model` is chosen in `api/chat.js` (`claude-haiku-4-5-20251001`). Change that one
  string to use a different model with the same key.
