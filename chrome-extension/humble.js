function loadSteamData(expectedName, steam) {
    chrome.runtime.sendMessage({ type: "search", name: expectedName }, function(response) {
        if (!response.url) {
            steam.innerHTML = 'Steam: No results'
            return
        }
        
        // Discount debug for when there's no discounted game in any bundle
        // if (Math.random() > 0.5) {
        //     response.discount = '-30%'
        //     response.originalPriceDisplay = '20.99'
        // }

        steam.href = response.url
        steam.innerHTML = ''
        
        if (expectedName !== response.title) {
            steam.appendChild(el("a", name => {
                name.className = "steam-name"
                name.href = "https://store.steampowered.com/search?term=" + encodeURIComponent(expectedName)
                name.target = "blank"
                name.innerHTML = response.title
                name.title = response.title
            }))
        }

        steam.appendChild(el("div", priceRow => {
            priceRow.className = 'steam-price-row'

            priceRow.appendChild(el("div", current => {
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

            if (response.originalPriceDisplay) {
                priceRow.appendChild(el("div", original => {
                    original.className = "steam-price-original"
                    original.innerHTML = response.originalPriceDisplay
                }))
            }

            if (!!response.discount) {
                priceRow.appendChild(el("div", discount => {
                    discount.className = "steam-discount"
                    discount.innerHTML = response.discount
                }))
            }
        }))
    })
}

function el(tagName, init) {
    let element = document.createElement(tagName)
    init(element)
    return element
}
