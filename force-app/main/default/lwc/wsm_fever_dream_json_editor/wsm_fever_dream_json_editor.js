import { LightningElement, api, track } from 'lwc';

export default class Wsm_fever_dream_json_editor extends LightningElement {
    @api INCJSON;
    @api DefaultMode;
    @api INCFieldSettingsJSON;
    @track CurrentMode = { 'raw': true, 'pretty': false, 'chaos': false };
    @track currentSettings = { 'keyoriginalvaluehelp': false, 'valueoriginalvaluehelp': false, 'columns': 1, 'incfieldsettings': false };
    ParsedJSON;
    isImmediateArray = false;

    connectedCallback() {
        this.initCalculations();
        this.applySettings();
    }

    initCalculations() {
        //console.log(typeof this.INCJSON);
        //console.log(this.INCJSON);
        try {
            if (this.INCFieldSettingsJSON !== undefined) {
                this.currentSettings.fieldsettings = JSON.parse(this.INCFieldSettingsJSON);
                this.currentSettings.incfieldsettings = true;
            }
        }
        catch (error) {
            console.groupCollapsed("Error in ", this.template.host.localName);
            console.trace();
            console.error(error.message);
        };

        try {
            //console.log(this.currentSettings)
            let tempParsedJSON = JSON.parse(this.INCJSON);

            this.ParsedJSON = JSON.stringify(tempParsedJSON, null, 4);
            if (Array.isArray(this.ParsedJSON)) {
                this.isImmediateArray = true;
            }

            this.setCurrentMode(this.DefaultMode);
            //console.log('Sending this to child parser: ', this.INCJSON);
        }
        catch (error) {
            console.groupCollapsed("Error in ", this.template.host.localName);
            console.trace();
            console.error(error.message);
        };

    }

    handleModeButton(event) {
        this.setCurrentMode(event.target.dataset.mode);
    }

    setCurrentMode(INCModeString) { // Send this method a string of the mode you want to set.
        for (const [key, value] of Object.entries(this.CurrentMode)) {
            console.log(`${key}: ${value}`);
            key === INCModeString ? this.CurrentMode[key] = true : this.CurrentMode[key] = false;
        }
    }

    applySettings() {
        let allChildLWCs = this.template.querySelectorAll('c-wsm_fever_dream_json_child_nest');
        allChildLWCs.forEach(childLWC => {
            childLWC.getSettingsFromParent(this.currentSettings);
        });
    }
}