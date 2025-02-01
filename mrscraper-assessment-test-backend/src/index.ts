import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Aktifkan CORS

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to scrape product details
async function scrapeProductDetails(url: any) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const htmlContent = await page.content();
        await browser.close();

        const prompt = `Extract product name, price, and description from this HTML: ${htmlContent}`;
        await new Promise(resolve => setTimeout(resolve, 1500));

        const result = await model.generateContent(prompt);
        return result.response.text() || "-";
    } catch (error) {
        console.error("Gemini API Error:", (error as Error).message);
        return "-";
    }
}

// API Endpoint for scraping eBay products
app.post("/scrape", async (req, res) => {
    try {
        const { keyword = "nike", pageNumber = 1 } = req.body;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        const url = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${keyword}&_sacat=0&rt=nc&_pgn=${pageNumber}`;
        await page.goto(url, { waitUntil: "domcontentloaded" });

        const products = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".s-item"))
                .map(item => ({
                    name: (item.querySelector(".s-item__title") as HTMLElement)?.innerText || "-",
                    price: (item.querySelector(".s-item__price") as HTMLElement)?.innerText || "-",
                    link: (item.querySelector(".s-item__link") as HTMLAnchorElement)?.href || "-",
                    description: "-"
                }));
        });

        for (let i = 0; i < Math.min(products.length, 5); i++) {
            if (products[i].link !== "-") {
                products[i].description = await scrapeProductDetails(products[i].link);
            }
        }

        await browser.close();
        res.json({ status: "success", data: products });
    } catch (error) {
        console.error("Scraping error:", (error as Error).message);
        res.status(500).json({ status: "error", message: "Failed to scrape data" });
    }
});

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
