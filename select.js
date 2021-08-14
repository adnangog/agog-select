let items = document.querySelectorAll("[data-agog-selector]");

for (let ii = 0; ii < items.length; ii++) {
    const originalSelect = items[ii];

    originalSelect.style.display = "none";

    let isMultiple = originalSelect.getAttribute("multiple");

    let url = originalSelect.dataset.url;
    let valueField = originalSelect.dataset.valueField;
    let textField = originalSelect.dataset.textField;

    let thisSelect = document.createElement("div");
    thisSelect.classList.add("agog-select");

    let title = document.createElement("div");
    title.classList.add("agog-title");

    let titleSpan = document.createElement("span");
    titleSpan.classList.add("inner");
    titleSpan.innerHTML = originalSelect.getAttribute("aria-placeholder") || "Lütfen Seçiniz";
    title.appendChild(titleSpan);

    if (isMultiple !== null) {
        thisSelect.dataset.multiple = true;
    } else {
        let titleEmpty = document.createElement("span");
        titleEmpty.classList.add("agog-empty");
        titleEmpty.style.display = "none";
        titleEmpty.innerHTML = "<i class='fas fa-times'></i>";

        title.appendChild(titleEmpty);
    }
    

    let sub = document.createElement("div");
    sub.classList.add("agog-sub");

    let search = document.createElement("div");
    search.classList.add("agog-search");
    let searchText = document.createElement("input");
    searchText.setAttribute("type", "text");
    searchText.setAttribute("placeholder", "filtrele");
    let clearFilter = document.createElement("div");
    clearFilter.innerHTML = "<i class='fas fa-times'></i>";
    clearFilter.classList.add("agog-clear");


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

setTimeout(function () { setElements() }, 2000);

function setElements() {
    let selectItems = document.querySelectorAll(".agog-select");

    for (let itemIndex = 0; itemIndex < selectItems.length; itemIndex++) {
        let sIndex = itemIndex;
        const item = selectItems[itemIndex];

        let isMultiple = item.dataset.multiple;

        item.children[0].querySelector("span.inner").addEventListener('click', function () {
            item.classList.toggle("active");
            if (item.classList.contains("active")) {
                setTimeout(function () {
                    item.children[1].querySelector(".agog-search input").focus();
                }, 200);
            }
        })

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

        if (!isMultiple) {
            item.children[0].querySelector("span.agog-empty").addEventListener('click', function (e) {

                item.children[0].querySelector("span.inner").innerHTML = items[sIndex].getAttribute("aria-placeholder") || "Lütfen Seçiniz";
                item.children[0].querySelector("span.agog-empty").style.display = "none";

                item.removeAttribute("data-selected");

                let childItems = item.dataset.optionGroup ? item.children[1].querySelectorAll(".agog-search,span") : item.children[1].children;

                for (let z = 0; z < childItems.length; z++) {
                    childItems[z].classList.remove("active");
                }

                for (let z = 0; z < options.length; z++) {
                    options[z].selected = false;
                }

            })
        }

        item.addEventListener('mouseleave', function (e) {
            item.classList.remove("active");
        })

        let childItems = item.dataset.optionGroup ? item.children[1].querySelectorAll(".agog-search,span") : item.children[1].children;

        for (let index = 0; index < childItems.length; index++) {


            if (childItems[index].tagName === "SPAN") {
                childItems[index].addEventListener('click', function (event) {

                    if (!isMultiple) {
                        item.children[0].querySelector("span").innerHTML = event.target.innerHTML;
                        item.dataset.selected = event.target.dataset.value;

                        item.children[0].querySelector("span.agog-empty").style.display = "block";

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

                        item.children[0].querySelector("span").innerHTML = itemHtml || items[sIndex].getAttribute("aria-placeholder") || "Lütfen Seçiniz";
                        item.dataset.selected = selectedItems.join(",");

                        let tags = document.querySelectorAll(".agog-tag-close");

                        for (let tIndex = 0; tIndex < tags.length; tIndex++) {
                            const tag = tags[tIndex];

                            tag.addEventListener('click', function (e) {
                                let tagId = e.target.dataset.value || e.target.parentNode.dataset.value;
                                document.querySelector(".agog-sub span[data-value='" + tagId + "']").click();
                                e.stopPropagation();
                            })

                        }
                    }
                })
            } else {

                childItems[index].children[0].addEventListener('keyup', function (event) {
                    itemsFilter(childItems, event);
                })

                childItems[index].children[1].addEventListener('click', function () {
                    childItems[index].children[0].value = "";
                    itemsFilter(childItems);
                })
            }

        }

    }
}

function itemsFilter(elements, event) {

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

