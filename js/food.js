numFoods = 20

function postFood() {
    console.log("Post food")
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.thingspeak.com/update')
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.send(getFoodFormData());
    xhr.onreadystatechange = function () {
        console.log("Sent!", xhr.status)
        // if (xhr.readyState === 4 && xhr.status === 200) {
        let responseObj = xhr.response;
        console.log(responseObj)
        // }
    }
};

function convertMilitary(t) {
    if (t.includes("AM") || t.includes("PM")) {
        return false
    } else {
        return true
    }
}

function getFoodFormData() {
    console.log("Form Data")
    let foodDate = document.getElementById("foodDate").value;
    let foodStart = document.getElementById("foodStart").value;
    let foodEnd = document.getElementById("foodEnd").value;
    let food = document.getElementById("food").value;
    let foodNotes = document.getElementById("foodNotes").value;

    let data = {
        "api_key": "U9ZL8N26DQHGB6BK",
        "field2": foodDate,
        "field3": foodStart,
        "field4": foodEnd,
        "field5": food,
        "field6": foodNotes
    }
    urlEncodedDataPairs = []
    for (let x in data) {
        if (data[x].length != 0) {
            urlEncodedDataPairs.push(encodeURIComponent(x) + '=' + encodeURIComponent(data[x]));
        }
    }
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    console.log("urlEncodedData: ", urlEncodedData)

    return urlEncodedData
}

function updateFoodTable() {
    console.log("Update food table")
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.thingspeak.com/channels/1377715/feeds.json?results=' + numFoods)
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        let responseObj = xhr.response;
        let arr = responseObj.feeds;

        console.log("ARR", arr.length)

        let tb = document.getElementById("foodTable")

        //Remove all table row on update (redo)
        while (tb.firstChild) {
            tb.removeChild(tb.firstChild);
        }

        //Create header row
        let thead = tb.createTHead()
        let headRow = thead.insertRow()

        //Set header row labels
        let headerLabels = ["Date", "Start Time", "End Time", "Food", "Notes", "PM2.5"]

        for (let h in headerLabels) {
            let th = document.createElement("th")
            let thText = document.createTextNode(headerLabels[h])
            th.appendChild(thText)
            headRow.appendChild(th)
        }

        for (let i = 0; i < arr.length; i++) {
            if (!arr[i]['field2']) {
                continue
            }
            let r = document.createElement("tr")
            //Normal headers
            for (let j = 2; j <= 6; j++) {
                let cell = document.createElement("td")
                cell.innerHTML = arr[i]["field" + j]
                r.appendChild(cell)
            }
            // await getFoodAveragePM25(arr[i]["field2"], arr[i]["field3"], arr[i]["field4"]).then(console.log("HELLO"))
            tb.appendChild(r)
        }

        showPM25()
    }
};

updateFoodTable()

function showPM25() {
    console.log("SHOW PM25")
    var table = document.getElementById("foodTable");
    for (var i = 0, row; row = table.rows[i]; i++) {
        // for (var j = 0, col; col = row.cells[j]; j++) {
        //     console.log(col)
        // }
        // console.log(row.cells[0].innerHTML)
        let avg = getFoodAveragePM25(row.cells[0].innerHTML, row.cells[1].innerHTML, row.cells[2].innerHTML, i)
        // let cell = document.createElement("td")
        // cell.innerHTML = avg
        // row.appendChild()
    }
}

function getFoodAveragePM25(dateString, startString, endString, i=0) {
    //Format: YYYY-MM-DD%20HH:NN:SS.
    return new Promise(function (resolve, reject) {
        let start = dateString.substring(6) + "-" + dateString.substring(0, 5) + "%20" + startString + ":00"
        let end = dateString.substring(6) + "-" + dateString.substring(0, 5) + "%20" + endString + ":00"
        let xhr = new XMLHttpRequest();
        console.log("URL: ", 'https://api.thingspeak.com/channels/1138400/feeds.json?start=' + start + "?end=" + end + "?timezone=America/New_York")
        xhr.open('GET', 'https://api.thingspeak.com/channels/1138400/feeds.json?start=' + start + "?end=" + end + "?timezone=America/New_York")
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = function () {
            console.log("Response:")
            let responseObj = xhr.response;
            console.log(responseObj)
            let arr = responseObj.feeds;
            let nums = responseObj.feeds.map((obj) => parseFloat(obj['field5']));
            let mean = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(3)
            console.log("Mean: ", mean)
            
            var table = document.getElementById("foodTable");
            let cell = document.createElement("td")
            cell.innerHTML=mean
            table.rows[i].appendChild(cell)

            return resolve(mean)
            // return mean
        }
    })
}