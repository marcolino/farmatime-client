// Import 'fs' from the Node.js built-in module
import { promises as fs } from 'fs';

// Import dotenv to load environment variables
import dotenv from 'dotenv';

// Load the environment variables from the .env file
dotenv.config();

// Access environment variables
const appName = process.env.APP_NAME || 'DefaultApp';
const environment = process.env.ENVIRONMENT || 'production';

// Define the file path and content
const filePath = './output.txt';
const fileContent = `App Name: ${appName}\nEnvironment: ${environment}`;

// Async function to write to and read from the file using fs
async function writeAndReadFile() {
  try {
    // Write to the file
    await fs.writeFile(filePath, fileContent);
    console.log(`File written successfully at: ${filePath}`);

    // Read the content of the file
    const data = await fs.readFile(filePath, 'utf8');
    console.log('File content:', data);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

// Call the function
writeAndReadFile();
