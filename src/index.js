const postJson = {
    query: [
      {
        code: "Vuosi",
        selection: {
          filter: "item",
          values: [
            "2000",
            "2001",
            "2002",
            "2003",
            "2004",
            "2005",
            "2006",
            "2007",
            "2008",
            "2009",
            "2010",
            "2011",
            "2012",
            "2013",
            "2014",
            "2015",
            "2016",
            "2017",
            "2018",
            "2019",
            "2020",
            "2021"
          ]
        }
      },
      {
        code: "Alue",
        selection: {
          filter: "item",
          values: ["SSS"]
        }
      },
      {
        code: "Tiedot",
        selection: {
          filter: "item",
          values: ["vaesto"]
        }
      }
    ],
    response: {
      format: "json-stat2"
    }
  };
  
  async function fetchData(post, pass) {
    const code =
      "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const resolve = await fetch(code);
    const file = await resolve.json();
    const url =
      "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const promise = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(post)
    });
    if (!promise.ok) {
      return alert("err when fetch");
    }
    let submit = document.getElementById("submit-data");
    submit.onclick = () => {
      let city = document.getElementById("input-area").value;
      flush(city, file);
      return false;
    };
    processData(await promise.json(), pass);
  }
  
  function processData(data, predict) {
    let anul = Object.values(data.dimension.Vuosi.category.label);
    let value = data.value;
    let mgri = [{ values: [] }];
    for (let i = 0; i < value.length; ++i) {
      mgri[0]["values"].push(value[i]);
    }
    if (predict) {
      let res = 0;
      for (let i = 0; i < value.length - 1; ++i) {
        res += value[i + 1] - value[i];
      }
      res = res / (value.length - 1) - 1;
      anul.push("2022");
      value.push(parseInt(value[value.length - 1] + res));
      mgri[0]["values"].push(value[value.length - 1]);
    }
    buildChart(anul, mgri);
  }
  
  function buildChart(year, mgri) {
    const chartData = {
      labels: year,
      datasets: mgri
    };
    const chart = new frappe.Chart("#chart", {
      title: "population growth",
      data: chartData,
      height: 450,
      type: "line",
      colors: ["#eb5146"]
    });
  }
  
  const flush = async (name, file) => {
    /* Note! You have to fetch the municipalities upon page load */
    
    let names = file.variables[1].valueTexts;
    name = name[0].toUpperCase() + name.substring(1).toLowerCase();
    let target = file.variables[1].values[names.indexOf(name)];
    postJson.query[1].selection.values[0] = target;
    fetchData(postJson, false);
    return false;
  };
  
  let predict = document.getElementById("add-data");
  predict.onclick = () => {
    fetchData(postJson, true);
  };

  try {
    fetchData(postJson, false);
  } catch (err) {
    alert(err);
  }
  