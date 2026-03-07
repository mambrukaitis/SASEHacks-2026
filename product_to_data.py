import json
#import aldiScraper, tjScraper
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

#def aldi():
    aldiScraper.aldiSearch()

#def tj():
    tjScraper.tjSearch()

import re
import nltk

IGNORE_WORDS = {
    "oz","lb","lbs","g","kg","ml","l","ct","count","pack","pk",
    "box","bag","jar","bottle","can"
}

IGNORE_MODIFIERS = {
    "whole","reduced","fat","low","skim","organic","grassfed",
    "free","lactose","sweetened","unsweetened","plain","original"
}

def extract_category(title):

    title = title.split(",")[0]

    cleaned = re.sub(r'[^a-z0-9 ]', '', title.lower())
    tokens = nltk.word_tokenize(cleaned)
    tagged = nltk.pos_tag(tokens)

    for i in range(len(tagged) - 1, 0, -1):
        w1, p1 = tagged[i-1]
        w2, p2 = tagged[i]

        if w2 in IGNORE_WORDS or re.match(r'^\d', w2):
            continue

        if p2.startswith("NN") and (p1.startswith("JJ") or p1.startswith("NN")):

            if w2 == "milk":

                # keep meaningful milk types
                if w1 not in IGNORE_MODIFIERS:
                    return f"{w1} milk"

                return "milk"

            return f"{w1} {w2}"

    for word, pos in reversed(tagged):

        if word in IGNORE_WORDS:
            continue

        if re.match(r'^\d', word):
            continue

        if pos.startswith("NN"):
            return word

    return "unknown"

def publix_search_json(product, brand=""):

    product_phrase = re.sub(r'[^a-z0-9 ]', '', product.lower()).split()
    brand = brand.lower()

    brand_matches = []
    other_matches = []

    for item in PUBLIX_PRODUCTS:

        name = item.get("name", "")
        normalized_name = re.sub(r'[^a-z0-9 ]', '', name.lower())
        name_words = normalized_name.split()

        if (not item.get("brandName", "")):
            continue;
        brand_name = item.get("brandName", "").lower()

        for i in range(len(name_words) - len(product_phrase) + 1):

            if name_words[i:i + len(product_phrase)] == product_phrase:

                category = extract_category(name)

                result = {
                    "name": name,
                    "price": item.get("priceString"),
                    "store": "Publix",
                    "brand": item.get("brandName"),
                    "category": category
                }

                if brand and brand in brand_name:
                    brand_matches.append(result)
                else:
                    other_matches.append(result)

                break

    return brand_matches + other_matches
if __name__ == "__main__":
    

    user_term = input("\nEnter a product name to search: ")
    user_brand = input("Enter a brand to prioritize (optional): ")
    user_results = publix_search_json(user_term, user_brand)

    print(f"\nResults for '{user_term}' (brand: '{user_brand}'):\n")
    for r in user_results:
        print(r)