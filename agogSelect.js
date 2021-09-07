(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.agogSelect = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {

    'use strict';

    var agogSelect = {};
    var supports = !!document.querySelector && !!root.addEventListener;
    var settings;


    // Varsayılan ayarlar
    var defaults = {
        selector: 'select',
        mainClass: 'agog-select',
        titleClass: 'agog-title',
        emptyClass: 'agog-empty',
        subClass: 'agog-sub',
        searchClass: 'agog-search',
        clearClass: 'agog-clear',
        mainPlaceHolder: 'Lütfen Seçiniz',
        filterPlaceHolder: 'filtrele',
        isMultiple: false,
        maxItems: null,
        delimiter: ",",
        callbackBefore: function () {
            console.log("agogSelect başlatılıyor.")
        },
        callbackAfter: function () {
            console.log("agogSelect bitiriliyor.")
        }
    };


    //
    // Methods
    //



    /**
     * Handle events
     * @private
     */
    var eventHandler = function (event) {
        // @todo Do something on event
    };

    /**
     * Destroy the current initialization.
     * @public
     */
    agogSelect.destroy = function () {


        if (!settings) return;

        agogSelect.removeListeners();

        document.querySelectorAll("." + settings.mainClass).forEach(item => item.remove())

        settings = null;

    };

    agogSelect.init = function (options) {

        if (!supports) return;

        agogSelect.destroy();

        settings = Object.assign(defaults, options);

        settings.callbackBefore();

        agogSelect.create();

        settings.callbackAfter();

    };


    agogSelect.create = function () {

        let items = document.querySelectorAll(settings.selector);

        for (let ii = 0; ii < items.length; ii++) {
            const originalSelect = items[ii];

            originalSelect.style.display = "none";

            let isMultiple = originalSelect.getAttribute("multiple");

            let url = originalSelect.dataset.url;
            let valueField = originalSelect.dataset.valueField;
            let textField = originalSelect.dataset.textField;

            let thisSelect = document.createElement("div");
            thisSelect.classList.add(settings.mainClass);
            thisSelect.dataset.index = ii;

            let title = document.createElement("div");
            title.classList.add(settings.titleClass);

            let titleSpan = document.createElement("span");
            titleSpan.classList.add("inner");
            titleSpan.innerHTML = originalSelect.getAttribute("aria-placeholder") || settings.mainPlaceHolder;
            title.appendChild(titleSpan);

            if (isMultiple !== null) {
                thisSelect.dataset.multiple = true;
            } else {
                let titleEmpty = document.createElement("span");
                titleEmpty.classList.add(settings.emptyClass);
                titleEmpty.style.display = "none";
                titleEmpty.innerHTML = "<i class='fas fa-times'></i>";

                title.appendChild(titleEmpty);
            }

            let sub = document.createElement("div");
            sub.classList.add(settings.subClass);

            let search = document.createElement("div");
            search.classList.add(settings.searchClass);
            let searchText = document.createElement("input");
            searchText.setAttribute("type", "text");
            searchText.setAttribute("placeholder", settings.filterPlaceHolder);
            let clearFilter = document.createElement("div");
            clearFilter.innerHTML = "<i class='fas fa-times'></i>";
            clearFilter.classList.add(settings.clearClass);


            search.appendChild(searchText);
            search.appendChild(clearFilter);

            sub.appendChild(search);

            if (url) {
                fetch(url).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    for (let dIndex = 0; dIndex < data.length; dIndex++) {
                        const d = data[dIndex];

                        var option = document.createElement("option");
                        option.text = d[textField];
                        option.value = d[valueField];
                        originalSelect.appendChild(option);

                    }

                    for (let index = 0; index < originalSelect.options.length; index++) {
                        let optionSpan = document.createElement("span");
                        optionSpan.dataset.value = originalSelect.options[index].value;
                        optionSpan.innerHTML = originalSelect.options[index].innerHTML;

                        sub.appendChild(optionSpan);

                    }

                });


            }

            var isOptionGroups = originalSelect.getElementsByTagName('optgroup').length > 0;

            if (isOptionGroups) {

                thisSelect.dataset.optionGroup = true;

                for (let ogIndex = 0; ogIndex < originalSelect.getElementsByTagName('optgroup').length; ogIndex++) {

                    let optionDiv = document.createElement("section");
                    optionDiv.classList.add("optGroup");
                    optionDiv.innerHTML = "<strong>" + originalSelect.children[ogIndex].getAttribute("label") + "</strong>";

                    for (let index = 0; index < originalSelect.children[ogIndex].children.length; index++) {
                        let optionSpan = document.createElement("span");
                        optionSpan.dataset.value = originalSelect.children[ogIndex].children[index].value;
                        optionSpan.innerHTML = originalSelect.children[ogIndex].children[index].innerHTML;

                        optionDiv.appendChild(optionSpan);

                    }

                    sub.appendChild(optionDiv);

                }

            } else {
                for (let index = 0; index < originalSelect.options.length; index++) {
                    let optionSpan = document.createElement("span");
                    optionSpan.dataset.value = originalSelect.options[index].value;
                    optionSpan.innerHTML = originalSelect.options[index].innerHTML;

                    sub.appendChild(optionSpan);

                }
            }

            thisSelect.appendChild(title);
            thisSelect.appendChild(sub);
            originalSelect.parentElement.appendChild(thisSelect)

        }

        setTimeout(function () {
            setElements();
            agogSelect.addListeners();
        }, 2000);




        function setElements() {
            let selectItems = document.querySelectorAll("." + settings.mainClass);

            for (let itemIndex = 0; itemIndex < selectItems.length; itemIndex++) {
                let sIndex = itemIndex;
                const item = selectItems[itemIndex];

                let isMultiple = settings.isMultiple = item.dataset.multiple;
                let options = [];

                for (let oIndex = 0; oIndex < items[sIndex].children.length; oIndex++) {
                    const element = items[sIndex].children[oIndex];
                    if (element.tagName === "OPTGROUP") {
                        for (let ogIndex = 0; ogIndex < element.children.length; ogIndex++) {
                            options.push(element.children[ogIndex]);
                        }
                    } else {
                        options.push(element);
                    }

                }

                let childItems = item.dataset.optionGroup ? item.children[1].querySelectorAll("." + settings.searchClass + ",span") : item.children[1].children;

                for (let index = 0; index < childItems.length; index++) {


                    if (childItems[index].tagName === "SPAN") {
                        // childItems[index].addEventListener('click', function (event) {

                        //     if (!isMultiple) {
                        //         item.children[0].querySelector("span").innerHTML = event.target.innerHTML;
                        //         item.dataset.selected = event.target.dataset.value;

                        //         item.children[0].querySelector("span." + settings.emptyClass).style.display = "block";

                        //         for (let z = 0; z < options.length; z++) {
                        //             if (options[z].value === event.target.dataset.value) {
                        //                 options[z].selected = true;
                        //             } else {
                        //                 options[z].selected = false;
                        //             }
                        //         }

                        //         for (let z = 0; z < childItems.length; z++) {
                        //             childItems[z].classList.remove("active");
                        //         }

                        //         event.target.classList.add("active");

                        //     } else {

                        //         let selectedItems = [];
                        //         let selectedItemsText = [];

                        //         for (let z = 0; z < options.length; z++) {
                        //             if (options[z].value === event.target.dataset.value) {
                        //                 if (options[z].selected) {
                        //                     options[z].selected = false;
                        //                     event.target.classList.remove("active");
                        //                 } else {
                        //                     options[z].selected = true;
                        //                     event.target.classList.add("active");
                        //                 }
                        //             }

                        //             if (options[z].selected) {
                        //                 selectedItems.push(options[z].value);
                        //                 selectedItemsText.push(options[z].innerHTML);
                        //             }
                        //         }

                        //         let itemHtml = "";

                        //         for (let k = 0; k < selectedItemsText.length; k++) {
                        //             itemHtml = itemHtml + "<div class='agog-tag'>" + selectedItemsText[k] + "<div class='agog-tag-close' data-value='" + selectedItems[k] + "'><i class='fas fa-times'></i></div></div>";

                        //         }

                        //         item.children[0].querySelector("span").innerHTML = itemHtml || items[sIndex].getAttribute("aria-placeholder") || settings.mainPlaceHolder;
                        //         item.dataset.selected = selectedItems.join(",");

                        //         let tags = document.querySelectorAll(".agog-tag-close");

                        //         for (let tIndex = 0; tIndex < tags.length; tIndex++) {
                        //             const tag = tags[tIndex];

                        //             tag.addEventListener('click', function (e) {
                        //                 let tagId = e.target.dataset.value || e.target.parentNode.dataset.value;
                        //                 document.querySelector("." + settings.subClass + " span[data-value='" + tagId + "']").click();
                        //                 e.stopPropagation();
                        //             })

                        //         }
                        //     }
                        // })
                    } else {

                        childItems[index].children[0].addEventListener('keyup', function (event) {
                            agogSelect.itemsFilter(childItems, event);
                        })

                        childItems[index].children[1].addEventListener('click', function () {
                            childItems[index].children[0].value = "";
                            agogSelect.itemsFilter(childItems);
                        })
                    }

                }

            }
        }

    };

    agogSelect.addListeners = function () {

        

        document.querySelectorAll("." + settings.mainClass).forEach(item => {
            item.addEventListener('mouseleave', function(){removeSelect(item)})
        })

        let titles = document.querySelectorAll("." + settings.titleClass + " span.inner");
        titles.forEach(title => {
            title.addEventListener('click', function(){showSub(title)})
        });

        let empties = document.querySelectorAll("." + settings.titleClass + " span." + settings.emptyClass);
        empties.forEach(empty => {
            empty.addEventListener('click', function(){emptySelect(empty)})
        });

        let selectableItems = document.querySelectorAll("." + settings.subClass + " span");
        selectableItems.forEach(selectableItem => {

            selectableItem.addEventListener('click', function(event){selectOption(selectableItem,event)})

        })


    };

    agogSelect.removeListeners = function(){
        document.querySelectorAll("." + settings.mainClass).forEach(item => {
            item.removeEventListener('mouseleave', function(){removeSelect(item)});
        })

        let titles = document.querySelectorAll("." + settings.titleClass + " span.inner");
        titles.forEach(title => {
            title.removeEventListener('click', function(){showSub(title)})
        });

        let empties = document.querySelectorAll("." + settings.titleClass + " span." + settings.emptyClass);
        empties.forEach(empty => {
            empty.removeEventListener('click', function(){emptySelect(empty)})
        });

        let selectableItems = document.querySelectorAll("." + settings.subClass + " span");
        selectableItems.forEach(selectableItem => {
            selectableItem.removeEventListener('click', function(event){selectOption(selectableItem,event)})
        })
    };


    agogSelect.itemsFilter = function (elements, event) {

        if (event && event.keyCode === 13 && event.target.value.length > 0) {
            let firstItem = Array.from(elements).filter(function (x) { x.innerHTML.toLocaleLowerCase().indexOf(event.target.value) > -1 });
            if (firstItem[0])
                firstItem[0].click();
        }

        for (let z = 0; z < elements.length; z++) {
            if (elements[z].tagName === "SPAN") {
                if (elements[z].innerHTML.toLocaleLowerCase().indexOf(event ? event.target.value : "") == -1) {
                    elements[z].style.display = "none";
                } else {
                    elements[z].style.display = "block";
                }
            }
        }
    }


    function removeSelect(item) {
        item.classList.remove("active");
    }

    function showSub(title) {
        let parent = title.parentNode.parentNode;
        parent.classList.toggle("active");
        if (parent.classList.contains("active")) {
            setTimeout(function () {
                parent.children[1].querySelector("." + settings.searchClass + " input").focus();
            }, 200);
        }
    }

    function emptySelect(empty) {
        let parent = empty.parentNode.parentNode;
        let sIndex = parent.dataset.index;
        let items = document.querySelectorAll(settings.selector);

        parent.children[0].querySelector("span.inner").innerHTML = items[sIndex].getAttribute("aria-placeholder") || settings.mainPlaceHolder;
        parent.children[0].querySelector("span." + settings.emptyClass).style.display = "none";

        parent.removeAttribute("data-selected");

        let options = [];


        for (let oIndex = 0; oIndex < items[sIndex].children.length; oIndex++) {
            const element = items[sIndex].children[oIndex];
            if (element.tagName === "OPTGROUP") {
                for (let ogIndex = 0; ogIndex < element.children.length; ogIndex++) {
                    options.push(element.children[ogIndex]);
                }
            } else {
                options.push(element);
            }

        }

        let childItems = parent.dataset.optionGroup ? parent.children[1].querySelectorAll("." + settings.searchClass + ",span") : parent.children[1].children;

        for (let z = 0; z < childItems.length; z++) {
            childItems[z].classList.remove("active");
        }

        for (let z = 0; z < options.length; z++) {
            options[z].selected = false;
        }
    }

    function selectOption(selectableItem,event) {

        let parent = selectableItem.closest("." + settings.mainClass);
        let isMultiple = parent.dataset.multiple;
        let childItems = selectableItem.parentNode.querySelectorAll("span");
        let items = document.querySelectorAll(settings.selector);

        let options = [];
        let sIndex = parent.dataset.index;

        for (let oIndex = 0; oIndex < items[sIndex].children.length; oIndex++) {
            const element = items[sIndex].children[oIndex];
            if (element.tagName === "OPTGROUP") {
                for (let ogIndex = 0; ogIndex < element.children.length; ogIndex++) {
                    options.push(element.children[ogIndex]);
                }
            } else {
                options.push(element);
            }

        }

        if (!isMultiple) {
            parent.children[0].querySelector("span").innerHTML = event.target.innerHTML;
            parent.dataset.selected = event.target.dataset.value;

            parent.children[0].querySelector("span." + settings.emptyClass).style.display = "block";

            for (let z = 0; z < options.length; z++) {
                if (options[z].value === event.target.dataset.value) {
                    options[z].selected = true;
                } else {
                    options[z].selected = false;
                }
            }

            for (let z = 0; z < childItems.length; z++) {
                childItems[z].classList.remove("active");
            }

            event.target.classList.add("active");

        } else {

            if (settings.maxItems && parent.dataset.selected && parent.dataset.selected.split(",").length>=settings.maxItems) {
                return false;
            }

            let selectedItems = [];
            let selectedItemsText = [];

            for (let z = 0; z < options.length; z++) {
                if (options[z].value === event.target.dataset.value) {
                    if (options[z].selected) {
                        options[z].selected = false;
                        event.target.classList.remove("active");
                    } else {
                        options[z].selected = true;
                        event.target.classList.add("active");
                    }
                }

                if (options[z].selected) {
                    selectedItems.push(options[z].value);
                    selectedItemsText.push(options[z].innerHTML);
                }
            }

            let itemHtml = "";

            for (let k = 0; k < selectedItemsText.length; k++) {
                itemHtml = itemHtml + "<div class='agog-tag'>" + selectedItemsText[k] + "<div class='agog-tag-close' data-value='" + selectedItems[k] + "'><i class='fas fa-times'></i></div></div>";

            }

            parent.children[0].querySelector("span").innerHTML = itemHtml || items[sIndex].getAttribute("aria-placeholder") || settings.mainPlaceHolder;
            parent.dataset.selected = selectedItems.join(settings.delimiter);

            let tags = document.querySelectorAll(".agog-tag-close");

            for (let tIndex = 0; tIndex < tags.length; tIndex++) {
                const tag = tags[tIndex];

                tag.addEventListener('click', function (e) {
                    let tagId = e.target.dataset.value || e.target.parentNode.dataset.value;
                    document.querySelector("." + settings.subClass + " span[data-value='" + tagId + "']").click();
                    e.stopPropagation();
                })

            }
        }
    }

    

    return agogSelect;

});