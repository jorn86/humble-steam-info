package org.hertsig.steam;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import com.google.common.annotations.VisibleForTesting;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.google.gson.Gson;
import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import org.glassfish.jersey.client.JerseyClientBuilder;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.TextNode;

import javax.annotation.Nonnull;
import java.io.IOException;
import java.io.InputStream;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class GetSteamInfo implements HttpFunction {
    private static final Gson GSON = new Gson();
    private static final Client CLIENT = JerseyClientBuilder.newBuilder()
            .build();
    private static final LoadingCache<String, Map<String, String>> CACHE = CacheBuilder.newBuilder()
            .build(new Loader());
    private static final Set<String> EXCLUDES = Set.of("vol");

    @Override
    public void service(HttpRequest request, HttpResponse response) throws Exception {
        response.appendHeader("Access-Control-Allow-Origin", "https://www.humblebundle.com");
        if ("OPTIONS".equals(request.getMethod())) {
            response.setStatusCode(204);
            return;
        }

        String name = request.getFirstQueryParameter("name").orElse("");
        response.appendHeader(HttpHeaders.CONTENT_TYPE, "application/json");
        try {
            GSON.toJson(CACHE.get(name), response.getWriter());
        } catch (ExecutionException e) {
            e.printStackTrace();
            response.setStatusCode(418);
            response.getWriter().write("\"Steam page structure has changed, cannot parse\"");
        }
    }

    @VisibleForTesting
    static Map<String, String> getSteamPage(String name) throws IOException {
        Response res = CLIENT.target("https://store.steampowered.com/search")
                .queryParam("term", name)
                .request()
                .header(HttpHeaders.USER_AGENT, "https://github.com/jorn86/humble-steam-info")
                .get();
        try (InputStream stream = res.readEntity(InputStream.class)) {
            Document document = Jsoup.parse(stream, "UTF-8", "https://store.steampowered.com/");
            Element element = document.getElementsByClass("search_result_row").stream()
                    .limit(30)
                    .max(Comparator.comparing(e -> score(name, e)))
                    .filter(e -> score(name, e) > 0)
                    .orElse(null);

            if (element == null) {
                System.out.println("No results for " + name);
                return Map.of();
            }

            Element priceElement = element.getElementsByClass("search_price").first();
            Element originalPriceElement = priceElement.getElementsByTag("strike").first();
            Element discountElement = element.getElementsByClass("search_price_discount_combined")
                    .first();
            List<TextNode> priceNodes = priceElement.textNodes();

            String title = element.getElementsByClass("title").text();
            String url = element.attr("href");
            url = url.substring(0, url.lastIndexOf('/'));
            String discount = discountElement.getElementsByClass("search_discount").text();
            String priceCents = discountElement.attr("data-price-final");
            String originalPrice = originalPriceElement == null ? "" : originalPriceElement.text().strip();
            String displayPrice = priceNodes.get(priceNodes.size() - 1).text().strip();
            Map<String, String> data = Map.of("title", title,
                    "url", url,
                    "priceCents", priceCents,
                    "priceDisplay", displayPrice,
                    "discount", discount,
                    "originalPriceDisplay", originalPrice);
            System.out.println("Returning success for " + name + ": " + data);
            return data;
        }
    }

    private static int score(String name, Element element) {
        String actualName = element.getElementsByClass("title").text();
        if (name.strip().equals(actualName.strip())) {
            return Integer.MAX_VALUE;
        }
        Set<String> expected = keywords(name);
        expected.retainAll(keywords(actualName));
        return expected.size();
    }

    private static Set<String> keywords(String name) {
        String[] words = name.toLowerCase().split("[\\s.,/&()\\[\\]_\\-:;]+");
        return Stream.of(words)
                .filter(it -> !it.isBlank())
                .filter(it -> it.length() > 1 || Character.isDigit(it.charAt(0)))
                .filter(it -> !EXCLUDES.contains(it))
                .collect(Collectors.toSet());
    }

    private static class Loader extends CacheLoader<String, Map<String, String>> {
        @Override @Nonnull
        public Map<String, String> load(@Nonnull String name) throws Exception {
            return getSteamPage(name);
        }
    }
}
