# Distributie

I decided to follow to use the vite bundler, because that is a very simple solution
giving a good compact result.

## How to distribute without bundler?

### Question

I have a typescript project which outputs generated javascript in ./out/ folder, has
an html file ./bibber.html and also uses a webpack file at
./node_modules/antlr4/dist/antlr4.web.mjs and does not use any bundle software but
defines in bibber.html :

   <script type="importmap">
{
    "imports": {
         "antlr4": "./node_modules/antlr4/dist/antlr4.web.mjs"
    }
}
</script>

so that you can import from 'antlr4' label instead of this long path.

How can I distribute this the most easily for production without needing a bundler
tool, because I want to keep it simple.

### Answer ChatGPT:

Je kunt je project eenvoudig distribueren zonder een bundler door de volgende stappen
te volgen:

1. **Opschonen en organiseren van output** Maak een `dist/` map aan waarin je alleen
   de bestanden plaatst die nodig zijn voor distributie.

2. **Kopieer de gegenereerde JavaScript-bestanden** Kopieer de inhoud van `./out/`
   naar `./dist/`:

```sh
mkdir -p dist
cp -r out/* dist/
```

3. **Kopieer `bibber.html` naar `dist/`**

```sh
cp bibber.html dist/
```

4. **Kopieer `antlr4.web.mjs` naar `dist/`** Dit zorgt ervoor dat de importmap
   correct blijft werken zonder afhankelijk te zijn van `node_modules`:

```sh
mkdir -p dist/node_modules/antlr4/dist
cp node_modules/antlr4/dist/antlr4.web.mjs dist/node_modules/antlr4/dist/
```

5. **Pas `bibber.html` aan voor distributie** Update de importmap in
   `dist/bibber.html` zodat deze verwijst naar de juiste locatie:

```html
<script type="importmap">
  {
    "imports": {
      "antlr4": "./node_modules/antlr4/dist/antlr4.web.mjs"
    }
  }
</script>
```

6. **Deploy naar een server of als statische bestanden**

- Upload de inhoud van `dist/` naar een statische webserver.

- Als je het lokaal wilt testen, kun je een simpele HTTP-server gebruiken:

```sh
cd dist
python3 -m http.server 8080
```

Open dan `http://localhost:8080/bibber.html` in je browser.

Met deze aanpak blijft je project eenvoudig en heb je geen extra bundling-stap nodig.

## Common practice is using a bundler

### Question

Wat is het alternatief, wat wordt er in de praktijk meestal gedaan?

### answer ChatGPT:

In de praktijk wordt meestal een **bundler** zoals **Vite, Webpack, Rollup of
esbuild** gebruikt. Dit zorgt voor efficiëntere distributie en betere compatibiliteit
met verschillende browsers. Alternatieve methoden zijn:**1. Gebruik van een bundler
(meest gebruikelijk)** Een bundler combineert alle benodigde bestanden in één of
enkele geoptimaliseerde bestanden. Dit vermindert HTTP-verzoeken en versnelt de
laadtijd. **Vite (eenvoudig en snel)** Vite is een moderne bundler die erg snel werkt
en eenvoudig is in te stellen.

- Installeer Vite:

```sh
npm install vite --save-dev
```

- Voeg een `vite.config.js` toe:

```js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "bibber.html",
    },
  },
});
```

- Build je project:

```sh
npx vite build
```

- Dit plaatst alle benodigde bestanden in `dist/`, inclusief een geoptimaliseerde
  versie van `antlr4.web.mjs`.

---

**2. Gebruik van een CDN (geen bundler nodig)** Je kunt `antlr4` ook direct vanuit
een CDN laden, zodat je geen kopieën in je distributie nodig hebt.

- Pas `bibber.html` aan om een CDN-link te gebruiken, bijvoorbeeld:

```html
<script type="importmap">
  {
    "imports": {
      "antlr4": "https://cdn.jsdelivr.net/npm/antlr4@latest/dist/antlr4.web.mjs"
    }
  }
</script>
```

- Dit maakt je distributie eenvoudiger, omdat je geen lokale `node_modules` hoeft te
  kopiëren.

---

**3. Gebruik van een minimalistische bundler zoals esbuild** Als je geen zware tools
zoals Webpack wilt, kun je **esbuild** gebruiken:

- Installeer:

```sh
npm install esbuild --save-dev
```

- Bundel je bestanden:

```sh
npx esbuild out/main.js --bundle --outfile=dist/bundle.js
```

- Update `bibber.html` om `bundle.js` in te laden.

---

**Wat wordt meestal gedaan?** De meeste ontwikkelaars gebruiken **Vite** of
**Webpack** , omdat deze tools automatisch optimalisaties uitvoeren (zoals
tree-shaking en code-splitting). Als je de eenvoudigste aanpak wilt zonder een
bundler, dan is **CDN-gebruik** een goed alternatief.

## Wat is tree-shaking en code-splitting?

### Answer ChatGPT

**1. Wat is Tree-Shaking?** 🌳✨Tree-shaking is een techniek die **ongebruikte code
verwijdert** uit je JavaScript-bestanden tijdens het bundelen. Dit zorgt ervoor dat
alleen de echt gebruikte functies en modules in de uiteindelijke bundel terechtkomen,
waardoor de bestandsgrootte kleiner wordt.**Voorbeeld zonder tree-shaking:**

```js
// utils.js
export function gebruikteFunctie() {
  console.log("Dit wordt gebruikt!");
}

export function ongebruikteFunctie() {
  console.log("Dit wordt niet gebruikt!");
}

// main.js
import { gebruikteFunctie } from "./utils.js";

gebruikteFunctie();
```

👉 Zonder tree-shaking zou de hele `utils.js` worden meegenomen, inclusief
`ongebruikteFunctie()`.Met een bundler zoals **Webpack, Rollup of esbuild** wordt de
ongebruikte functie **automatisch verwijderd** als de bundler ziet dat die nooit
wordt aangeroepen.**Tree-shaking in actie (geoptimaliseerd outputbestand):**

```js
function gebruikteFunctie() {
  console.log("Dit wordt gebruikt!");
}

gebruikteFunctie();
```

🚀 **Voordeel:** Kleinere bundels = Snellere laadtijden!

---

**2. Wat is Code-Splitting?** 🧩📂Code-splitting is een techniek waarbij de bundler
**de code opsplitst in kleinere delen** die pas geladen worden als ze nodig zijn. Dit
voorkomt dat een gebruiker een grote bundel moet downloaden als ze maar een klein
deel van je app gebruiken.**Voorbeeld zonder code-splitting (single bundle, trage
laadtijd):**

```js
import { zwareModule } from "./zwareModule.js";

console.log("App start!");
zwareModule();
```

👉 Hier wordt `zwareModule.js` direct ingeladen, ook als het niet meteen nodig
is.**Voorbeeld met code-splitting (dynamic import, snellere laadtijd):**

```js
console.log("App start!");

document.getElementById("loadFeature").addEventListener("click", async () => {
  const { zwareModule } = await import("./zwareModule.js");
  zwareModule();
});
```

💡 Hier wordt `zwareModule.js` **pas geladen als de gebruiker op een knop drukt** ,
waardoor de eerste laadtijd van de pagina veel sneller is!

---

| **Samenvatting:** | Techniek                                               | Wat doet het?                               | Voordeel |
| ----------------- | ------------------------------------------------------ | ------------------------------------------- | -------- |
| Tree-shaking      | Verwijdert ongebruikte code                            | Kleinere bestanden, snellere laadtijden     |
| Code-splitting    | Splitst code op in kleinere, dynamisch geladen stukken | Minder initiële laadtijd, betere prestaties |

In de praktijk gebruiken moderne bundlers **beide technieken** automatisch als je je
project goed structureert. 🚀
