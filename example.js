const Sheet = require("./index");

/**
 * First of all set the generel access (Anyone with this link) to view .
 * You can find that setting inside google sheets share button which is located in top right coner
 * Sheet name is the name that displayed on bottom left coner.
 */

let dataSheet = new Sheet(
  "https://docs.google.com/spreadsheets/d/1LHAmQxTAHQ-nJP63SM0M0hPMte8zA6A4B5oga880yJA/edit?usp=sharing",
  "table_1"
);

function getAllData() {
  dataSheet.all().then((dataset) => {
    console.log(dataset);
  });
}

// get data based on a condition
function get() {
  dataSheet
    .get(
      {
        weight: 180, // means = 180
        weight: {
          "<": 180, // means less than 180
        },
      },
      true // combine all where conditons. otherwise results will return seperatly
    )
    .then((v) => console.log(v));
  /**
     * Example Result
     * 
     * [
  {
    id: '70',
    team: 'Women',
    country: 'USA',
    name_f: 'Haley',
    name_l: 'Skarupa',
    weight: '140',
    height: "5'6",
    dob: '1/3/1994',
    '': ''
  },
  {
    id: '71',
    team: 'Women',
    country: 'USA',
    name_f: 'Lee',
    name_l: 'Stecklein',
    weight: '175',
    height: "6'0",
    dob: '4/23/1994',
    '': ''
  },]
     */
}

get();
