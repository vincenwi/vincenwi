"use strict";

let bucket = roomUsageList.aggregateBy("building"); // Retrieves the bucket of observations aggregated by building address
let content = document.getElementById("content");
let listHTML = "";

// Iterates through all building addresses which holds the observations of the rooms in the buildings
for(let address in bucket)
{
    let currentList = bucket[address].list;
    
    let wastefulCount = 0, totalOccupancy = 0, totalLightsOn = 0, totalHeatingCoolingOn = 0;
    let numberOfObservations = bucket[address]._numberOfObservations;
    
    // Iterates through all the observations made in the building
    for(let roomUsage in currentList)
    {
        let observation = currentList[roomUsage];
        
        let occupancy = observation.occupancy;
        let lightsOn = observation.lightsOn;
        let heatingCoolingOn = observation.heatingCoolingOn;
        
        totalOccupancy += occupancy;
        occupancy === 0 && (lightsOn === false || heatingCoolingOn === false) ? wastefulCount++ : "";   // Increments wastefulCount if observation is wasteful
        lightsOn === true ? totalLightsOn++ : "";                           // Increments totalLightsOn if lights are on
        heatingCoolingOn === true ? totalHeatingCoolingOn++ : "";           // Increments totalHeatingCoolingOn if heater/cooler is on
    }
    
    let wasteful = wastefulCount > 0 ? "wasteful" : ""; // Checks if there are wasteful observations, if so then the building will be highlighted
    
    /* Gets the values in 1 decimal place format. */
    let averageOccupancy = Math.round(totalOccupancy/numberOfObservations*10)/10;       // Gets average occupancy in 1 decimal place format
    let averageLightsUsage = Math.round(totalLightsOn/numberOfObservations*100*10)/10;  // Gets average light usage in 1 decimal place format
    let averageHeatingCoolingUsage = Math.round(totalHeatingCoolingOn/numberOfObservations*100*10)/10;  // Gets average heater cooler in 1 decimal place format
    averageOccupancy % 1 === 0 ? averageOccupancy += ".0" : "";                         // Ensures it is in 1 decimal place format
    averageLightsUsage % 1 === 0 ? averageLightsUsage += ".0" : "";                     // Ensures it is in 1 decimal place format
    averageHeatingCoolingUsage % 1 === 0 ? averageHeatingCoolingUsage += ".0" : "";     // Ensures it is in 1 decimal place format
    
    // Creates the HTML elements using the information stored
    listHTML += `<div class="mdl-cell mdl-cell--4-col">
                        <table class="observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                            <thead>
                                <tr><th class="mdl-data-table__cell--non-numeric">
                                    <h4>
                                        ${address}
                                    </h4>
                                </th></tr>
                            </thead>
                            <tbody>
                                <tr><td class="mdl-data-table__cell--non-numeric ${wasteful}">
                                    Observations: ${numberOfObservations}<br />
                                    Wasteful observations: ${wastefulCount}<br />
                                    Average seat utilisation: ${averageOccupancy}%<br />
                                    Average lights utilisation: ${averageLightsUsage}%<br />
                                    Average heating/cooling utilisation: ${averageHeatingCoolingUsage}%
                                </td></tr>
                            </tbody>
                        </table>
                    </div>`
}

content.innerHTML = listHTML;
checkIfEmpty(roomUsageList); // Checks if there are no observations, if there are none then it will let the user know.