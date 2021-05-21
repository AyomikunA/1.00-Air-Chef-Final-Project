valToField = {
    "1.0": "4",
    "2.5": "5",
    "4.0": "6",
    "10.0": "7",
}

f = "field4"
m = "1440"

function updateField(e){
    console.log("Update field")
    f = valToField[e.value]
    console.log(f)
    updateBigStats()
    updateBigStats(false)
}

function updateMinutes(e){
    console.log("Update minutes")
    m = parseInt(e.value)*60
    console.log(m)
    updateBigStats()
    updateBigStats(false)
}

function updateBigStats(kitchen=true){
    let c = kitchen? '1138400': '1349262'
    let kOrB = kitchen? "K" : "B"
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.thingspeak.com/channels/'+c+'/fields/'+f+'.json?results='+m)
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        let responseObj = xhr.response;
        let arr = responseObj.feeds;

        // Various filters
        let arr25 = arr.filter(x => x['field'+f] >= 25)
        let arr10 = arr.filter(x => x['field'+f] >= 10)
        let arr5 = arr.filter(x => x['field'+f] >= 5)
        let arr2_5 = arr.filter(x => x['field'+f] >= 2.5)

        //Stats
        let nums = responseObj.feeds.map((obj) => parseFloat(obj['field'+f]));
        let mean = (nums.reduce((a, b) => a + b, 0)/nums.length).toFixed(3)
        let max = Math.max(...nums).toFixed(3)
        let min = Math.min(...nums).toFixed(3)

        let maxAtTime = arr[nums.indexOf(Math.max(...nums))]["created_at"]
        maxAtTime = maxAtTime.substring(11,maxAtTime.length-4)

        document.getElementById("minutesAbove2_5"+kOrB).innerHTML = arr2_5.length + " mins"
        document.getElementById("minutesAbove5"+kOrB).innerHTML = arr5.length + " mins"
        document.getElementById("minutesAbove10"+kOrB).innerHTML = arr10.length + " mins"
        document.getElementById("minutesAbove25"+kOrB).innerHTML = arr25.length + " mins"
        document.getElementById("average"+kOrB).innerHTML = mean + " \&#956g"
        document.getElementById("maximum"+kOrB).innerHTML = max + " \&#956g"
        document.getElementById("maxTime"+kOrB).innerHTML = maxAtTime
        document.getElementById("minimum"+kOrB).innerHTML = min + " \&#956g"
    };
}

updateField({"value": "1.0"})
updateMinutes({"value": "24"})