# St. Antony's Church — Hosting & Domain Deployment Guide

This guide describes how to host the St. Antony's Church website completely free of charge and map your custom domain (e.g., `www.stantonyschurchpaganur.in`) using GoDaddy or Hostinger.

---

## ☁️ 1. Free Hosting Options

Because this website is built with clean, modern HTML5, CSS3, and JavaScript, it does not require an active NodeJS/PHP backend server. It can be hosted on globally distributed networks **100% free** with secure HTTPS (SSL) enabled out-of-the-box.

### Option A: Hosting with Vercel (Recommended)
1. Go to [Vercel](https://vercel.com) and sign up for a free Hobby account.
2. Install the **Vercel CLI** via Command Prompt/PowerShell:
   ```bash
   npm install -g vercel
   ```
3. Open a terminal in `d:\SAC Website` and run:
   ```bash
   vercel
   ```
4. Follow the brief command-line prompts (accept defaults). Vercel will upload, optimize, and launch your pages globally, returning a preview URL (e.g. `sac-website.vercel.app`).
5. To deploy changes subsequently to production, run:
   ```bash
   vercel --prod
   ```

### Option B: Hosting with Netlify
1. Go to [Netlify](https://netlify.com) and create a free account.
2. Go to the dashboard, scroll to the **Sites** tab, and find the **"Drag and drop your site folder here"** area.
3. Drag and drop the complete `d:\SAC Website` folder.
4. Netlify will publish your site in seconds and provide a URL (e.g. `your-site.netlify.app`).

---

## 🌐 2. Connecting a Custom Domain (GoDaddy, Hostinger, etc.)

Once your hosting is set up, follow these steps to link your custom domain (e.g. `www.stantonyschurchpaganur.in`):

1. Go to your Hosting Dashboard (Vercel or Netlify) -> **Settings** -> **Domains**.
2. Type in your custom domain name (e.g. `www.stantonyschurchpaganur.in`) and click **Add**.
3. The dashboard will show the exact DNS records you need to update at your domain registrar.
4. Log into your Registrar (GoDaddy, Hostinger, Namecheap, etc.) and open your domain's **DNS Zone Editor**.
5. Update or Add the following records:

| Record Type | Host / Name | Value / Points To | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `cname.vercel-dns.com` (for Vercel) *OR* `your-site.netlify.app` (for Netlify) | Automatic / 1 Hour | Redirects subdomain |
| **A Record** | `@` | `76.76.21.21` (Vercel IP) *OR* Netlify Load Balancer IP | Automatic / 1 Hour | Redirects root domain |

6. Save the records. DNS propagation takes anywhere from 5 minutes to 2 hours. Once resolved, Vercel/Netlify will automatically issue a **Let's Encrypt SSL Security Certificate** (the lock icon next to your URL), encrypting all forms and administration actions securely.

---

## 🌿 3. Managing Git Branches (DEV vs Main)

Your local repository is equipped with a professional two-branch system:
1. **`DEV`**: Use this branch for ongoing modifications, adding elements, testing colors, and styling local cards.
2. **`main`**: The live release branch.

### Deployment Workflow:
1. Complete all feature improvements on the `DEV` branch:
   ```bash
   git checkout DEV
   # Make edits...
   git add .
   git commit -m "Add new updates"
   ```
2. When ready to publish live, checkout `main` and merge your `DEV` branch:
   ```bash
   git checkout main
   git merge DEV
   ```
3. Push to your remote repository (GitHub, GitLab). Platforms like Vercel and Netlify can connect directly to your GitHub repo, automatically rebuilding and updating the live site whenever you push changes to the `main` branch.
