"use strict";

var textFieldIDs = ["address", "roomNumber", "seatsUsed", "seatsTotal"];

var addressRef = document.getElementById("address");
var useAddressRef = document.getElementById("useAddress");
var roomNumberRef = document.getElementById("roomNumber");
var seatsUsedRef = document.getElementById("seatsUsed");
var seatsTotalRef = document.getElementById("seatsTotal");

var addressClassRef = document.getElementsByClassName("mdl-textfield")[0];
var useAddressClassRef = document.getElementsByClassName("mdl-checkbox")[0];
var roomNumberClassRef = document.getElementsByClassName("mdl-textfield")[1];
var lightsClassRef = document.getElementsByClassName("mdl-switch")[0];
var heatingCoolingClassRef = document.getElementsByClassName("mdl-switch")[1];
var seatsUsedClassRef = document.getElementsByClassName("mdl-textfield")[2];
var seatsTotalClassRef = document.getElementsByClassName("mdl-textfield")[3];

var address, roomNumber, seatsUsed, seatsTotal, ranOnce, useAddress, lightsOn, heatingCoolingOn;

var longitude,latitude;

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
    
    var snackbarContainer = document.querySelector('#toast');
    var showSnackbarButton = document.querySelector('#clearButton');
    
    var data = 
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
                localStorage.setItem(key,JSON.stringify(roomUsageList));
                
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
    var elements = document.getElementsByClassName(className);

    for (var i = 0; i < elements.length; i++)
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
    if (navigator.geolocation)
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
        alert("Location access denied by user.");
    }
    else if (error.code == 2)
    {
        alert("Location unavailable.");
    }
    else if (error.code == 3)
    {
        alert("Location access timed out");
    }
    else
    {
        alert("Unknown error getting location.");
    }
    
    addressClassRef.MaterialTextfield.enable();
    useAddressClassRef.MaterialCheckbox.uncheck(); 
}

function showCurrentLocation(position)
{
    // Demonstrate the current latitude and longitude:
//    latitude = Number(position.coords.latitude);
//    longitude = Number(position.coords.longitude);
        latitude = 0; longitude = 0;

    let accuracy = Number(position.coords.accuracy).toFixed(2);

    getAddress();
}

function getAddress()
{
    var apikey = 'c8b580297e194d9dbac4e5ecf4fe8c5d';

    var api_url = 'https://api.opencagedata.com/geocode/v1/json'

    var request_url = api_url
    + '?'
    + 'key=' + apikey
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);
    
    request.onload = function() 
    {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes
        if(ranOnce)
        {
            if (request.status === 200)
            { 
                // Success!
                var data = JSON.parse(request.responseText);

                let road = data.results[0].components.road;
                let footway = data.results[0].components.footway;
                
                console.log(data)

                if(road)
                {
                    addressRef.value = road;
                    updateTextfieldClasses();
                }
                else if(footway)
                {
                    addressRef.value = footway;
                    updateTextfieldClasses();
                }
                else
                {
                    displayMessage("Unable to determine location, please enter your address manually.",5000)
                }

                addressClassRef.MaterialTextfield.enable();
                useAddressClassRef.MaterialCheckbox.uncheck();
            } 
            else if (request.status <= 500)
            { 
                // We reached our target server, but it returned an error

                console.log("unable to geocode! Response code: " + request.status);
                var data = JSON.parse(request.responseText);
            } 
            else 
            {
                console.log("server error");
            }
        }
        
        ranOnce = true;
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