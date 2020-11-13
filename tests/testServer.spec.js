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

describe('Criar um túnel através do Ngrok', () => {
  it('Será validado se os comandos estão dentro do arquivo instruction.json', async () => {
    const instruction = fs.readFileSync('./instruction.json', 'utf8');
    const instructionJson = JSON.parse(instruction.toString());
    expect(instructionJson.linkSetup).toContain('https://dashboard.ngrok.com/get-started/setup');
    expect(instructionJson.commandExtractNgrok).toContain('unzip /path/to/ngrok.zip');
    expect(instructionJson.commandoToken).toContain('./ngrok authtoken');
    expect(instructionJson.token).not.toBeNull();
    expect(instructionJson.installNgrokPackage).toContain('npm install ngrok');
    expect(instructionJson.commandStart).toContain('ngrok http https://localhost:8080/');
    expect(instructionJson.commandNgrok).toContain('/ngrok http 8080');
  });
});

describe('Configurar uma chamada HTTPS à API `iplocation`', () => {
  it('Será validado que foi configurada a chamada do `iplocation`', async () => {
    const location = fs.readFileSync('./src/location.js', 'utf8');
    const locationString = location.toString();
    expect(locationString).toContain("hostname: 'iplocation.com'");
    expect(locationString).toContain("port: 443");
    expect(locationString).toContain("path: '/'");
    expect(locationString).toContain("method: 'POST'");
    expect(locationString).toContain("'Content-Type': 'application/x-www-form-urlencoded'");
  });
});

describe('Adicionar a estrutura de início de requisição HTTP', () => {
  it('Será validado que foi adicionado a estrutura da requisição no startOfResponse', async () => {
    const location = fs.readFileSync('./src/index.js', 'utf8');
    const locationString = location.toString();
    expect(locationString).toContain("HTTP/1.1 200 OK\\r\\nContent-Type: text/html; charset=UTF-8\\r\\n\\r\\n");
  });
});

describe('Adicionar a estrutura de fim da requisição HTTP', () => {
  it('Será validado que foi adicionado a estrutura da requisição no endOfResponse', async () => {
    const location = fs.readFileSync('./src/index.js', 'utf8');
    const locationString = location.toString();
    expect(locationString).toContain("\\r\\n\\r\\n");
  });
});

describe('Identificar o endereço de IP do client', () => {
  it('Será validado que foi adicionado o código para pegar endereço de IP', async () => {
    const location = fs.readFileSync('./src/index.js', 'utf8');
    const locationString = location.toString();
    expect(locationString).toContain("getHeaderValue(data.toString(), 'X-Forwarded-For');");
  });
});

describe('Configurar a request HTTPS para enviar o endereço IP', () => {
  it('Será validado que foi adicionado a request no arquivo location', async () => {
    const location = fs.readFileSync('./src/location.js', 'utf8');
    const locationString = location.toString();
    expect(locationString).toContain("req.write(`ip=${clientIP}`);");
  });
});








