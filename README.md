# Humble Bundle Steam info extension
This Chrome extension adds Steam details to the Humble Bundle overviews.
I want to add it to the Chrome Web store, but since Google only accepts credit cards to open an account
(while they can do direct debit for the Google Cloud account), that's not going to happen soon.
In the meantime, you can install the extension by following [these instructions](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest). 

## Before
![Before](before.png)

## After
![After](after.png)

The whole block is a link to the Steam store page.

It uses a simple Steam web search to find the correct game. However, since Steam doesn't order its search results
properly, sometimes it finds the wrong game. See for example the second result in the "After" image.
When the extension isn't sure if it's found the correct game, it'll add the name it found, 
so you can easily see if the displayed information is correct. It'll link to the Steam Search page in that case,
so you should be able to find the correct page yourself easily.

The extension opens Steam in tabs in the current window to find the information. Chrome doesn't allow me to hide those tabs,
so you may see them open up briefly while results are loaded. The advantage is that if you are logged into Steam,
all information is resolved using your profile, including localized prices, discounts and whether or not you already 
own the game. That information is added when available.

Do you like this extension? You can buy me a cup of coffee, or help pay for the Google Cloud hosting!

[![Donate with PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/donate/?business=SSLTV6CL5Q56A&no_recurring=1&currency_code=EUR)
