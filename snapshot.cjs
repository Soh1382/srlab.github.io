const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  console.log("Navigating to local dev server...");
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2' });
  
  console.log("Scrolling down...");
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  // wait for linkedin script to render
  await new Promise(r => setTimeout(r, 2000)); 

  console.log("Taking screenshot...");
  await page.screenshot({ path: 'linkedin_test.png', fullPage: true });

  const hasLIRenderAll = await page.evaluate(() => typeof window.LIRenderAll);
  const hasIN = await page.evaluate(() => typeof window.IN !== 'undefined' && typeof window.IN.parse);
  console.log("hasLIRenderAll:", hasLIRenderAll, "hasIN:", hasIN);
  
  if (hasLIRenderAll === 'function') {
      console.log("Calling LIRenderAll directly from Puppeteer...");
      await page.evaluate(() => window.LIRenderAll());
      await new Promise(r => setTimeout(r, 1000));
  }

  const iframeHtml = await page.evaluate(() => {
      const iframe = document.querySelector('iframe');
      return iframe ? iframe.outerHTML : "No iframe found";
  });
  console.log("Iframe HTML:", iframeHtml);

  await browser.close();
})();
