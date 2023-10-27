const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.put("/scrape", async (req, res) => {
  let linkParaOScrappe = req.body.url;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  let leads = [];

  try {
    await page.goto(linkParaOScrappe);

    // Rolar para baixo para carregar mais resultados
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const maxScrolls = 10; // Ajuste esse valor com base no número de rolagens necessárias
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight || maxScrolls <= 0) {
            clearInterval(timer);
            resolve();
          }
          maxScrolls--;
        }, 200); // Ajuste o intervalo se necessário
      });
    });

    // Aguarde o seletor que contém os resultados da pesquisa
    await page.waitForSelector("div .yuRUbf");

    // Restante do  código para raspar os resultados
    const titulos = await page.evaluate(() => {
      const empresas = Array.from(document.querySelectorAll("div .yuRUbf h3"));
      return empresas.map((el) => el.textContent);
    });

    const linksEmpresas = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("div .yuRUbf a"));
      return links.map((el) => el.getAttribute("href"));
    });

    const setores = await page.evaluate(() => {
      const setores = Array.from(document.querySelectorAll("div .VwiC3b span"));
      return setores.map((el) => el.textContent);
    });

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
