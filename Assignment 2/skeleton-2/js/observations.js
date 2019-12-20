"use strict";

createElements(roomUsageList)

function createElements(roomUsageList)
{

    let body = document.getElementById("content");
    let listHTML = "";

    for(let index=0; index<roomUsageList._roomList.length; index++)
    {
        let observation = roomUsageList._roomList[index];

    //    let newTile = `<div class='mdl-cell mdl-cell--4-col' id='observation${index}'></div>`
    //    
    //    body += newTile



        let div = document.createElement("div");
        div.setAttribute("class","mdl-cell mdl-cell--4-col");
        div.setAttribute("id","observation" + index);
        body.appendChild(div);



    //    let div = document.getElementById("observation" + index)

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

        document.getElementById("date" + index).innerHTML = `${getTime(time,"date")} ${getTime(time,"month")}`;

        document.getElementById("address" + index).innerHTML = observation._address + "<br/>Rm " + observation._roomNumber;
        
        let date = 
        
        
        
        listHTML += "<div class='mdl-cell mdl-cell--4-col' id='observation" + index + "><table class='observation-table mdl-data-table mdl-js-data-table mdl-shadow--2dp' data-upgraded=',MaterialDataTable'><thead><tr><th class='mdl-data-table__cell--non-numeric'><h4 id='date" + index + " class='date'>17 Dec.</h4><h4 id="address0">6 Chancellor's Walk<br>Rm 384</h4><h4 id="roomNumber0"></h4></th></tr></thead><tbody><tr><td class="mdl-data-table__cell--non-numeric" id="observationData0">Time: 05:13:18 pm<br>Lights: Off<br>Heating/cooling: On<br>Seat usage: 0 / 1<br><button class="mdl-button mdl-js-button mdl-button--icon" onclick="deleteObservationAtIndex(0)" data-upgraded=",MaterialButton"><i class="material-icons" id="deleteButton0">delete</i></button></td></tr></tbody></table></div>
    }
}

function searchFor()
{
    document.getElementById("content").innerHTML = "";
    
    let input = document.getElementById("searchField").value.toLowerCase();
    
    let searchList = new RoomUsageList();
    
    for(let observation in roomUsageList._roomList)
    {
        let index = roomUsageList._roomList[observation].toString().toLowerCase().indexOf(input);
        
        if(index !== -1)
        {
            searchList.addObservation(roomUsageList._roomList[observation]);
        }
    }
    
    createElements(searchList);
}