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

describe('Responder a request com os resources do Server', () => {
    it('Validar se acessar o site vai listar as informações do sistema', async () => {
      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
      page = await browser.newPage();
  
      const instructions = fs.readFileSync('./instruction.json', 'utf8');
      const instructionsString = JSON.parse(instructions.toString());
      var execToken = execTerminal(`./ngrok authtoken ${instructionsString.token}`);
      execToken.stdout.on('data', ()=>{ });
  
      var execNgrok = execTerminal('./ngrok http 8080');
      execNgrok.stdout.on('data', ()=>{ });
  
      var execNode = execTerminal('node src/index.js');
      execNode.stdout.on('data', ()=>{ });

      await page.goto(BASE_URL);
      wait(2000);
  
      await page.waitForSelector('a[target="_blank"]');
      const url =  await page.$$eval('a[target="_blank"]', (nodes) => nodes.map((n) => n.innerText));
  
      newPage = await browser.newPage();
  
      newPage.goto(url[1]);
      await newPage.waitForSelector(dataTestid('arch'));
      const textArch = await newPage.$$eval(dataTestid('arch'), (nodes) => nodes.map((n) => n.innerText));
      await newPage.waitForSelector(dataTestid('cpu'));
      const textCpu = await newPage.$$eval(dataTestid('cpu'), (nodes) => nodes.map((n) => n.innerText));
      await newPage.waitForSelector(dataTestid('memory'));
      const textMemory = await newPage.$$eval(dataTestid('memory'), (nodes) => nodes.map((n) => n.innerText));
  
      expect(textArch).not.toBeNull();
      expect(textCpu).not.toBeNull();
      expect(textMemory).not.toBeNull();
  
      execToken.kill();
      wait(2000);
      execNgrok.kill();
      wait(2000);
      execNode.kill();
      wait(2000);
    });
  });