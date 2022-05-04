require('dotenv').config();
const puppeteer = require('puppeteer');
const setFunctions = require('./SetFunctions')

async function start(url) {
    async function LoadMore(page, selector) {
        const moreButton = await page.$(selector);
        if (moreButton) {
            console.log("more")
            await page.waitForSelector(selector)
            await moreButton.click()
            await page.waitForSelector(selector, { timeout: 5000 }).catch(() => {
                console.log("timeout")
            })
            await LoadMore(page, selector);
        }
    }

    async function getComments(page, selector) {
        const comments = await page.$$eval(selector, (links) =>
            links.map((link) => link.innerText)
        );
        return comments;
    }
    async function getSrc(page, selector) {
        const comments = await page.$$eval(selector, (imgs) =>
            imgs.map((img) => img.getAttribute('src'))
        );
        return comments;
    }

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
      });
    const page = await browser.newPage();
    await page.goto("https://www.instagram.com/accounts/login/");
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', process.env.EMAIL);
    await page.type('input[name="password"]', process.env.PASSWORD);
    await page.waitForTimeout(3000);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );
    await page.goto(url);
    await LoadMore(page, 'svg[aria-label="Carregar mais comentários"]');

    const autorComments = await getComments(page, ".C4VMK h3 ");
    const textComments = await getComments(page, ".C4VMK div.MOdxS ");
    const imgComments = await getSrc(page, ".C7I1f img[src]");





    const sorted = setFunctions.sort(autorComments)
    const counted = setFunctions.count(autorComments, textComments, imgComments)
    const winner = counted.find((comment) => { return comment.id == sorted })

    if (winner === undefined) {
        await browser.close()
        return start(url)
    }
    else {
        await browser.close()
        return winner
    }

}


module.exports = {start}

