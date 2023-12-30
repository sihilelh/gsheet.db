# Google Sheets Wrapper

This is a simple Node.js wrapper for interacting with Google Sheets using the provided `Sheet` class. It allows you to perform common operations such as retrieving all data or getting data based on specific conditions.

## Setup

1. Set the general access to "Anyone with this link" to view your Google Sheets document.
2. Find this setting inside the Google Sheets share button located in the top right corner.
3. The sheet name is the name displayed in the bottom left corner.

## Usage
```
const Sheet = require("./index");

// Set up the Google Sheets API
let dataSheet = new Sheet(
  "https://docs.google.com/spreadsheets/d/1LHAmQxTAHQ-nJP63SM0M0hPMte8zA6A4B5oga880yJA/edit?usp=sharing",
  "table_1"
);

// Retrieve all data
function getAllData() {
  dataSheet.all().then((dataset) => {
    console.log(dataset);
  });
}

// Get data based on a condition
function get() {
  dataSheet
    .get(
      {
        weight: 180, // means = 180
        weight: {
          "<": 180, // means less than 180
        },
      },
      true // combine all where conditions; otherwise, results will be returned separately
    )
    .then((result) => console.log(result));
}

// Reload data (call this function if the data is updated)
dataSheet.reload();

// Example usage
getAllData();
get();
```


### Installation

Make sure to install the required dependencies using:

```bash
npm install sheet.db
```
2023 ~ Sihilel H