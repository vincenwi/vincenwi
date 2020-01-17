"use strict";

let textFieldIDs = ["address", "roomNumber", "seatsUsed", "seatsTotal"];

let addressRef = document.getElementById("address");
let useAddressRef = document.getElementById("useAddress");
let roomNumberRef = document.getElementById("roomNumber");
let seatsUsedRef = document.getElementById("seatsUsed");
let seatsTotalRef = document.getElementById("seatsTotal");

let addressClassRef = document.getElementsByClassName("mdl-textfield")[0];
let useAddressClassRef = document.getElementsByClassName("mdl-checkbox")[0];
let roomNumberClassRef = document.getElementsByClassName("mdl-textfield")[1];
let lightsClassRef = document.getElementsByClassName("mdl-switch")[0];
let heatingCoolingClassRef = document.getElementsByClassName("mdl-switch")[1];
let seatsUsedClassRef = document.getElementsByClassName("mdl-textfield")[2];
let seatsTotalClassRef = document.getElementsByClassName("mdl-textfield")[3];

let address, roomNumber, seatsUsed, seatsTotal, ranOnce, useAddress, lightsOn, heatingCoolingOn;

let longitude,latitude;

let errorMessagesRef = document.getElementById("errorMessages");

function clearForm()
{        
    // stores the inputs temporarily in case the user wants to undo the clearing
    let address = addressRef.value;
    let roomNumber = roomNumberRef.value;
    let seatsUsed = seatsUsedRef.value;
    let seatsTotal = seatsTotalRef.value;
    
    useAddress = useAddressClassRef.MaterialCheckbox.inputElement_.checked;
    lightsOn = lightsClassRef.MaterialSwitch.inputElement_.checked;
    heatingCoolingOn = heatingCoolingClassRef.MaterialSwitch.inputElement_.checked;
    
    addressRef.value = "";
    roomNumberRef.value = "";
    seatsUsedRef.value = "";
    seatsTotalRef.value = "";
    updateTextfieldClasses();
    lightsClassRef.MaterialSwitch.off();
    heatingCoolingClassRef.MaterialSwitch.off();
    useAddressClassRef.MaterialCheckbox.uncheck();

    errorMessagesRef.innerHTML = "";
    
    let snackbarContainer = document.querySelector('#toast');
    let showSnackbarButton = document.querySelector('#clearButton');
    
    let data = 
    {
      message: 'Cleared.',
      timeout: 4000,
      actionHandler: undo,
      actionText: 'Undo'
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
    
    // Returns what the user entered before the clearing
    function undo() 
    {
        addressRef.value = address;
        roomNumberRef.value = roomNumber;
        seatsUsedRef.value = seatsUsed;
        seatsTotalRef.value = seatsTotal;
        updateTextfieldClasses();
        useAddress ? useAddressClassRef.MaterialCheckbox.check() : "";
        lightsOn ? lightsClassRef.MaterialSwitch.on() : "";
        heatingCoolingOn ? heatingCoolingClassRef.MaterialSwitch.on() : "";  
    }
}

document.getElementById("observationForm").onkeypress = function()
{
    if(window.event.keyCode=='13')
    {
        saveForm();
    }
}

function saveForm()
{   
    let address = addressRef.value.trim();
    let roomNumber = roomNumberRef.value.trim();
    let seatsUsed = Number(seatsUsedRef.value);
    let seatsTotal = Number(seatsTotalRef.value);
    let lightsOn,heatingCoolingOn;
    
    if(address && roomNumber && seatsUsed>=0 && seatsTotal>=0 && Number.isInteger(seatsUsed)===true && Number.isInteger(seatsTotal)===true) 
    {
        if (!document.querySelector(".is-invalid")) // detects if seatsUsed or seatsTotal triggers "Input is not a number!"
        {
            if(seatsUsed <= seatsTotal)
            {
                lightsOn = lightsClassRef.MaterialSwitch.inputElement_.checked;
                heatingCoolingOn = heatingCoolingClassRef.MaterialSwitch.inputElement_.checked;

                let newObservation = new RoomUsage(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal)
                roomUsageList.addObservation(newObservation);
                
                // find out if RoomUsageList class should be by address or something else
                localStorage.setItem(STORAGE_KEY,JSON.stringify(roomUsageList));
                return;
            }
        }    
    } 
    
    errorMessagesRef.innerHTML = "Incorrect inputs.";
    
}

// Geolocation

document.getElementById("useAddress").addEventListener("click",function(){
    if(this.checked)
    {
        ranOnce = false;
        
        getPosition();
        
        addressClassRef.MaterialTextfield.disable();
        useAddressClassRef.MaterialCheckbox.disable();
    }
})

function displayElementsWithClass(className, display)
{
    let elements = document.getElementsByClassName(className);

    for (let i = 0; i < elements.length; i++)
    {
        if (display)
        {
            elements[i].style.display = "block";
        }
        else
        {
            elements[i].style.display = "none";
        }
    }
}

// ======================================================================
//   GPS sensor code (geolocation)
// ======================================================================

function getPosition()
{
    if (navigator.geolocation && !ranOnce)
    {
        let positionOptions = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        };

        displayElementsWithClass("gpsError", false);
        navigator.geolocation.watchPosition(showCurrentLocation, errorHandler, positionOptions);
    }
    else
    {
        displayElementsWithClass("gpsValue", false);
    }
}

function errorHandler(error)
{
    if (error.code == 1)
    {
        displayMessage("Location access denied by user.");
    }
    else if (error.code == 2)
    {
        displayMessage("Location unavailable.");
    }
    else if (error.code == 3)
    {
        displayMessage("Location access timed out");
    }
    else
    {
        displayMessage("Unknown error getting location.");
    }
    
    addressClassRef.MaterialTextfield.enable();
    useAddressClassRef.MaterialCheckbox.uncheck(); 
}

function showCurrentLocation(position)
{
    // Demonstrate the current latitude and longitude:
    latitude = Number(position.coords.latitude);
    longitude = Number(position.coords.longitude);
//    latitude = -37.806402; longitude = 144.961947;
    
    if(ranOnce === false)
    {
        true ? getAddress() : displayMessage("Cannot determine your address accurately, please enter the address manually.", 4000);
        ranOnce = true;
    }
}

function getAddress()
{
    let apikey = 'c8b580297e194d9dbac4e5ecf4fe8c5d';
    let api_url = 'https://api.opencagedata.com/geocode/v1/json'

    let request_url = api_url
    + '?'
    + 'key=' + apikey
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    let request = new XMLHttpRequest();
    request.open('GET', request_url, true);
    
    request.onload = function() 
    {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes
        
        if (request.status === 200)
        { 
            // Success!
            let data = JSON.parse(request.responseText);

            let road = data.results[0].components.road;
            let footway = data.results[0].components.footway;
            let accuracy = data.results[0].confidence;

            if(accuracy >= 8)
            {
                if(road)
                {
                    addressRef.value = road;
                }
                else if(footway)
                {
                    addressRef.value = footway;
                }
                else
                {
                    displayMessage("Unable to determine location, please enter your address manually.", 5000)
                }
            }
            else
            {
                displayMessage("Cannot determine your address accurately, please enter the address manually.", 5000);
            }

            updateTextfieldClasses();
            addressClassRef.MaterialTextfield.enable();
        } 
        else if (request.status <= 500)
        { 
            // We reached our target server, but it returned an error

            console.log("unable to geocode! Response code: " + request.status);
            let data = JSON.parse(request.responseText);
        } 
        else 
        {
            console.log("server error");
        }
    };

    request.onerror = function() 
    {
        // There was a connection error of some sort
        console.log("unable to connect to server");      
        
        addressClassRef.MaterialTextfield.enable();
        useAddress.MaterialCheckbox.uncheck();
    };
   
    request.send();  // make the request
}
            
function updateTextfieldClasses()
{    
    addressClassRef.MaterialTextfield.updateClasses_();
    roomNumberClassRef.MaterialTextfield.updateClasses_();
    seatsUsedClassRef.MaterialTextfield.updateClasses_();
    seatsTotalClassRef.MaterialTextfield.updateClasses_();
}