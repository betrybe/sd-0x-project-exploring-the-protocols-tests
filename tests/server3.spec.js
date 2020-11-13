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

  describe('Responder dados do dispositivo (client)', () => {
    let browser;
    let page;
    const instructions = fs.readFileSync('./instruction.json', 'utf8');
    const instructionsString = JSON.parse(instructions.toString());
     
    await ngrok.authtoken(instructionsString.token);
    const url2 = await ngrok.connect(8080);

    var execNode = execTerminal('node src/index.js');

    beforeEach(async () => {
      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
      page = await browser.newPage();
    });
  
    afterEach(async () => {
      await ngrok.disconnect(url2); // stops one
      await ngrok.disconnect(); // stops all
      await ngrok.kill(); 
    });

    it('Será validado se que ao acessar a tela listou os dados do dispositivo', async () => {
      execNode.stdout.on('data', ()=>{ });
      sleep(20000)
      await page.goto(BASE_URL);
      sleep(20000)
  
      await page.waitForSelector('a[target="_blank"]');
      sleep(20000)
      const url =  await page.$$eval('a[target="_blank"]', (nodes) => nodes.map((n) => n.innerText));
      sleep(20000)
      newPage = await browser.newPage();
      sleep(20000)
      console.log(url[1]);
      newPage.goto(url[1]);
      console.log(url[1]);
      sleep(20000)
      await newPage.waitForSelector(dataTestid('device'));
      const deviceText = await newPage.$$eval(dataTestid('device'), (nodes) => nodes.map((n) => n.innerText));
  
      expect(deviceText).not.toBeNull();
    });
  });