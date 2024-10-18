import { writeFile } from 'fs/promises';
import { load } from 'cheerio';

const urls = [
  'https://satisfactory.wiki.gg/wiki/Template:DocsBuildings.json?action=edit',
  'https://satisfactory.wiki.gg/wiki/Template:DocsItems.json?action=edit',
  'https://satisfactory.wiki.gg/wiki/Template:DocsRecipes.json?action=edit',
];

const fileNames = [
  'DocsBuildings.json',
  'DocsItems.json',
  'DocsRecipes.json',
];

async function fetchAndSaveContent(url, fileName) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);
    const content = $('#wpTextbox1').val();

    if (content) {
      // Write the content to a file in ./static/data
      await writeFile(`./src/lib/data/${fileName}`, content);
      console.log(`Saved ${fileName} successfully!`);
    } else {
      console.error(`Failed to extract content from ${url}`);
    }
  } catch (error) {
    console.error(`Error fetching or saving ${fileName}:`, error);
  }
}

async function fetchAll() {
  await Promise.all(urls.map((url, index) => fetchAndSaveContent(url, fileNames[index])));
}

fetchAll();
