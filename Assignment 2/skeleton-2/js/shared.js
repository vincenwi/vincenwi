"use strict";

let snackbarTimeout;

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
        this._roomNumber = roomUsage._roomNumber;
        this._address = getRoad(roomUsage._address);
        this._lightsOn = roomUsage.lightsOn;
        this._heatingCoolingOn = roomUsage._heatingCoolingOn;
        this._seatsUsed = roomUsage._seatsUsed;
        this._seatsTotal = roomUsage._seatsTotal;
        this._timeChecked = new Date(roomUsage._timeChecked);
    }
    
    get roomNumber() 
    {
        return this._roomNumber
    }
    
    get address() 
    {
        return this._address;
    }
    
    get lightsOn() 
    {
        return this._lightsOn;
    }
    
    get heatingCoolingOn() 
    {
        return this._heatingCoolingOn;
    }
    
    get seatsUsed() 
    {
        return this._seatsUsed;
    }
    
    get seatsTotal() 
    {
        return this._seatsTotal;
    }
    
    get timeChecked() 
    {
        return this._timeChecked;
    }
    
    get occupancy()
    {
        return this._occupancy = this._seatsUsed === 0 && this._seatsTotal === 0 ? 0 : this._seatsUsed/this._seatsTotal*100;;
    }
    
    toString() 
    {
        return `Rm ${this._roomNumber}                   Room ${this._roomNumber}                     ${this._address}`;
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
    
    get list() 
    {
        return this._roomList;
    }
    
    set list(newList)
    {
        this._roomList = newList;
    }
    
    addObservation(newObservation) 
    {   
        let errorMessagesRef = document.getElementById("errorMessages");
//        
//        if(this.checkExistence(newObservation) === false)
//        {
//        console.log(this._roomList.length)
//        console.log(observation)
            this._roomList.push(newObservation);
            this.updateCounter();
            
            if(document.querySelector(".mdl-layout-title").innerHTML === "New Room Observation")
            {
                errorMessagesRef.innerHTML = "";
                displayMessage("You observation has been saved.")
            }
//        }
//        else
//        {
//            if(document.querySelector(".mdl-layout-title").innerHTML === "New Room Observation")
//            {
//                
////                displayMessage("Observation already exists.");
//                errorMessagesRef.innerHTML = "Observaiton already exists.";
//            }
//        }
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
        this.clearObservations();
        
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
        this.list.sort((a,b) => b.timeChecked - a.timeChecked)
    } 
    
    removeObservation(index)
    {
        this.list[index] = "deleted";
        this.updateCounter();
    }
    
    clearObservations()
    {
        this._roomList = new Array();
        this.updateCounter();
    }
    
    aggregateBy(type)
    {
        let bucket = new Object();

        if(type === "time")
        {
            for(let currentHour=0; currentHour<24; currentHour++)
            {
                let hourStr = currentHour > 12 ? currentHour - 12 : currentHour;
                hourStr += amPm(currentHour);
                
                for(let i in this.list)
                {
                    let observation = this.list[i];
                    let time = observation.timeChecked;
                    let hour = time.getHours();
                    
                    if(currentHour === hour)
                    {
                        bucket.hasOwnProperty(hourStr) === false ? bucket[hourStr] = new RoomUsageList() : "";
                        bucket[hourStr].addObservation(observation);
                    }
                }
            }
        }
        else if(type === "building")
        {
            for(let i in this.list)
            {
                let observation = this.list[i];
                let address = observation.address;
                
                bucket.hasOwnProperty(address) === false ? bucket[address] = new RoomUsageList() : "";
                
                bucket[address].addObservation(observation);
            }
        }
        
        return bucket;
    }
    
    updateCounter()
    {
        this._numberOfObservations = this._roomList.length;
    }
}

let key = "ENG1003-RoomUseList";
let roomUsageList;

retrieveList();

function retrieveList()
{
    roomUsageList = new RoomUsageList();
    
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
        case "monthName":
            return monthNames[month];
            
        case "month":
            return month;
            
        case "date":
            return date;
            
        case "hours":
            hours > 12 ? hours -= 12 : "";
            hours = hours.toString();
            hours = hours.length === 1 ? "0" + hours : hours;
            return hours;
                
        case "minutes":
            minutes = minutes.length === 1 ? "0" + minutes : minutes;
            
        case "seconds":
            seconds = seconds.length === 1 ? "0" + seconds : seconds;
            return seconds;
    }
}

function amPm(hour)
{
    return hour<12 || hour===24 ? "am" : "pm";
}

// displays incorrect inputs because each roomUsage from JSON file is passed through the setters which has the if statements to check the validity of the values being inputted. 
//Posible fix: delete invalid observations from the localstorage

function displayError()
{
    errorMessagesRef.innerHTML = "Incorrect inputs.";
}

function getRoad(address)
{
    if(address)
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
}

window.onbeforeunload = storeList;

function storeList()
{
    let deletedIndex;
    
    while(deletedIndex !== -1)
    {
        deletedIndex = roomUsageList.list.indexOf("deleted"); // returns -1 if "deleted" cannot be found
        deletedIndex !== -1 ? roomUsageList.list.splice(deletedIndex,1) : "";
    }
    
    roomUsageList.updateCounter();
    
    localStorage.setItem(key, JSON.stringify(roomUsageList));
}



