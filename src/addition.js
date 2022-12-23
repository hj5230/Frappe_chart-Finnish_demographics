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
          values: ["vm01", "vm11"]
        }
      }
    ],
    response: {
      format: "json-stat2"
    }
  };

async function fetchData() {
    const url = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px";
    const promise = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(postJson)
    });
    if (!promise.ok) {
        return alert("err when fetch");
    }
    let data = await promise.json();
    let brth = [], deth = [], value = [{name: "birth",values: []}, {name: "death", values: []}];
    let year = Object.values(data.dimension.Vuosi.category.label);
    for(let i in data.value) {
        if(i % 2 == 0) brth.push(data.value[i]);
        else deth.push(data.value[i]);
    }
    for(let i = 0, len = year.length; i < len; ++i) {
        value[0]['values'].push(brth[i]);
        value[1]['values'].push(deth[i]);
    }
    const collection = {
        labels: year,
        datasets: value,
    }
    new frappe.Chart("#chart", {
        data: collection,
        type: 'bar',
        height: 450,
        colors: ['#363636'],
    });
}

fetchData();