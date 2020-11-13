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

describe('Responder o IP do client', () => {
    let browser;
    let page;
    const instructions = fs.readFileSync('./instruction.json', 'utf8');
    const instructionsString = JSON.parse(instructions.toString());
    let url2 = '';


    var execNode = execTerminal('node src/index.js');

    beforeEach(async () => {
        await ngrok.authtoken(instructionsString.token);
     url2 = await ngrok.connect(8080);
      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
      page = await browser.newPage();
    });
  
    afterEach(async () => {
      await ngrok.disconnect(url2); // stops one
      await ngrok.disconnect(); // stops all
      await ngrok.kill(); 
    });

    it('Será validado que ao acessar a url sera possível visualizar o ip do client', async () => {  
      execNode.stdout.on('data', ()=>{ });
  
      wait(2000);
      await page.goto(BASE_URL);
      wait(2000);
  
      await page.waitForSelector('a[target="_blank"]');
      const url =  await page.$$eval('a[target="_blank"]', (nodes) => nodes.map((n) => n.innerText));
  
      newPage = await browser.newPage();
  
      newPage.goto(url[1]);
      await newPage.waitForSelector(dataTestid('ip'));
  
      const textIp = await newPage.$$eval(dataTestid('ip'), (nodes) => nodes.map((n) => n.innerText));
      expect(textIp).not.toBeNull();
    });
  });