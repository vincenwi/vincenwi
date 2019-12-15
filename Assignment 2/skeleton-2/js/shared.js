"use strict";

class RoomUsage
{
    constructor(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal) 
    {
        this._roomNumber = roomNumber;
        this._address = address;
        this._lightsOn = lightsOn;
        this._heatingCoolingOn = heatingCoolingOn
        this._seatsUsed = seatsUsed;
        this._seatsTotal = seatsTotal;
        this._timeChecked = new Date();
    }
    
    initialiseFromRoomUsagePDO(roomUsage)
    {
//        for(let info in roomUsage)
//        {
//            this[info](roomUsage[info]);
//        }
//        console.log(roomUsage)
        
        
        
        this.roomNumber = roomUsage._roomNumber;
        this.address = roomUsage._address;
        this.lightsOn = roomUsage._lightsOn;
        this.heatingCoolingOn = roomUsage._heatingCoolingOn;
        this.seatsUsed = roomUsage._seatsUsed;
        this.seatsTotal = roomUsage._seatsTotal;
        this.timeChecked = roomUsage._timeChecked;
        
        
    }
    
    get roomNumber() 
    {
        
        return this._roomNumber
    }
    
    set roomNumber(newRoomNumber) 
    {
        if(newRoomNumber)
        {
            this._roomNumber = newRoomNumber;
        }
        else
        {
//            displayError();
        }
    }
    
    get address() 
    {
        return this._address;
    }
    
    set address(newAddress) 
    {
        this._address = getRoad(newAddress);
    }
    
    get lightsOn() 
    {
        return this._lightsOn;
    }
    
    set lightsOn(newLightsOn) 
    {
        this._lightsOn = newLightsOn;
    }
    
    get heatingCoolingOn() 
    {
        return this._heatingCoolingOn;
    }
    
    set heatingCoolingOn(newHeatingCoolingOn) 
    {
        this._heatingCoolingOn = newHeatingCoolingOn;
    }
    
    get seatsUsed() 
    {
        return this._seatsUsed;
    }
    
    set seatsUsed(newSeatsUsed) 
    {
        this._seatsUsed = newSeatsUsed;
    }
    
    get seatsTotal() 
    {
        return this._seatsTotal;
    }
    
    set seatsTotal(newSeatsTotal) 
    {
        this._seatsTotal = newSeatsTotal;
    }
    
    get timeChecked() 
    {
        return this._timeChecked;
    }
    
    set timeChecked(newTimeChecked)
    {
        this._timeChecked = new Date(newTimeChecked);
    }
    
    toString() 
    {
        return 
    }
}

class RoomUsageList 
{
    constructor() 
    {
        this._roomList = [];
        this._numberOfObservations = 0;
        this.updateCounter();
    }
    
    addObservation(newObservation) 
    {   
        if(this.checkExistence(newObservation) === false)
        {
//        console.log(this._roomList.length)
//        console.log(observation)
            this._roomList.push(newObservation);
            this.updateCounter();
            
            if(document.querySelector(".mdl-layout-title").innerHTML === "New Room Observation")
            {
                let errorMessagesRef = document.getElementById("errorMessages");
                errorMessagesRef.innerHTML = "";
                
                let message = "You observation has been saved."
                let timeout = 2000;
                displayMessage(message, timeout)
            }
        }
        else
        {
            if(document.querySelector(".mdl-layout-title").innerHTML === "New Room Observation")
            {
                displayMessage("Observation already exists.");
            }
        }
    }
    
    updateCounter()
    {
        this._numberOfObservations = this._roomList.length;
    }
    
    removeObservation(index)
    {
        this._roomList.splice(index,1);
        this.updateCounter();
        storeList();
    }
    
    get list() 
    {
        return this._roomList;
    }
    
    checkExistence(newObservation)
    {
        
        // check over Object.keys for "for...in" section
        
        let observationExists = false;
        
        for(let i=0; i<this._roomList.length && this._roomList.length>=1; i++)
        {
            let currentObservation = this._roomList[i];
            for(var info in newObservation)
            {
                if(info !== "_timeChecked")
                {

                    if(currentObservation[info] === newObservation[info])
                    {
                        observationExists = true;
                    }
                    else
                    {
                        observationExists = false;
                        break;
                    }
                }
                else
                {
                    continue;   // skips _timeChecked 
                }
            }

            if(observationExists) // if observation already exists in the list, it just stops checking
            {
                break;
            }
        }
        return observationExists;
    }
    
    initialiseFromListPDO(listFromStorage)
    {
        for(let i=0; i<listFromStorage._roomList.length; i++)
        {
            
            let roomUsage = new RoomUsage();
            
            roomUsage.initialiseFromRoomUsagePDO(listFromStorage._roomList[i]);
            
            this.addObservation(roomUsage);
        }
        
        this.updateCounter();
    } 
    
    sortByDate()
    {
        let sorted = new Array();
        
        for(let observation in this._roomList)
        {
            sorted.push([observation,this._roomList[observation],this._roomList[observation]._timeChecked])
        }
        
        sorted.sort(function(a,b){return b[2]-a[2]});
        
        let tempList = new RoomUsageList();
        
        for(let observation in this._roomList)
        {   
            tempList.addObservation(sorted[observation][1]);
        }

        this._roomList = tempList._roomList


    }
    
    clearObservations()
    {
        this._roomList = new Array();
        this.updateCounter();
        storeList();
    }
}

var key = "ENG1003-RoomUseList";
var roomUsageList = new RoomUsageList();
retrieveList();

function retrieveList()
{
    if(localStorage.getItem(key))
    {
        if(typeof(Storage) !== "undefined")
        {
            let listFromStorage = JSON.parse(localStorage.getItem(key));

            roomUsageList.initialiseFromListPDO(listFromStorage);
        }
        else
        {
            console.log("Error: localStorage is not supported by current browser.");
        }
    }
    roomUsageList.sortByDate();
//    storeList() 

}

function storeList()
{
    localStorage.setItem(key, JSON.stringify(roomUsageList));
}

function deleteObservationAtIndex(index)
{   
    roomUsageList.removeObservation(index);
    document.getElementById("observation" + index).remove()
    
}

function getTime(time,type)
{
    let month = time.getMonth();
    let date = time.getDate();
    let hours = time.getHours();
    let minutes = time.getMinutes().toString();
    let seconds = time.getSeconds().toString();
    
    let monthNames = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
    
    switch(type)
    {   
        case "month":
            return monthNames[month];
            
        case "date":
            return date;
            
        case "hours":
            if(hours>12)
            {
                hours -= 12;
            }
            
            hours = hours.toString();
            
            if(hours.length === 1)
            {
                return "0" + hours;
            }
            else
            {
                return hours;
            }
           
                
        case "minutes":
            if(minutes.length === 1)
            {
                return "0" + minutes;
            }
            else
            {
                return minutes;
            }
            
        case "seconds":
            if(seconds.length === 1)
            {
                return "0" + seconds;
            }
            else
            {
                return seconds;
            }
            
        case "ampm":
            if(hours<=12)
            {
                return "am";
            }
            else
            {
                return "pm";
            }
            
            
    }
}

// displays incorrect inputs because each roomUsage from JSON file is passed through the setters which has the if statements to check the validity of the values being inputted. 
//Posible fix: delete invalid observations from the localstorage



function displayError()
{
    errorMessagesRef.innerHTML = "Incorrect inputs.";
}


function getRoad(address)
{
    for(let i=0; i<address.length; i++) 
        {
            if(address[i] === ",") 
            {
                var commaIndex = i;
                break;
            }
        }

    return address.slice(0,commaIndex);
}


