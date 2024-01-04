class Sheet {
  sheet = null;
  doc_id = null;
  _dataset = [];
  _isloading = false;
  /**
   *
   * @param {String} doc_id Document ID or URL of the Google Sheet
   * @param {String} sheet Sheet Name
   */
  constructor(doc_id, sheet) {
    if (doc_id.includes("http")) {
      this.doc_id = doc_id.split(`/`)[5];
    } else {
      this.doc_id = doc_id;
    }
    this.sheet = sheet;
    this.reload();
  }
  async all() {
    while (this._isloading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return this._dataset;
  }
  /**
   *
   * @param {Object} where Search by column name
   * @param {Boolean} combine Combine all results
   */
  async get(where = {}, combine = false) {
    while (this._isloading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    let dt = this._dataset;
    let whereKeys = Object.keys(where);
    let data = {};
    for (let i = 0; i < whereKeys.length; i++) {
      let thisFilData = [];
      const key = whereKeys[i];
      if (typeof where[key] === "object") {
        let opKeys = Object.keys(where[key]);
        if (opKeys.length > 2)
          throw Error("Condition error. Can not be filtered with more than");
        let cond_letterset = opKeys.join(" ");
        if (cond_letterset === ">") {
          // grater than function
          thisFilData = dt.filter((v) => {
            return v[key] > where[key][opKeys[0]];
          });
        }
        if (cond_letterset === "<") {
          //less than function
          thisFilData = dt.filter((v) => {
            return v[key] < where[key][opKeys[0]];
          });
        }
        if (cond_letterset === "<=") {
          // less than or equal function
          thisFilData = dt.filter((v) => {
            return v[key] <= where[key][opKeys[0]];
          });
        }
        if (cond_letterset === ">=") {
          // grater than or equal function
          thisFilData = dt.filter((v) => {
            return v[key] >= where[key][opKeys[0]];
          });
        }
        if (cond_letterset === "<= >" || cond_letterset === "> <=") {
          // between
          let gTe = where[key]["<="];
          let lT = where[key][">"];
          thisFilData = dt.filter((v) => {
            return v[key] <= gTe && v[key] > lT;
          });
        }
        if (cond_letterset === "< >=" || cond_letterset === ">= <") {
          // between
          let gT = where[key]["<"];
          let lTe = where[key][">="];
          thisFilData = dt.filter((v) => {
            return v[key] < gT && v[key] >= lTe;
          });
        }
        if (cond_letterset === "< >" || cond_letterset === "> <") {
          // between
          let gT = where[key]["<"];
          let lT = where[key][">"];
          thisFilData = dt.filter((v) => {
            return v[key] < gT && v[key] > lT;
          });
        }
        if (cond_letterset === "<= >=" || cond_letterset === ">= <=") {
          // between
          let gTe = where[key]["<="];
          let lTe = where[key][">="];
          thisFilData = dt.filter((v) => {
            return v[key] <= gTe && v[key] >= lTe;
          });
        }
      } else {
        thisFilData = dt.filter((v) => {
          return v[key] == where[key];
        });
      }
      data[key] = thisFilData;
    }
    if (combine) {
      let stdt = [];
      for (let key in data) {
        data[key].forEach((v) => {
          stdt.push(JSON.stringify(v));
        });
      }
      let uniqueSet = new Set(stdt);
      let retDt = [];
      uniqueSet.forEach((v) => {
        retDt.push(JSON.parse(v));
      });
      return retDt;
    } else {
      return data;
    }
  }
  reload() {
    this._isloading = true;
    fetch(
      `https://docs.google.com/spreadsheets/d/${this.doc_id}/gviz/tq?tqx=out:csv&sheet=${this.sheet}`
    ).then(async (response) => {
      const csv = await response.text();
      const data = [];
      const lines = csv.split("\n");
      const header = lines.shift().split(",");
      lines.forEach((line) => {
        const row = line.substring(1).slice(0, -1).split(`","`);
        if (row.length === header.length) {
          const rowData = {};
          header.forEach((key, index) => {
            rowData[`${key}`.replace(/"/g, "")] = `${row[index]}`.replace(
              /"/g,
              ""
            );
          });
          data.push(rowData);
        }
      });
      this._dataset = data;
      this._isloading = false;
    });
  }
}

module.exports = Sheet;
