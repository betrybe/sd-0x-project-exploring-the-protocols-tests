const fs = require('fs');
const puppeteer = require('puppeteer');
var execTerminal = require('child_process').exec, child;
var spawn = require('child_process').spawn;

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

describe('Responder o IP do client', () => {

    let browser;
    let page;
    const instructions = fs.readFileSync('./instruction.json', 'utf8');
    const instructionsString = JSON.parse(instructions.toString());
   // let execToken = execTerminal(`./ngrok authtoken ${instructionsString.token}`);
   // let execNgrok = execTerminal('./ngrok http 8080');
   // let execNode = execTerminal('node src/index.js');



   var execToken = spawn('./ngrok', [`authtoken ${instructionsString.token}`], {detached: true});
   var execNgrok = spawn('./ngrok', ['http', '8080'], {detached: true});
   var execNode = spawn('node', ['src/index.js'], {detached: true});

    beforeEach(async () => {
      browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1920,1080'], headless: true });
      page = await browser.newPage();
    });
  
    afterEach(async () => {
        process.kill(-execToken.pid);
      //execToken.kill();
      sleep(20000)

      process.kill(-execNode.pid);
      //execNode.kill();
      sleep(20000)
      process.kill(-execNgrok.pid);
      //execNgrok.kill();
      sleep(20000)
    });
  
    it('Será validado que ao acessar a url sera possível visualizar o ip do client', async () => {
  
      
      execToken.stdout.on('data', ()=>{ });
      sleep(20000)
      
      execNgrok.stdout.on('data', ()=>{ });
      sleep(20000)
      
      execNode.stdout.on('data', ()=>{ });
      sleep(20000)
      await page.goto(BASE_URL);
      sleep(20000)
      await page.waitForSelector('a[target="_blank"]');
      const url =  await page.$$eval('a[target="_blank"]', (nodes) => nodes.map((n) => n.innerText));
      console.log(url)
      newPage = await browser.newPage();
  
      console.log(url[1]);
      newPage.goto(url[1]);
      console.log(url[1]);
      sleep(20000)
      await newPage.waitForSelector(dataTestid('ip'));
  
      const textIp = await newPage.$$eval(dataTestid('ip'), (nodes) => nodes.map((n) => n.innerText));
      expect(textIp).not.toBeNull();
    });
  });