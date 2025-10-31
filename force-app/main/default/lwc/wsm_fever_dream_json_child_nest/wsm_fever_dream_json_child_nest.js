import { LightningElement, api, track } from 'lwc';

export default class Wsm_fever_dream_json_child_nest extends LightningElement {
    @api incjsonstring;
    @api inckeystring;
    @api ischildofarray;
    @api incsettings = {};
    @track appliedSettings = {};
    inckeypretty = '';
    isnotchildofarray = true;

    keyValues = [];
    isArray = false;

    connectedCallback() {
        this.calculateData();
        this.applySettings();
    }

    @api getSettingsFromParent(newSettings) {
        this.incsettings = newSettings;
    }

    applySettings() {
        this.appliedSettings = this.incsettings;
        let allChildLWCs = this.template.querySelectorAll('c-wsm_fever_dream_json_child_nest');
        allChildLWCs.forEach(childLWC => {
            childLWC.getSettingsFromParent(this.appliedSettings);
        });
    }

    calculateData() {
        //console.log('JSON inc to child: ', this.incjsonstring);
        if (this.inckeystring === undefined || this.inckeystring === null) { this.inckeystring = '' }
        else {
            if (this.incsettings.incfieldsettings) {
                // check the field settings for the current key for overrides.
                console.log('Searching in Key Settings for: ',this.inckeystring);
                let foundSettingForCurrentKeyTop = this.incsettings.fieldsettings[this.inckeystring];
                //console.log('FOUND TOP KEY SETTING: ', JSON.stringify(foundSettingForCurrentKeyTop));
                if (foundSettingForCurrentKeyTop !== undefined) {
                    //found settings.

                    this.inckeypretty = foundSettingForCurrentKeyTop['label-override'];
                }
                else {
                    this.inckeypretty = this.makeTextPretty(this.inckeystring, /[^a-zA-Z0-9]/g);
                }
            }
            else {
                this.inckeypretty = this.makeTextPretty(this.inckeystring, /[^a-zA-Z0-9]/g);
            }
        }

        try {
            let parsedJSON = JSON.parse(this.incjsonstring);
            this.ischildofarray ? this.isnotchildofarray = false : this.isnotchildofarray = true;

            if (Array.isArray(parsedJSON)) {
                this.isArray = true;
                this.iterateArray(parsedJSON);
            } else {
                for (const [key, value] of Object.entries(parsedJSON)) {
                    console.log(`Processing: ${key} with the value of ${value}. Type = ${typeof value}`); // "a 5", "b 7", "c 9"
                    let obj = { 'type': 'object', 'isstring': false, 'isobject': false, 'isnumber': false, 'isbool': false, 'key': key, 'value': value };
                    if (typeof value === 'object' && value != null) {
                        obj.isobject = true; // the rest of the values are default in the definition above.
                    }
                    else if (typeof value === 'number') {
                        obj.type = 'number'
                        obj.isnumber = true;
                        obj.valuepretty = value.toString();
                        console.log('Number changed to displayable string: ', obj.valuepretty);
                    }
                    else if (typeof value === 'boolean') {
                        obj.type = 'boolean'
                        obj.isbool = true;
                    }
                    else if (typeof value === 'string') {
                        obj.valuepretty = this.makeTextPretty(value, /(^\"|\"$)/g);
                        obj.type = 'string';
                        obj.isstring = true;
                    }
                    else {
                        obj.type = 'string';
                        obj.valuepretty = value.toString();
                        obj.isstring = true;
                    }
                    obj.keypretty = this.makeTextPretty(key, /[^a-zA-Z0-9]/g);
                    // check to see if field settings JSON was provided.
                    if (this.incsettings.incfieldsettings) {
                        // check the field settings for the current key for overrides.
                        let foundSettingForCurrentKey = this.incsettings.fieldsettings[key];
                        if (foundSettingForCurrentKey !== undefined) {
                            //found settings.
                            obj.keypretty = foundSettingForCurrentKey['label-override'];
                            if (foundSettingForCurrentKey['type'] == 'forced-string') {
                                if (obj.isobject) {
                                    obj.valuepretty = JSON.stringify(value);
                                }
                                obj.type = 'string';
                                obj.isstring = true;
                                obj.isobject = false;
                                obj.isnumber = false;
                                obj.isbool = false;
                            }
                        }
                    }

                    obj.stringifiedvalue = JSON.stringify(value);
                    this.keyValues.push(obj);
                }
            }
        } catch (error) {
            console.log('JSON parse error: ', error.message);
        }
    }

    iterateArray(array) {
        array.forEach((element, index) => {
            let arrayRow = {};
            arrayRow.stringifiedvalue = JSON.stringify(element);
            arrayRow.key = index;
            this.keyValues.push(arrayRow);
            console.log('Pushing this data for array to children: ', JSON.stringify(arrayRow));
        });
    }

    makeTextPretty(incText, regexString) {
        //console.log('make text pretty start: ', incText);
        if (incText === undefined || incText === null) { return '' }; // fix nulls and undefined
        if (typeof incText !== 'string') { incText = JSON.stringify(incText); } // fix other possible strange problems with JSON
        //console.log('make text pretty start: ', incText);
        let newtxt = incText.replace(regexString, ' ');
        //console.log('make text pretty start: ', newtxt);
        return newtxt;
    }

    updateChildSettings(event) {

    }

}