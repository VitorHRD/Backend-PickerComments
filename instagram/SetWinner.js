require('dotenv').config();
const puppeteer = require('puppeteer');

async function start(url) {
    async function LoadMore(page, selector) {
        const moreButton = await page.$(selector);
        if (moreButton) {
            console.log("more")
            await page.waitForSelector(selector)
            await moreButton.click()
            await page.waitForSelector(selector, { timeout: 3000 }).catch(() => {
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

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.instagram.com/accounts/login/");
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', process.env.EMAIL);
    await page.type('input[name="password"]', process.env.PASSWORD);
    await page.waitForTimeout(5000);

    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);

    await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );
    await page.goto(url);
    await LoadMore(page, 'svg[aria-label="Carregar mais comentários"]');

    const autorComments = await getComments(page, ".C4VMK h3 ");
    const textComments = await getComments(page, ".C4VMK div.MOdxS ");
    const imgComments = await getSrc(page, ".C7I1f img[src]");





    const sorted = sort(autorComments)
    const counted = count(autorComments, textComments, imgComments)
    const winner = counted.find((comment) => { return comment.id == sorted })

    if (winner === undefined) {
        await browser.close()
        return start()
    }
    else {
        await browser.close()
        return winner
    }

}


module.exports = {start}


function sort(array) {
    let length = Math.floor(Math.random() * array.length)

    return length
}

function count(autorArray, commentsArray, autorImg) {
    const count = [];
    let id = 0;
    autorArray.forEach(autor => { count.push({ id: id++, autorImg: autorImg[id], autor: autor, text: commentsArray[id] }) })
    return count
}