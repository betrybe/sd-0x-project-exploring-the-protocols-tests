const ngrok = require('ngrok');
const fs = require('fs');
const puppeteer = require('puppeteer');
var execTerminal = require('child_process').exec, child;

const BASE_URL = 'http://localhost:4040/inspect/http';

function dataTestid(name) {
  return `[data-testid=${name}]`;
}

function wait(time) {
    const start = Date.now();
    while (true) {
      if (Date.now() - start >= time) {
        return true;
      }
    }
  }

  function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }


  describe('Responder informações extraídas através do IP do client', () => {
  
    it('Será validado que as informações da localização do cliente serão exibidas na tela', async () => { 
        const instructions = fs.readFileSync('./instruction.json', 'utf8');
        const instructionsString = JSON.parse(instructions.toString());

        await ngrok.authtoken(instructionsString.token);
        const url2 = await ngrok.connect(8080);
       browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
       page = await browser.newPage();
    
        var execNode = execTerminal('node src/index.js');
      execNode.stdout.on('data', ()=>{ });
      sleep(20000)
      await page.goto(BASE_URL);
      sleep(20000)
      await page.waitForSelector('a[target="_blank"]');
      const url =  await page.$$eval('a[target="_blank"]', (nodes) => nodes.map((n) => n.innerText));
      console.log(url)
      newPage = await browser.newPage();
      sleep(20000)
      console.log(url[1]);
      newPage.goto(url[1]);
      console.log(url[1]);
      sleep(20000)
      await newPage.waitForSelector(dataTestid('city'));
      const textCity = await newPage.$$eval(dataTestid('city'), (nodes) => nodes.map((n) => n.innerText));
      await newPage.waitForSelector(dataTestid('postal_code'));
      const textPostaCode = await newPage.$$eval(dataTestid('postal_code'), (nodes) => nodes.map((n) => n.innerText));
      await newPage.waitForSelector(dataTestid('region'));
      const textRegion = await newPage.$$eval(dataTestid('region'), (nodes) => nodes.map((n) => n.innerText));
      await newPage.waitForSelector(dataTestid('country'));
      const textCountry = await newPage.$$eval(dataTestid('country'), (nodes) => nodes.map((n) => n.innerText));
      await newPage.waitForSelector(dataTestid('company'));
      const textCompany = await newPage.$$eval(dataTestid('company'), (nodes) => nodes.map((n) => n.innerText));
  
      expect(textCity).not.toBeNull();
      expect(textPostaCode).not.toBeNull();
      expect(textRegion).not.toBeNull();
      expect(textCountry).not.toBeNull();
      expect(textCompany).not.toBeNull();

      await ngrok.disconnect(url2); // stops one
      await ngrok.disconnect(); // stops all
      await ngrok.kill(); 
      execNode.kill();
    });
  });