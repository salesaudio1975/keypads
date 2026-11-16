# Keypads

Lutron Alisse keypad mockups that clients can edit, at https://keypads.audio1975.com

## Make a new project
1. Open https://keypads.audio1975.com/new.html and enter the team passcode (remembered on that device).
2. Type the project name, the client's email, and your email (where their changes come back).
3. In the Alisse Google Sheet's Keypads tab, copy the rows (Keypad through Button 9) and paste them in, or add keypads by hand. Tap any keypad to fix it.
4. Click **Make client link**, then **Email to client**.

Nothing per project is stored in this repo. Each project lives in its link, encrypted (AES-GCM, key from PBKDF2 of the client's email), so the link only opens with that email.

## What the client does
Opens the link, enters their email (remembered on that device), taps keypads to rename buttons or change layouts, then **Send changes**, which emails you a new link. Open it with the client's email to see their version. **Download for Google Sheet (CSV)** matches the Keypads tab.

## Files
- `index.html` client view, `app.js` / `app.css` shared.
- `new.html` is a passcode loader: the builder's page is stored encrypted (AES-GCM, PBKDF2 of the team passcode). Its unencrypted source is kept outside this repo; rebuild with `node enc_builder.js <passcode>`.
- A keypad can have its own finish; otherwise it uses the project finish.
- `CNAME` custom domain; DNS is a CNAME `keypads` → `salesaudio1975.github.io` at GoDaddy.
