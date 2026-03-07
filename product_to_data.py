import json
import requests

with open("publix_products.json", "r", encoding="utf-8") as f:
    PUBLIX_PRODUCTS = json.load(f)


def product_to_data(product):
    return publix_search_json(product)

def aldi_search(search: str) -> dict:

    url = "https://api.aldi.us/v3/product-search?currency=USD&serviceType=pickup&q=" + search + "&limit=60&offset=0&sort=relevance&testVariant=A&servicePoint=474-109"

    headers = {
        "accept-language": "en-US",
        "referer": "https://www.aldi.us/",
        "sec-ch-ua": '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36"
    }

    response = requests.get(url, headers=headers)

    data = response.json()
    products = data["data"]
    products = [p for p in products if search in p["name"].lower()]
    sorted_products = sorted(products, key=lambda p: p["price"]["amount"])

    top3 = sorted_products[:3]
    
    for p in top3:
        name = p["name"] + p["brandName"]
        price = p["price"]["amount"] / 100  

def publix_search_json(product, brand=""):
    product = product.lower()
    brand = brand.lower()

    matches = []
    brand_matches = []

    for item in PUBLIX_PRODUCTS:
        name = item.get("name", "").lower()
        brand_name = item.get("brandName", "").lower()

        if product in name:
            if brand and brand in brand_name:
                brand_matches.append(item)
            else:
                matches.append(item)

    #all matches
    return brand_matches + matches
