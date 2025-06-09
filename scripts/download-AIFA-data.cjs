//#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

// URLs of the CSV files
const urls = {
  confezioni: 'https://drive.aifa.gov.it/farmaci/confezioni.csv',
  pa_confezioni: 'https://drive.aifa.gov.it/farmaci/PA_confezioni.csv',
  atc: 'https://drive.aifa.gov.it/farmaci/atc.csv'
};


// Function to download a data file in memory
function downloadData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.setEncoding('utf8'); // ensures we're working with strings
      response.on('data', (chunk) => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to parse CSV
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = lines[0].split(';').map(h => h.trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(';').map(v => v.trim());
    const entry = {};
    headers.forEach((header, index) => {
      entry[header] = values[index] || '';
    });
    result.push(entry);
  }
  
  return result;
}

// Main function
async function main() {
  
  // Output file path
  const outputFile = './src/data/AIFA.js';

  try {
    // Download and process each data file
    const confezioniContent = await downloadData(urls.confezioni);
    const paConfezioniContent = await downloadData(urls.pa_confezioni);
    const atcContent = await downloadData(urls.atc);

    const confezioniData = parseCSV(confezioniContent);
    const paConfezioniData = parseCSV(paConfezioniContent);
    const atcData = parseCSV(atcContent);
    
    // Process anagrafica data
    const Anagrafica = confezioniData
      .reduce((acc, item) => {
        // Check if name already exists in accumulator
        if (!acc.some(x => x.denominazione === item.denominazione)) {
          acc.push(item);
        }
        return acc;
      }, [])
      .map(item => ({
        id: item.codice_aic,
        name: item.denominazione,
        //holder: item.ragione_sociale,
        form: item.forma,
        //atcCode: item.codice_atc
      }))
    ;
    
    // Process principi attivi data
    const PrincipiAttivi = paConfezioniData
      .reduce((acc, item) => {
        // Check if name already exists in accumulator
        if (!acc.some(x => x.principio_attivo === item.principio_attivo)) {
          acc.push(item);
        }
        return acc;
      }, [])
      .map((item, index) => ({
        id: `PA${String(index + 1).padStart(3, '0')}`,
        name: item.principio_attivo,
        description: `\
${item.quantita ? item.quantita : ''}\
${(item.quantita && item.unita_misura) ? ' ' : ''}\
${item.unita_misura ? item.unita_misura : ''}\
`
      }))
    ;
    
    // Process ATC data
    const ATC = atcData
       .reduce((acc, item) => {
        // Check if name already exists in accumulator
        if (!acc.some(x => x.descrizione === item.descrizione)) {
          acc.push(item);
        }
        return acc;
      }, [])
      .map(item => ({
        code: item.codice_atc,
        description: item.descrizione,
        //level: getATCLevelDescription(item.codice_atc)
      }))
    ;
    
    // Generate the output file
    const output = `// Auto-generated  data from AIFA sources
export const dataAnagrafica = [
${jsonStringifyArrayCustom(Anagrafica)}
];

export const dataPrincipiAttivi = [
${jsonStringifyArrayCustom(PrincipiAttivi)}
];

export const dataATC = [
${jsonStringifyArrayCustom(ATC)}
];
`;
    
    fs.writeFileSync(outputFile, output);

    console.log(`Data processing complete. Output saved to const ${outputFile}`); 
  } catch (error) {
    console.error('Error:', error);
  }
}

// Helper function to stringify array of objects in a custom way
const jsonStringifyArrayCustom = (arr) => {
  return arr.map(obj => JSON.stringify(obj)).join(',\n');
}

// Helper function to determine ATC level
function getATCLevelDescription(atcCode) {
  switch (atcCode?.length) {
    case 1: return 'Anatomico';
    case 3: return 'Terapeutico';
    case 4: return 'Farmacologico';
    case 5: return 'Chimico';
    case 7: return 'Principio attivo';
    default: return 'Unknown';
  }
}

main();
