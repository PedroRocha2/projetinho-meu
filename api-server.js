const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Middleware de parser de corpo JSON

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Permitir todas as origens
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Métodos permitidos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Cabeçalhos permitidos
  next();
});

app.put("/scrape", async (req, res) => {
  let linkParaOScrappe = req.body.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let leads = [];

  try {
    await page.goto(linkParaOScrappe);
    await page.waitForSelector("div .MjjYud");

    const titulos = await page.evaluate(() => {
      const empresas = Array.from(document.querySelectorAll("div .yuRUbf h3"));
      return empresas.map((el) => el.textContent);
    });

    console.log(titulos);

    const linksEmpresas = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("div .yuRUbf a"));
      return links.map((el) => el.getAttribute("href"));
    });
    console.log(linksEmpresas);

    const setores = await page.evaluate(() => {
      const setores = Array.from(document.querySelectorAll("div .VwiC3b span"));
      return setores.map((el) => el.textContent);
    });

    console.log(setores);

    // Criar objetos e adicionar ao array leads
    for (let i = 0; i < titulos.length; i++) {
      const lead = {
        titulo: titulos[i],
        link: linksEmpresas[i],
        setor: setores[i],
      };
      leads.push(lead);
    }

    res.json(leads);
  } catch (error) {
    console.error("Erro durante o web scraping:", error);
    res.status(500).json({ error: "Erro durante o web scraping" });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`API está rodando em http://localhost:${port}`);
});
