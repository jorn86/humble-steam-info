(async () => {
    for (let element of document.querySelectorAll("div.tier-item-view")) {
        let nameElement = element.querySelector("span.item-title")
        if (nameElement == null) {
            console.log("Couldn't locate name element for " + element)
            continue
        }

        let flavorElement = element.querySelector("span.item-flavor-text")
        if (flavorElement == null || flavorElement.textContent === "Comic") {
            continue
        }
        
        let expectedName = nameElement.textContent
        chrome.runtime.sendMessage({ type: "search", name: expectedName }, function(response) {
            if (!response.url) return

            if (expectedName !== response.title) {
                element.appendChild(el("a", name => {
                    name.className = "steam-name"
                    name.href = "https://store.steampowered.com/search?term=" + encodeURIComponent(expectedName)
                    name.target = "blank"
                    name.innerHTML = response.title
                }))
            }

            element.appendChild(el("a", steam => {
                steam.className = "steam"
                steam.href = response.url
                steam.target = "blank"

                if (!!response.discount) {
                    steam.appendChild(el("div", discount => {
                        discount.className = "steam-discount"
                        discount.innerHTML = response.discount
                    }))
                }

                steam.appendChild(el("div", price => {
                    price.className = "steam-price"
                    if (response.originalPriceDisplay) {
                        price.appendChild(el("div", original => {
                            original.className = "steam-price-original"
                            original.innerHTML = response.originalPriceDisplay
                        }))
                    }
                    price.appendChild(el("div", current => {
                        current.className = "steam-price-current"
                        if (response.priceDisplay !== "") {
                            current.innerHTML = response.priceDisplay
                        } else {
                            current.innerHTML = "Not released yet"
                        }
                        if (response.owned) {
                            current.innerHTML += " (Owned)"
                        }
                    }))
                }))
            }))
        })
    }
})()

function el(tagName, init) {
    let element = document.createElement(tagName)
    init(element)
    return element
}
