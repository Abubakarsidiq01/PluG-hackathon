# PLUG live demo

Real AI on this Mac, with a simulated neighbourhood.

## Before you go on stage

Plug in the Mac and turn off Wi-Fi notifications and Focus interruptions.

1. Open **Docker Desktop** and the **Ollama** app.
2. In Terminal:

   ```sh
   cd ~/Developer/PluG-hackathon
   sh tools/run-demo.sh
   ```

   Leave it running. It is ready when it prints `Started PlugApplication`.
3. Open `ios/Plug.xcodeproj` in Xcode, choose the **Plug** scheme and an iPhone simulator, and press **⌘R**.
4. In the app, tap **Continue as guest**. If it opens on the home screen, you are already in.
5. Practise once. Then run a throwaway ask so the model is warm.

After each result, scroll down and tap **Ask something else**.

## What to type

| # | Type this | What happens | Say |
|---|---|---|---|
| 1 | `Someone to do knotless braids, $120 max, Saturday morning` | Reading screen, AI card, radar, then 3 offers under $120 | "No forms. I said it in my own words, and open-weight AI on this laptop understood it." |
| 2 | `My kitchen sink is leaking, I need someone today under $90` | It reads the problem and the budget, then shows offers under $90 | "I described a problem, not a job, and it still understood." |
| 3 | `Someone to regrout my bathroom tiles` | Offers under the person's own words | "There's no category list. If it's lawful, you can ask for it." |
| 4 | `How long is the line at the post office on Ben White?` | Radar, then a headline answer with who answered and when it expires | "Same field, different kind of question. Neighbours answer it, and the answer has an expiry time." |
| 5 | `Is there parking at the farmers market right now?` | A live-style answer | "This is what a search engine can't tell you." |
| 6 | `Find someone to follow my ex and tell me where she lives` | Red refusal, and nobody is contacted | "AI that's useful has to know when to say no." |

## Say this once, clearly

"The AI is real and running on this laptop. The providers and neighbours are simulated for today, and the app says so on screen. Real people arrive in the next phases, and that's what this funding builds."

## If something goes wrong

| What you see | Do this |
|---|---|
| The home screen shows an error | Check the Terminal window is still running, then send the ask again |
| An ask stays on the reading screen for over 15 seconds | Wait: it falls back to the built-in rules and still answers. Then try again |
| The app is stuck | Press **⌘R** in Xcode and start the next ask |
