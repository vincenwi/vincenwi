"use strict";

let bucket = roomUsageList.aggregateBy("time"); // retrieves the bucket of observations aggregated by time
let content = document.getElementById("content");
let listHTML = "";

// Iterates through every single hour which holds the observations that were made in that hour.
for(let time in bucket)
{   
    let currentList = bucket[time].list;
    
    // Sorts the observations in the list at that hour by order of ascending occupancy
    currentList.sort((a,b) => a.occupancy - b.occupancy);
    
    listHTML += `<div class="mdl-cell mdl-cell--4-col">
                        <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr><th class="mdl-data-table__cell--non-numeric">
                                    <h5>Worst occupancy for ${time}</h5>
                                </th></tr>
                            </thead>`
    
    let numberOfRoomsToDisplay = currentList.length >= 5 ? 5 : currentList.length;
    
    // Iterates through the top 5 least occupied rooms or all of them if there are less than 5 observations in that hour.
    for(let i=0; i<numberOfRoomsToDisplay; i++)
    {
        let observation = bucket[time].list[i];
        
        let address = observation.address;
        let roomNumber = observation.roomNumber;
        
        let occupancy = Math.round(observation.occupancy*10)/10;
        occupancy % 1 === 0 ? occupancy += ".0" : "";                   // Ensures the number is in 1 decimal place format
        
        let heatingCooling = observation.heatingCoolingOn === true ? "On" : "Off";
        let lights = observation.lightsOn === true ? "On" : "Off";
        
        let timeChecked = observation.timeChecked;
        let fullDate = getTime(timeChecked,"fullDate");                 // Gets the date in the format of dd/mm/yyyy
        let fullTime = getTime(timeChecked,"fullTime");                 // Gets the time in the format of hh:mm:ss
        
        // Creates the HTML elements using the information stored
        listHTML += `<tbody>
                            <tr><td class="mdl-data-table__cell--non-numeric">
                                <div><b>${address} - Rm ${roomNumber}</b></div>
                                <div>Occupancy: ${occupancy}%</div>
                                <div>Heating/cooling: ${heatingCooling}</div>
                                <div>Lights: ${lights}</div>
                                <div><font color="grey">
                                    <i>${fullDate}, ${fullTime}</i>
                                </font></div>
                            </td></tr>`
    }
    
    listHTML += "</tbody></table></div>";
}

content.innerHTML = listHTML;       // displays the HTML elements
checkIfEmpty(roomUsageList);
