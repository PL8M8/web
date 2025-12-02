import puppeteer from 'puppeteer';

const scrapeCars = async (req, res) => {
    const url = 'https://atlanta.craigslist.org/search/cta';
    const cars = [];

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Wait for listings to load
        await page.waitForSelector('ol');

        // Scrape the data
        const listings = await page.evaluate(() => {
            const results = [];
            const items = document.querySelectorAll('ol'); // Updated selector

            items.forEach(item => {
                const title = item.querySelector('.posting-title .label')?.innerText || ''; // Updated title selector
                const price = item.querySelector('.priceinfo')?.innerText || ''; // Updated price selector
                const location = item.querySelector('.meta')?.innerText.split('·')[2]?.trim() || ''; // Extract location from meta
                const link = item.querySelector('a.main')?.href || ''; // Updated link selector
                const image = item.querySelector('img')?.src || 'https://via.placeholder.com/250x150?text=No+Image'; // Updated image selector

                // Ensure the item has a title or price to avoid empty entries
                if (title && price) {
                    results.push({ title, price, location, link, image });
                }
            });

            return results;
        });

        await browser.close();

        cars.push(...listings);
        console.log('Cars:', cars);
        res.status(200).json(cars);
    } catch (error) {
        console.error('Failed to fetch car listings:', error);
        res.status(500).json({ error: 'Failed to fetch car listings' });
    }
};

export default scrapeCars;
