import json
import requests
import re

try:
    with open("publix_data.json", "r", encoding="utf-8") as f:
        PUBLIX_PRODUCTS = json.load(f)
except json.JSONDecodeError as e:
    print("JSON decode error:", e)
    raise
except FileNotFoundError:
    print("File not found or path is incorrect")
    raise


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
    """
    Searches products for a given name with optional brand prioritization.
    Matches only if the consecutive words in the input appear consecutively in the product name.
    """
    product_phrase = re.sub(r'[^a-z0-9 ]', '', product.lower()).split()  # split input into words
    brand = brand.lower()

    brand_matches = []
    other_matches = []

    for item in PUBLIX_PRODUCTS:
        # normalize JSON name
        name_words = re.sub(r'[^a-z0-9 ]', '', item.get("name", "").lower()).split()
        if(item.get("brandName", "")):
            brand_name = item.get("brandName", "").lower()

        

        # Check if product_phrase appears consecutively in name_words
        for i in range(len(name_words) - len(product_phrase) + 1):
            if name_words[i:i + len(product_phrase)] == product_phrase:
                result = {
                    "name": item.get("name"),
                    "price": item.get("priceString"),
                    "store": "Publix",
                    "brand": item.get("brandName")
                }
                if brand and brand in brand_name:
                    brand_matches.append(result)
                else:
                    other_matches.append(result)
                break  # stop checking this product after first match

    return brand_matches + other_matches

if __name__ == "__main__":
    # Example 1: hardcoded search
    search_term = "cottage cheese"
    brand = ""  # leave empty if you don't want to prioritize a brand
    results = publix_search_json(search_term, brand)

    print(f"Results for '{search_term}':\n")
    for r in results:
        print(r)

    # Example 2: interactive input from user
    user_term = input("\nEnter a product name to search: ")
    user_brand = input("Enter a brand to prioritize (optional): ")
    user_results = publix_search_json(user_term, user_brand)

    print(f"\nResults for '{user_term}' (brand: '{user_brand}'):\n")
    for r in user_results:

        print(r)
