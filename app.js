const puppeteer = require("puppeteer");
const fs = require('fs');
async function main() {
    var output = [];
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        // if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font') {
        //     req.abort();
        // } else {
            req.continue();
        //}
    });

    page.setUserAgent("Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3571.0 Mobile Safari/537.36");
    await page.goto(`https://store.steampowered.com/stats/`);
    const elem = "#detailStats";
    await page.waitForSelector(elem, {
        timeout: 2000
    });
    await page.click('#detailLink');
    const collection = await page.$eval(elem, topList => topList.innerText);
    console.log(collection);
    fs.writeFile("output.csv", collection, (err) => {
        if(err) throw new Error(err);
    });

    //get graph
    const canvas = await page.$(".flot-overlay");
    //await page.waitForSelector(image);
    // image.screenshot({
    //     path: 'graph.png',
    //     omitBackground: true
    // });
    var IMAGE_PREFIX = 'data:image/png;base64,';
    var image = canvas.toDataURL('image/png').substring(IMAGE_PREFIX.length);
    console.log(image);
    await browser.close();
}

main();