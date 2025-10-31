## Features
Displays valid JSON in a Pretty format, or Raw Code

## Prerequisites
- Salesforce org (Sandbox, Developer, or Production)
- Salesforce CLI (sfdx) - if deploying manually
- API version 64.0 or higher

## Installation
### Quick Deploy (Recommended)
Click the button below to deploy directly to your Salesforce org:

[<img src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png" alt="Deploy to Salesforce">](https://githubsfdeploy.herokuapp.com?owner=shadradson&repo=JSON-Fever-Dream-Repo&ref=main)


# How To Use
After installation, create a screen flow.
In the screen flow, the JSON parser can be placed in a screen component.
Configure the LWC to take in the JSON that needs to be formatted. 

## Inputs

## Default Display Mode
This has 3 settings: [raw,pretty,chaos]
Each settings determines how the JSON editor will display by default.
Raw = Raw JSON that has been tabulated.
Pretty = Formatted JSON in HTML components that make up what shows on the screen.
Chaos = Unformatted, Untabulated JSON.......Why would you pick this? Just don't install the program......Why would I add this? I must have been tired.

## Input JSON text
This is where you put the string of JSON that needs to be formatted. (If this is not valid JSON, this will fail.)

## Field Settings JSON
You can add settings for individual keys which will change how the JSON parser works. Valid JSON structure for input example below:

{
"KeyInJSON1":{"type":"auto","label-override":"First Key In JSON"},
"SomeOtherKey":{"type":"forced-string","label-override":"That Other Key"},
}

There are 3 things per key - value (object) pair in the field settings JSON.
1. The key in the JSON to be configured
2. The Label Override which will change the Key displayed to a string (Usually for making things more clear.)
3. The Type which has 2 modes. auto, and forced-string. forced-string will make the output in pretty mode show the raw JSON as the value for that specific key instead of parsing it into pretty format.
