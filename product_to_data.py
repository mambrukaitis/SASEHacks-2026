import json
import aldiScraper, tjScraper
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

def aldi():
    aldiScraper.aldiSearch()

def tj():
    tjScraper.tjSearch()

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
    

    user_term = input("\nEnter a product name to search: ")
    user_brand = input("Enter a brand to prioritize (optional): ")
    user_results = publix_search_json(user_term, user_brand)

    print(f"\nResults for '{user_term}' (brand: '{user_brand}'):\n")
    for r in user_results:
        print(r)