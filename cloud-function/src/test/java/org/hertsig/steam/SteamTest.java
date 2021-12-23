package org.hertsig.steam;

import org.junit.jupiter.api.Test;

import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class SteamTest {
    @Test
    public void testNoResult() throws IOException {
        var data = GetSteamInfo.getSteamPage("ffffffffffff");
        assertTrue(data.isEmpty());
    }

    @Test
    public void testNotFirstResult() throws IOException {
        var data = GetSteamInfo.getSteamPage("XIII");
        assertEquals("XIII", data.get("title"));
        assertEquals("https://store.steampowered.com/app/1154790/XIII", data.get("url"));
    }

    @Test
    public void testPartialMatch() throws IOException {
        var data = GetSteamInfo.getSteamPage("Syberia 3 Deluxe Edition");
        assertEquals("Syberia 3 - Deluxe Upgrade", data.get("title"));
        assertEquals("https://store.steampowered.com/app/625350/Syberia_3__Deluxe_Upgrade", data.get("url"));
    }

    @Test
    public void testFactorio() throws IOException {
        var data = GetSteamInfo.getSteamPage("Factorio");
        assertEquals("Factorio", data.get("title"));
        assertEquals("https://store.steampowered.com/app/427520/Factorio", data.get("url"));
        assertEquals("2500", data.get("priceCents"));
        assertEquals("25,--€", data.get("priceDisplay"));
        assertEquals("", data.get("originalPriceDisplay"));
    }

    @Test
    public void testShapez() throws IOException {
        var data = GetSteamInfo.getSteamPage("shapez.io");
        assertEquals("shapez.io", data.get("title"));
        assertEquals("https://store.steampowered.com/app/1318690/shapezio", data.get("url"));
        assertEquals("499", data.get("priceCents"));
        assertEquals("4,99€", data.get("priceDisplay"));
        assertEquals("9,99€", data.get("originalPriceDisplay"));
    }
}
