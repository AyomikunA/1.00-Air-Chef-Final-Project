function getClosest(n){
    for (let i = 0; i<cities.length;i++){
        if (cities[i]["PM2.5         Wtd AM (ug/m3)"] != "ND") {
            cities[i]["diff"] = Math.abs(cities[i]["PM2.5         Wtd AM (ug/m3)"] - n)
        } else {
            cities[i]["diff"] = Infinity
        }
    }
    let sorted = cities.sort((a, b) => (a.diff > b.diff) ? 1 : -1)
    return sorted.slice(0,7)
}

var form = document.getElementById("comparisonForm");
function handleForm(event) { event.preventDefault(); } 
form.addEventListener('submit', handleForm);

function setCities(){
    let n = document.getElementById("comparisonInput").value
    let topCities = getClosest(n).sort((a, b) => (a["PM2.5         Wtd AM (ug/m3)"] > b["PM2.5         Wtd AM (ug/m3)"]) ? 1 : -1)

    //Select table
    let tb = document.getElementById("outputTable")
    while (tb.firstChild) {
        tb.removeChild(tb.firstChild);
    }

    let thead = tb.createTHead()
    let headRow = thead.insertRow()

    //Set header row labels
    let locHead = document.createElement("th")
    let loc = document.createTextNode("Location");
    locHead.appendChild(loc)
    let pmHead = document.createElement("th")
    let pm = document.createTextNode("Annual PM 2.5");
    pmHead.appendChild(pm)

    headRow.appendChild(locHead)
    headRow.appendChild(pmHead)

    for (let i = 0; i<topCities.length; i++){
        let row = document.createElement("tr")
        let name = document.createElement("td")
        name.innerHTML = topCities[i]["Core Based Statistical Area (CBSA)"]
        let pm25 = document.createElement("td")
        pm25.innerHTML = topCities[i]["PM2.5         Wtd AM (ug/m3)"]
        row.appendChild(name)
        row.appendChild(pm25)
        tb.appendChild(row)
    }    
}