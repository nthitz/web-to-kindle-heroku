
import express from 'express'
import path from 'path'
import puppeteer from 'puppeteer'
import fs from 'fs'
import {execFile} from 'child_process'
import fetch from 'node-fetch'
import defaultServerPort from './frontend/src/defaultServerPort.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || defaultServerPort
const HOST = process.env.HOST || 'localhost'

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/snapshot', async (req, res) => {
    const browser = await puppeteer.launch({  args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800 });
    await page.goto(`http://${HOST}:${PORT}/`);
    // await page.waitForNavigation({ waitUntil: 'networkidle2' });
    await page.waitForTimeout(5000);
    await page.screenshot({
      path: '/tmp/screenshot.png',
    });

    await browser.close();

    await convert('/tmp/screenshot.png');
    screenshot = fs.readFileSync('/tmp/screenshot.png');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': screenshot.length,
    });
    return res.end(screenshot);
  })
  .get('/cors', async (req, res) => {
    // check something here to ensure that the request is coming from the frontend

    // send cors headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');


    // process url query and fetch data bypassing cors
    const url = req.query.url;
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        res.send(data);
      }
    );
  })
  .use('/', express.static(path.join(__dirname, 'frontend/build')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


function convert(filename) {
  return new Promise((resolve, reject) => {
    const args = [filename, '-gravity', 'center', '-extent', '600x800', '-colorspace', 'gray', '-depth', '8', filename];
    execFile('convert', args, (error, stdout, stderr) => {
      if (error) {
        console.error({ error, stdout, stderr });
        reject();
      } else {
        resolve();
      }
    });
  });
}
