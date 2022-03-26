(async () => {
    chrome.runtime.sendMessage({ type: "is_registered_tab" }, function(response) {
        if (!response) return

        chrome.runtime.sendMessage({ type: "search_result", data: search(response.name) }, function(response) {
            console.log("Closing")
            window.close()
        })
    })
})()

function search(name) {
    let elements = Array.from(document.getElementsByClassName("search_result_row"))
    elements.sort((a, b) => score(name, b) - score(name, a))
    let element = elements[0]

    if (!element || score(name, element) == 0) {
        console.log("No results for", name)
        return {}
    }

    let titleElement = element.getElementsByClassName("title")[0]
    let priceElement = element.getElementsByClassName("search_price")[0]
    let priceElementNodes = priceElement.childNodes
    let price = priceElementNodes[priceElementNodes.length - 1].textContent.trim()
    let originalPriceElement = element.getElementsByTagName("strike")[0]
    let discountElement = element.getElementsByClassName("search_price_discount_combined")[0]
    let owned = element.getElementsByClassName("ds_owned_flag").length > 0

    return {
        title: titleElement.textContent.trim(),
        url: element.getAttribute("href"),
        priceDisplay: price,
        originalPriceDisplay: originalPriceElement ? originalPriceElement.textContent : "",
        discount: discountElement.getElementsByClassName("search_discount").textContent,
        owned: owned,
    }
}

function score(name, element) {
    let actualName = element.getElementsByClassName("title")[0].textContent
    if (actualName === name) {
        return 99
    }
    let words = keywords(name)
    let actualWords = keywords(actualName)
    let same = words.filter(it => actualWords.includes(it))

    if (words.length == same.length && actualWords.length == same.length) {
        return 98
    }
    return same.length
}

function keywords(name) {
    return name.toLowerCase().split(/[\s.,/&()\[\]_\-:;]+/)
        .map(it => it.trim())
        .filter(it => it.length > 1)
        .filter(it => it !== "vol")
}
