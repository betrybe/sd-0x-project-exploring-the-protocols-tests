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

  describe('Responder dados do dispositivo (client)', () => {
    it('Será validado se que ao acessar a tela listou os dados do dispositivo', async () => {
      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
      page = await browser.newPage();
  
      const instructions = fs.readFileSync('./instruction.json', 'utf8');
      const instructionsString = JSON.parse(instructions.toString());
      var execToken = execTerminal(`./ngrok authtoken ${instructionsString.token}`);
      execToken.stdout.on('data', ()=>{ });
  
      var execNgrok = execTerminal('./ngrok http 8080 --log="stdout"');
      execNgrok.stdout.on('data', ()=>{ });
  
      var execNode = execTerminal('node src/index.js');
      execNode.stdout.on('data', ()=>{ });
  
      await page.goto(BASE_URL);
      wait(2000);
  
      await page.waitForSelector('a[target="_blank"]');
      const url =  await page.$$eval('a[target="_blank"]', (nodes) => nodes.map((n) => n.innerText));
  
      newPage = await browser.newPage();
  
      console.log(url[1]);
      newPage.goto(url[1]);
      console.log(url[1]);
      await newPage.waitForSelector(dataTestid('device'));
      const deviceText = await newPage.$$eval(dataTestid('device'), (nodes) => nodes.map((n) => n.innerText));
  
      expect(deviceText).not.toBeNull();
  
      execToken.kill();
      wait(2000);
      execNgrok.kill();
      wait(2000);
      execNode.kill();
      wait(2000);
    });
  });