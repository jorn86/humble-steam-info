function steamUpdate() {
    document.getElementById("hide-redeemed").onclick = delayedUpdate
    for (let element of document.querySelectorAll("div.js-jump-to-page")) {
        element.onclick = delayedUpdate
    }
    for (let element of document.querySelectorAll("td.game-name")) {
        let nameElement = element.querySelector("h4")
        if (nameElement == null) {
            console.log("Couldn't locate name element for " + element)
            continue
        }
        
        let expectedName = nameElement.textContent
        let steam = element.appendChild(el("a", steam => {
            steam.className = "steam"
            steam.href = "https://store.steampowered.com/search?term=" + encodeURIComponent(expectedName)
            steam.target = "blank"
            steam.innerHTML = "Loading Steam info..."
        }))
        loadSteamData(expectedName, steam)
    }
}

function delayedUpdate() { setTimeout(steamUpdate, 1000) }

steamUpdate()
