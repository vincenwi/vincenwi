"use strict";

let body = document.getElementsByClassName("mdl-grid")[0];

for(let index=0; index<roomUsageList._roomList.length; index++)
{
    let observation = roomUsageList._roomList[index];
    
    let div = document.createElement("div");
    div.setAttribute("class","mdl-cell mdl-cell--4-col");
    div.setAttribute("id","observation" + index);
    body.appendChild(div);
    
    let table = document.createElement("table");
    table.setAttribute("class","observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp");
    table.setAttribute("data-upgraded",",MaterialDataTable");
    div.appendChild(table);
        
    let thead = document.createElement("thead");
    table.appendChild(thead);
    
    let tr = document.createElement("tr");
    thead.appendChild(tr);
    
    let th = document.createElement("th");
    th.setAttribute("class","mdl-data-table__cell--non-numeric");
    tr.appendChild(th);
    
    let date = document.createElement("h4");
    date.setAttribute("id","date" + index);
    date.setAttribute("class","date")
    th.appendChild(date);
    
    let address = document.createElement("h4");
    address.setAttribute("id","address" + index);
    th.appendChild(address);
    
    let roomNumber = document.createElement("h4");
    roomNumber.setAttribute("id","roomNumber" + index);
    th.appendChild(roomNumber);
    
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    
    tr = document.createElement("tr");
    tbody.appendChild(tr);
    
    let td = document.createElement("td");
    td.setAttribute("class","mdl-data-table__cell--non-numeric");
    td.setAttribute("id","observationData" + index)
    tr.appendChild(td);
    
    let lights, heatingCooling;
    
    if(observation._lightsOn === true)
    {
        lights = "On";
    }
    else
    {
        lights = "Off";
    }
    
    if(observation._heatingCoolingOn === true)
    {
        heatingCooling = "On";
    }
    else
    {
        heatingCooling = "Off";
    }
    
    let time = observation._timeChecked;
    
    let ampm = amPm(time);
    
    document.getElementById("observationData" + index).innerHTML = "Time: " 
        + getTime(time,"hours") 
        + ":" 
        + getTime(time,"minutes") 
        + ":"
        + getTime(time,"seconds") 
        + " "
        + getTime(time,"ampm")
        + "<br/>" + "Lights: " + lights + "<br/>" + "Heating/cooling: " + heatingCooling + "<br/>" + "Seat usage: " + observation._seatsUsed + " / " + observation._seatsTotal + "<br/>";
    
    let button = document.createElement("button");
    button.setAttribute("class","mdl-button mdl-js-button mdl-button--icon");
    button.setAttribute("onClick","deleteObservationAtIndex(" + index + ")");
    button.setAttribute("data-upgraded",",MaterialButton");
    td.appendChild(button);
    
    let i = document.createElement("i");
    i.setAttribute("class","material-icons");
    i.setAttribute("id","deleteButton" + index)
    button.appendChild(i);
    document.getElementById("deleteButton" + index).innerHTML = "delete";
    
    document.getElementById("address" + index).innerHTML = observation._address + "<br/>" + observation._roomNumber;
    
    
    
    
    
}
