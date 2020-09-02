const fs = require('fs').promises;
const readline = require('readline');
const { google } = require('googleapis');
require('dotenv').config();


const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

module.exports = async function portfolio() {
  const content = await fs.readFile('credentials.json');  
  console.info(JSON.parse(content));
  const client = await authorize(JSON.parse(content));  
  const assetAllocation = await update(client);  
  return { assetAllocation: assetAllocation };
}

async function update(authClient) {
  const request = {
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'Portafolio!A2:F10',
    majorDimension: "ROWS",
    auth: authClient
  };

  const sheets = google.sheets('v4');
  const response = await sheets.spreadsheets.values.get(request);
  const rows = response.data.values;
  const assetAllocation = rows.map(row => {
    return { asset: row[1], target: row[4], current: row[3] }
  });
  return assetAllocation;
}   

async function authorize(credentials) {
  console.info('authorizing');
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
  
  const token = await fs.readFile(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(token));
  return oAuth2Client;
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

