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
        let allChildLWCs  = this.template.querySelectorAll('c-wsm_fever_dream_json_child_nest');
        allChildLWCs.forEach(childLWC => {
            childLWC.getSettingsFromParent(this.appliedSettings);
        });
    }

    calculateData() {
        //console.log('JSON inc to child: ', this.incjsonstring);
        if (this.inckeystring === undefined || this.inckeystring === null) { this.inckeystring = '' };
        this.inckeypretty = this.makeTextPretty(this.inckeystring, /[^a-zA-Z0-9]/g);

        try {
            let parsedJSON = JSON.parse(this.incjsonstring);
            this.ischildofarray ? this.isnotchildofarray = false : this.isnotchildofarray = true;

            if (Array.isArray(parsedJSON)) {
                this.isArray = true;
                this.iterateArray(parsedJSON);
            } else {
                for (const [key, value] of Object.entries(parsedJSON)) {
                    console.log(`${key} ${value}`); // "a 5", "b 7", "c 9"
                    let obj = {};
                    if (typeof value === 'object' && value != null) {
                        obj.type = 'object';
                        obj.isstring = false;
                        obj.isobject = true;
                    }
                    else {
                        obj.type = 'string';
                        obj.isstring = true;
                        obj.isobject = false;
                    }
                    obj.key = key;
                    obj.keypretty = this.makeTextPretty(key, /[^a-zA-Z0-9]/g);
                    obj.value = value;
                    obj.stringifiedvalue = JSON.stringify(value);
                    if (typeof value === 'string') {
                        obj.valuepretty = this.makeTextPretty(value, /(^\"|\"$)/g);
                    }
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
            console.log('Pushing this data for array to children: ',JSON.stringify(arrayRow));
        });
    }

    makeTextPretty(incText, regexString) {
        console.log('make text pretty start: ', incText);
        if (incText === undefined || incText === null) { return ''} ; // fix nulls and undefined
        if (typeof incText !== 'string') { incText = JSON.stringify(incText); } // fix other possible strange problems with JSON
        console.log('make text pretty start: ', incText);
        let newtxt = incText.replace(regexString, ' ');
        console.log('make text pretty start: ', newtxt);
        return newtxt;
    }

    updateChildSettings(event) {

    }

}