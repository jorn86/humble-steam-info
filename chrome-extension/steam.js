(async () => {
    for (let element of document.querySelectorAll("div.tier-item-view")) {
        let nameElement = element.querySelector("span.item-title")
        if (nameElement == null) {
            console.log("Couldn't locate name element for " + element)
            continue
        }

        let flavorElement = element.querySelector("span.item-flavor-text");
        if (flavorElement == null || flavorElement.textContent === "Comic") {
            continue
        }

        let url = new URL("https://europe-west3-hertsig-hosting.cloudfunctions.net/humble-steam-id")
        let expectedName = nameElement.textContent;
        url.searchParams.append("name", expectedName)
        await fetch(url)
            .then(r => r.json())
            .then(data => {
                if (!data.url) return

                if (expectedName !== data.title) {
                    element.appendChild(el("a", name => {
                        name.className = "steam-name"
                        name.href = "https://store.steampowered.com/search?term=" + encodeURIComponent(expectedName)
                        name.target = "blank"
                        name.innerHTML = data.title
                    }))
                }

                element.appendChild(el("a", steam => {
                    steam.className = "steam"
                    steam.href = data.url
                    steam.target = "blank"

                    if (data.discount !== "") {
                        steam.appendChild(el("div", discount => {
                            discount.className = "steam-discount"
                            discount.innerHTML = data.discount
                        }))
                    }

                    steam.appendChild(el("div", price => {
                        price.className = "steam-price"
                        if (data.originalPriceDisplay) {
                            price.appendChild(el("div", original => {
                                original.className = "steam-price-original"
                                original.innerHTML = data.originalPriceDisplay
                            }))
                        }
                        price.appendChild(el("div", current => {
                            current.className = "steam-price-current"
                            if (data.priceDisplay !== "") {
                                current.innerHTML = data.priceDisplay
                            } else {
                                current.innerHTML = "Not released yet"
                            }
                        }))
                    }))
                }))
            })
            .catch(e => console.log("Catch / Request failed: " + e))
    }
})()

function el(tagName, init) {
    let element = document.createElement(tagName)
    init(element)
    return element
}
