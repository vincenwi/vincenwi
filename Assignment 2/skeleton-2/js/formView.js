"use strict";

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

let ranOnce = false;;

let errorMessagesRef = document.getElementById("errorMessages");
let toastRef = document.getElementById("toast");

/*
 *  clearForm()
 *      Clears the textfields and resets the switches. There is then an option to undo the clearing which will restore the cleared data.
*/
function clearForm()
{        
    // stores the inputs temporarily in case the user wants to undo the clearing
    let address = addressRef.value;
    let roomNumber = roomNumberRef.value;
    let seatsUsed = seatsUsedRef.value;
    let seatsTotal = seatsTotalRef.value;
    let useAddress = useAddressClassRef.MaterialCheckbox.inputElement_.checked;
    let lightsOn = lightsClassRef.MaterialSwitch.inputElement_.checked;
    let heatingCoolingOn = heatingCoolingClassRef.MaterialSwitch.inputElement_.checked;
    
    resetFields();
    
    let data = 
    {
      message: 'Cleared.',
      timeout: 4000,
      actionHandler: undo,
      actionText: 'Undo'
    };
    toastRef.MaterialSnackbar.showSnackbar(data);
    
    /* Returns what the user entered before the clearing. */
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
        
        snackbarContainer.MaterialSnackbar.cleanup_();
    }
}

/* Saves the form when the "Enter" key is pressed. */
document.getElementById("observationForm").onkeypress = function()
{
    if(window.event.keyCode=='13')
    {
        saveForm();
    }
}

/*
 *  saveForm()
 *      Creates a new roomUsage object using the information entered which is then stored to the list. It first checks if the inputs are
 *      valid, if so then a new observations will be created and stored. If not, then an error will pop up.
*/
function saveForm()
{   
    let address = addressRef.value.trim();
    let roomNumber = roomNumberRef.value.trim();
    let seatsUsed = Number(seatsUsedRef.value);
    let seatsTotal = Number(seatsTotalRef.value);
    let lightsOn = lightsClassRef.MaterialSwitch.inputElement_.checked;
    let heatingCoolingOn = heatingCoolingClassRef.MaterialSwitch.inputElement_.checked;
    
    if(address && roomNumber && seatsUsed && seatsTotal && seatsUsed>=0 && seatsTotal>=0) 
    {
        if(seatsUsed <= seatsTotal)
        {
            let newObservation = new RoomUsage(roomNumber, address, lightsOn, heatingCoolingOn, seatsUsed, seatsTotal)
            roomUsageList.addObservation(newObservation);

            cleanUpToast();

            errorMessagesRef.innerHTML = "";
            displayMessage("Your observation has been saved.")
            cleanUpToast();
            
            storeList();
            return;                                                         // Skips the part which displays the error since there's none.
        }
    } 
    
    errorMessagesRef.innerHTML = "Incorrect inputs.";
}


// ======================================================================
//   GPS sensor code (geolocation)
// ======================================================================
document.getElementById("useAddress").addEventListener("click",function()
{
    if(this.checked)
    {   
        getPosition();                                                      // executes the reverse geocoding code
        
        addressClassRef.MaterialTextfield.disable();                        // disables the adress textfield and the checkbox
        useAddressClassRef.MaterialCheckbox.disable();
    }
})

/*
 *  getPosition()
 *      Prompts a dialogue box when the user checks the checkbox which asks if the user wants to share their location.
 *      It then accesses the location using showCurrentLocation(position) function. If there's an error, then errorHandler(error) will run.
*/
function getPosition()
{
    if (navigator.geolocation && !ranOnce)
    {
        let positionOptions = {
            enableHighAccuracy: true,
            timeout: Infinity,
            maximumAge: 0
        };
        
        navigator.geolocation.watchPosition(showCurrentLocation, errorHandler, positionOptions);
    }
}

/*
 *  errorHandler(error)
 *      Takes in the error code from the browser and it then displays an error text that corresponds with the error code.
 *
 *      Parameter(s):
 *          error: - an object returned by the GPS which contains the error code
 *                 - data type: object
*/
function errorHandler(error)
{
    console.log(error)
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
        displayMessage("Location access timed out.");
    }
    else
    {
        displayMessage("Unknown error getting location.");
    }
    
    addressClassRef.MaterialTextfield.enable();
    useAddressClassRef.MaterialCheckbox.uncheck(); 
}

/*
 *  showCurrentLocation(position)
 *      Takes the position object that is returned by using the Geolocation API and accesses the latitude and longitude values in it. 
 *      It then calls the getAddress() function putting in the latitude and longitude values as the parameters to reverse geocode and
 *      get the address of the user's location. It also sets the variable ranOnce to true to prevent this function from running
 *      again.
 *
 *      Parameter(s):
 *          position: - an object returned by the GPS which contains the coordinates
 *                    - data type: object
*/
function showCurrentLocation(position)
{
    // Demonstrate the current latitude and longitude:
    let latitude = Number(position.coords.latitude);
    let longitude = Number(position.coords.longitude);
    
    getAddress(latitude, longitude);
    ranOnce = true;
}

/*
 *  getAddress(latitude, longitude)
 *      Uses the OpenCage API to reverse geocode the coordinates into actual readable addresses. This function sends a JSON request
 *      to the API and then accesses the road or the footway that is returned. If neither exists or if it is not accurate enough,
 *      then an error will be displayed which will require the user to manually enter the address.
 *
 *      Parameter(s):
 *          latitude and longitude: - position of the user in coordinate form
 *                                  - data type: number
*/
function getAddress(latitude, longitude)
{
    ranOnce = true;
    
    let apikey = 'c8b580297e194d9dbac4e5ecf4fe8c5d';
    let api_url = 'https://api.opencagedata.com/geocode/v1/json';

    let request_url = api_url
    + '?'
    + 'key=' + apikey
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

    let request = new XMLHttpRequest();
    request.open('GET', request_url, true);
    
    request.onload = function() 
    {   
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
   
    // make the request
    request.send();
}

/*
 *  resetFields()
 *      Sets all textfields back to an empty state and sets the switches to off state.
*/
function resetFields()
{
    addressRef.value = "";
    roomNumberRef.value = "";
    seatsUsedRef.value = "";
    seatsTotalRef.value = "";
    updateTextfieldClasses();
    
    lightsClassRef.MaterialSwitch.off();
    heatingCoolingClassRef.MaterialSwitch.off();
    useAddressClassRef.MaterialCheckbox.uncheck();
    errorMessagesRef.innerHTML = "";
    
    cleanUpToast();
}

/*
 *  updateTextfieldClasses()
 *      Uses the method in the MDL component to reset the classes of the textfields. This is because when the textfields are emptied
 *      using component.value = "", the text overlay, which appears when the field is empty, does not return.
*/
function updateTextfieldClasses()
{    
    addressClassRef.MaterialTextfield.updateClasses_();
    roomNumberClassRef.MaterialTextfield.updateClasses_();
    seatsUsedClassRef.MaterialTextfield.updateClasses_();
    seatsTotalClassRef.MaterialTextfield.updateClasses_();
}

/*
 *  cleanUpToast()
 *      If the toast is active when another one is prompted to appear, the one currently active will be closed.
*/
function cleanUpToast()
{
    if(toastRef.MaterialSnackbar.active)
    {
        toastRef.MaterialSnackbar.cleanup_();
    } 
}
