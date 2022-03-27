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
        let steam = element.insertBefore(el("a", steam => {
            steam.className = "steam"
            steam.href = "https://store.steampowered.com/search?term=" + encodeURIComponent(expectedName)
            steam.target = "blank"
            steam.innerHTML = "Loading Steam info..."
        }), flavorElement)

        loadSteamData(expectedName, steam)
    }
})()
