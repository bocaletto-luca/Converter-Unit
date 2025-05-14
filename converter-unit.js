/*
 * converter-unit.js - Unit Converter Application
 * Author: Bocaletto Luca
 * License: GPL v3
 *
 * Description:
 *   A complete unit converter application built in JavaScript (ES6). This application supports conversion
 *   for three categories: Length, Weight, and Temperature. It uses a modular approach with a data structure
 *   for conversion factors, and handles special conversion formulas for Temperature.
 */

// Conversion data and functions for different conversion types
const conversionData = {
    "Length": {
        units: {
            "Meter": 1,
            "Kilometer": 1000,
            "Centimeter": 0.01,
            "Millimeter": 0.001,
            "Inch": 0.0254,
            "Foot": 0.3048,
            "Yard": 0.9144,
            "Mile": 1609.34
        },
        convert: function(value, fromFactor, toFactor) {
            // Convert the value to the base unit (meter), then convert to the target unit
            return value * fromFactor / toFactor;
        }
    },
    "Weight": {
        units: {
            "Kilogram": 1,
            "Gram": 0.001,
            "Milligram": 0.000001,
            "Pound": 0.453592,
            "Ounce": 0.0283495
        },
        convert: function(value, fromFactor, toFactor) {
            return value * fromFactor / toFactor;
        }
    },
    "Temperature": {
        units: ["Celsius", "Fahrenheit", "Kelvin"],
        convert: function(value, fromUnit, toUnit) {
            let celsius;
            // Convert input value from the source temperature unit to Celsius
            if(fromUnit === "Celsius") {
                celsius = value;
            } else if(fromUnit === "Fahrenheit") {
                celsius = (value - 32) * 5 / 9;
            } else if(fromUnit === "Kelvin") {
                celsius = value - 273.15;
            } else {
                return null;
            }
            // Convert from Celsius to the target temperature unit
            if(toUnit === "Celsius") {
               return celsius;
            } else if(toUnit === "Fahrenheit") {
               return celsius * 9 / 5 + 32;
            } else if(toUnit === "Kelvin") {
               return celsius + 273.15;
            } else {
               return null;
            }
        }
    }
};

// DOM elements
const conversionTypeSelect = document.getElementById("conversionType");
const fromUnitSelect = document.getElementById("fromUnit");
const toUnitSelect = document.getElementById("toUnit");
const inputValueField = document.getElementById("inputValue");
const convertButton = document.getElementById("convertButton");
const resultDiv = document.getElementById("result");

/**
 * Initialize the converter by updating unit options.
 */
function initConverter() {
    updateUnitOptions();
}

/**
 * Update the "From" and "To" dropdown options based on the selected conversion type.
 */
function updateUnitOptions() {
    const type = conversionTypeSelect.value;
    let optionsHTML = "";

    // Clear existing options
    fromUnitSelect.innerHTML = "";
    toUnitSelect.innerHTML = "";

    if (type === "Temperature") {
        // Temperature units are defined in an array
        conversionData[type].units.forEach(unit => {
            optionsHTML += `<option value="${unit}">${unit}</option>`;
        });
    } else {
        // Other conversion types use an object mapping unit names to conversion factors
        for (let unit in conversionData[type].units) {
            optionsHTML += `<option value="${unit}">${unit}</option>`;
        }
    }
    fromUnitSelect.innerHTML = optionsHTML;
    toUnitSelect.innerHTML = optionsHTML;
}

/**
 * Perform the conversion based on user input and selected options.
 */
function performConversion() {
    const type = conversionTypeSelect.value;
    const inputValue = parseFloat(inputValueField.value);

    // Validate input
    if (isNaN(inputValue)) {
        showResult("Please enter a valid number.", true);
        return;
    }

    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;
    let result;

    if (type === "Temperature") {
        result = conversionData[type].convert(inputValue, fromUnit, toUnit);
    } else {
        const fromFactor = conversionData[type].units[fromUnit];
        const toFactor = conversionData[type].units[toUnit];
        result = conversionData[type].convert(inputValue, fromFactor, toFactor);
    }

    if (result === null || result === undefined) {
        showResult("Conversion error.", true);
    } else {
        showResult(`${inputValue} ${fromUnit} equals ${result.toFixed(4)} ${toUnit}.`);
    }
}

/**
 * Display the conversion result.
 * @param {string} message - The message to display.
 * @param {boolean} [isError=false] - If true, display the message as an error.
 */
function showResult(message, isError = false) {
    resultDiv.style.display = "block";
    resultDiv.className = isError ? "mt-3 alert alert-danger" : "mt-3 alert alert-info";
    resultDiv.textContent = message;
}

// Event listeners
conversionTypeSelect.addEventListener("change", updateUnitOptions);
convertButton.addEventListener("click", performConversion);

// Initialize converter on page load
initConverter();
