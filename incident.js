var baseUrl = "https://1a8aec84-215e-43fb-a052-fff56d0599a7.mock.pstmn.io/api/";
var baseHdr = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbklkIjoiN2M0NmY3ZjItYmE0NC00Zjg5LTkzN2UtYjE5YjAwYTE3MDMxIiwiVXNlck5hbWUiOiJTeXN0ZW0iLCJEYXRlQ3JlYXRlZCI6IjIwMjQtMDYtMjZUMDk6NDc6NDYuNzIxOTk0NisxMDowMCIsIklzQXBpS2V5Ijp0cnVlLCJJc1NzbyI6ZmFsc2V9.x8Tai4jbTjYZfGjE-xx-wKD5VwZELouMTkE7InfOBxc',
    'x-api-version': '1.0'
}
var subcategories = [];

document.addEventListener('DOMContentLoaded', function() {
    getIncidentAreas();
    getIncidentCategories();
    getIncidentSubcategories();
    getLocations();
    getRegions();
    getPersonTypes();
    getGenders();
    getInjuryTypes();
    getInjuryLocations();
    getInjuryClassifications();
    getInjuryMechanisms();
    getStates();
    populateYesNoOptions();

    const categorySelect = document.getElementById('incidentPrimaryType');

    categorySelect.addEventListener('change', function() {
        const selectedCategory = this.value;
        populateSubcategories(selectedCategory);
    });

    document.getElementById('incidentForm').addEventListener('submit', function(event) {
        event.preventDefault();
                
        const form = event.target;
        const dateTimeString = `${form.occurrenceDate.value}T${form.occurrenceTime.value}`;

        const data = {
            incidentEventType: "Incident",    
            occurrenceDate: dateTimeString,    
            incidentArea: form.incidentArea.value,   
            incidentPrimaryType: form.incidentPrimaryType.value,
            incidentSecondaryType: form.incidentSecondaryType.value,
            buildingOrVehicleDamaged: form.buildingOrVehicleDamaged.value == "Yes" ? true : false,
            notes: form.notes.value,        
            actionTaken: form.immediateActionTaken.value,    
            text: form.text.value,
            location: form.location.value,
            locationInformation: form.locationInformation.value,
            contributingFactors: form.contributingFactors.value,
            relatedRegion: form.relatedRegion.value,
            alarmRaised: form.alarmRaised.value == "Yes" ? true : false,
            alarmDetails: form.alarmDetails.value,
            alarmActivatedBy: form.alarmActivatedBy.value,
            persons: 
            [ 
                { personType: form.personType.value, 
                    name: form.name.value, 
                    reference: form.reference.value, 
                    hadInjury: true, 
                    gender: form.gender.value, 
                    addressLine: form.addressLine.value, 
                    city: form.city.value,  
                    state: form.state.value, 
                    postCode: form.postcode.value, 
                    phone: form.phone.value, 
                    email: form.email.value, 
                    injuryDetails: 
                        [ 
                            { itemType: "IncidentInjuryType", name: form.incidentInjuryType.value }, 
                            { itemType: "IncidentInjuryLocation", name: form.incidentInjuryLocation.value }, 
                            { itemType: "IncidentInjuryClassification", name: form.incidentInjuryClassification.value }, 
                            { itemType: "IncidentInjuryMechanism", name: form.incidentInjuryMechanism.value } 
                        ]
                    }                
            ]     
        };    
        
        let url = baseUrl + "incident";

        fetch(url, {
            method: 'POST',
            headers: baseHdr,
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('API endpoint not found (404).');
                } else {
                    throw new Error('An error occurred: ' + response.statusText);
                }
            }
            return response.json();
        })
        .then(data => {
            alert('Incident submitted successfully!');
            console.log('Logiqc API returned: ' + data)
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting your incident.');
        });
    });
});


function getIncidentAreas() {    
    let url = baseUrl + "incident/areas";
    getDropDownData(url, 'incidentArea');     
}


function getIncidentCategories() {    
    let url = baseUrl + "incident/categories";
    getDropDownData(url, 'incidentPrimaryType');     
}


function getIncidentSubcategories() {
        
    let url = baseUrl + "incident/subcategories";

    fetch(url, {
            method: 'GET',
            headers: baseHdr
        })
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch incident subcategories');
            }
            return response.json();
        })
        .then(data => {
            subcategories = data;
        })
        .catch(error => {
            console.error('Error fetching incident subcategories:', error);
        });    
}

function populateSubcategories(selectedCategory) {
    const selectElement = document.getElementById('incidentSecondaryType');
    selectElement.innerHTML = '';
    addBlankOption(selectElement);

    // filter subcategories based on selected category and add options
    const filteredSubcategories = subcategories.filter(item => item.category === selectedCategory);
    
    filteredSubcategories.forEach(item => {
        const option = document.createElement('option');
        option.value = item.subcategory;
        option.textContent = item.subcategory;
        selectElement.appendChild(option);
    });
}

function getLocations() {    
    let url = baseUrl + "incident/locations";
    getDropDownData(url, 'location');     
}

function getRegions() {        
    let url = baseUrl + "incident/regions";
    getDropDownData(url, 'relatedRegion');    
}

function getPersonTypes() {        
    let url = baseUrl + "incident/persontypes";
    getDropDownData(url, 'personType');    
}

function getGenders() {        
    let url = baseUrl + "incident/genders";
    getDropDownData(url, 'gender');    
}

function getInjuryTypes() {        
    let url = baseUrl + "incident/injurytypes";
    getDropDownData(url, 'incidentInjuryType');    
}

function getInjuryLocations() {        
    let url = baseUrl + "incident/injurylocations";
    getDropDownData(url, 'incidentInjuryLocation');    
}

function getInjuryClassifications() {        
    let url = baseUrl + "incident/injuryclassifications";
    getDropDownData(url, 'incidentInjuryClassification');    
}

function getInjuryMechanisms() {        
    let url = baseUrl + "incident/injurymechanisms";
    getDropDownData(url, 'incidentInjuryMechanism');    
}


function getStates() {        
    const selectElement = document.getElementById('state');    

    const data = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'];

    addBlankOption(selectElement);
    addDataToSelectElement(selectElement, data);
}

function getDropDownData(url, name) {
    const selectElement = document.getElementById(name);    

    fetch(url, {
            method: 'GET',
            headers: baseHdr
        })
    
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch ' + name);
            }
            return response.json();
        })
        .then(data => {
            addBlankOption(selectElement);
            addDataToSelectElement(selectElement, data);
        })
        .catch(error => {
            console.error('$Error fetching {name}:', error);
        });  
}

function addDataToSelectElement(selectElement, data) {
    data.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type;
        selectElement.appendChild(option);
    });
}

function addBlankOption(selectElement, placeholderText = '') {
    const blankOption = document.createElement('option');
    blankOption.value = ''; 
    blankOption.textContent = placeholderText; 
    selectElement.appendChild(blankOption);
}

function populateYesNoOptions() {
    const yesNoOptions = ['Yes', 'No'];
    const selectElements = document.querySelectorAll('.yesNoSelect');
    
    selectElements.forEach(selectElement => {
        addBlankOption(selectElement);
        addDataToSelectElement(selectElement, yesNoOptions);
    });
}