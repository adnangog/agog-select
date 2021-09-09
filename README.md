# Agog Select
## Demo

[https://agogselect.netlify.app/](https://agogselect.netlify.app/)
## Options

| Option | Default Value | Description  |
|--|--|--|
| **selector** | [data-agog-select] | main selector to run the plugin |
| **mainClass** | agogSelect-main | container element css class |
| **titleClass** | agogSelect-title | title element css class |
| **emptyClass** | agogSelect-empty | clear icon css class |
| **subClass** | agogSelect-sub | options container element css class |
| **searchClass** | agogSelect-search | searchbox css class |
| **clearClass** | agogSelect-clear | searchbox clear icon css class |
| **mainPlaceHolder** | Please select | default placeholder text |
| **isMultiple** | false | default option for multiple use |
| **maxItems** | null | maximum count of options that can be select |
| **delimiter** | , | separator to use when combining options |
| **textField** | name | default json key for text field |
| **valueField** | id | default json key for value field |
| **callbackBefore** | function() {} | function to run before plugin runs |
| **callbackAfter** | function() {} | function to run after plugin runs |

## Data Attributes (for the current element)

| Option | Values  | Description |
|--|--|--|
| **data-data** | json data | data for auto complete or selection  |
| **data-url** | url | url of the data you want to use |
| **data-value-field** | string | json key for value field |
| **data-text-field** | string | json key for text field |

## Other Attributes (for the current element)

| Option | Values  | Description |
|--|--|--|
| **multiple** |  | sets the use of multi-select |
| **aria-placeholder** | string | placeholder text |

## Example

    <div class="container">
        <select class="form-select" data-agog-select id="number1"  aria-placeholder="Please select a number">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </select>

        <select class="form-select" data-agog-select  id="number2" multiple>
            <optgroup label="First Group">
            <option value="4">Four</option>
            <option value="5">Five</option>
            <option value="6">Six</option>
            </optgroup>
            <optgroup label="Second Group">
            <option value="7">Eight</option>
            <option value="8">Nine</option>
            <option value="9">Ten</option>
            </optgroup>
        </select>

        <select class="form-select" data-agog-select data-url="https://restcountries.eu/rest/v2/all" data-value-field="alpha3Code" data-text-field="name"  id="country" multiple>
        </select>
    </div>

    <script>
        agogSelect.init();
    </script>

