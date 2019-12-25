"use strict";

let type = "time";
let bucket = roomUsageList.aggregateBy(type);

let body = document.getElementById("content");
let listHTML = "";

for(let i in bucket)
{
    let title = i;
    
    let currentList = bucket[i].list;
    currentList.sort((a,b) => a.occupancy - b.occupancy);
    
    listHTML += "<div class='mdl-cell mdl-cell--4-col'><table class='mdl-data-table mdl-js-data-table mdl-shadow--2dp' data-upgraded=',MaterialDataTable'><thead><tr><th class='mdl-data-table__cell--non-numeric'><h5>Worst occupancy for " + title + "</h5></th></tr></thead><tbody>";
    
    let numberOfRooms = currentList.length>=5 ? 5 : currentList.length;
    
    for(let j=0; j<numberOfRooms; j++)
    {
        let observation = bucket[i].list[j];
        let address = observation.address;
        let roomNumber = observation.roomNumber;
        let occupancy = Math.round(observation.occupancy*10)/10;
        occupancy % 1 === 0 ? occupancy += ".0" : "";
        let heatingCooling = observation.heatingCoolingOn === true ? "On" : "Off";
        let lights = observation.lightsOn === true ? "On" : "Off";
        let timeChecked = observation.timeChecked;

        let date = timeChecked.getDate();
        let month = timeChecked.getMonth();
        date = date.toString().length === 1 ? "0" + date : date;
        month = month.toString().length === 1 ? "0" + month : month;
        let fullDate = `${date}/${month}/${timeChecked.getFullYear()}`

        let hours = getTime(timeChecked,"hours");
        let minutes = getTime(timeChecked,"minutes");
        let seconds = getTime(timeChecked,"seconds");
        let ampm = amPm(timeChecked.getHours());
        let time = `${hours}:${minutes}:${seconds} ${ampm}`;

        listHTML += "<tr><td class='mdl-data-table__cell--non-numeric'><div><b>" + address + "; Rm " + roomNumber + "</b></div><div>Occupancy: " + occupancy + "%</div><div>Heating/cooling: " + heatingCooling + "</div><div>Lights: " + lights + "</div><div><font color='grey'><i>" + fullDate + ", " + time + "</i></font></div></td></tr>";
    }
    
    listHTML += "</tbody></table></div>";
}

body.innerHTML = listHTML;
