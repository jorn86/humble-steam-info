let tabs = {}
let cache = {}
let backgroundWindow = {}
let openInCurrentWindow = true
console.log("Reloaded")

chrome.runtime.onMessage.addListener((message, sender, reply) => {
    switch (message.type) {
        case "search": return search(message.name, reply)
        case "is_registered_tab": return isRegistered(sender.tab.id, reply)
        case "search_result": return complete(message.data, sender.tab.id, reply)
        case "clear_cache": return clearCache(reply)
        default: console.log("Unrecognized message type", message, "from", sender)
    }
})

function search(name, reply) {
    if (!!cache[name]) {
        reply(cache[name])
        return false
    } 

    doSearch(name, reply)
    return true
}

async function doSearch(name, reply) {
    let url = new URL("https://store.steampowered.com/search/") // manifest url requires trailing slash
    url.searchParams.append("term", name)
    if (openInCurrentWindow) {
        chrome.tabs.create({ url: url.href, active: false }).then((tab) => {
            tabs[tab.id] = { name: name, reply: reply }
        })
        return
    }

    if (backgroundWindow.query) {
        let windowId = (await backgroundWindow.query).id
        let windows = await chrome.windows.getAll()
        if (windows.some(it => it.id == windowId)) {
            chrome.tabs.create({ url: url.href, windowId: windowId, active: false }).then((tab) => {
                tabs[tab.id] = { name: name, reply: reply }
            })
            return
        }
    }
    backgroundWindow.query = chrome.windows.create({ focused: false, state: "minimized", url: url.href })
}

function isRegistered(tabId, reply) {
    reply(tabs[tabId])
    return false
}

function complete(data, tabId, reply) {
    let meta = tabs[tabId]
    cache[meta.name] = data
    meta.reply(data)
    delete tabs[tabId]
    reply(true)
    return false
}

function clearCache(reply) {
    cache = {}
    reply(true)
    return false
}
