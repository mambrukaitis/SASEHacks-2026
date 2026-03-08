import json
import aldiScraper, tjScraper
import re
import nltk


try:
    with open("cleaned_final.json", "r", encoding="utf-8") as f:
        PUBLIX_PRODUCTS = json.load(f)
except json.JSONDecodeError as e:
    print("JSON decode error:", e)
    raise
except FileNotFoundError:
    print("File not found or path is incorrect")
    raise

def product_to_data(product):
    return publix_search_json(product)

def aldi(search: str):
    aldiScraper.aldiSearch(search)

def tj(search: str):
    tjScraper.tjSearch(search)


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

def price_to_float(price):
    if not price:
        return float("inf")
    return float(price.replace("$", ""))

def category_matches(query_category, result_category):
    """
    Smarter category match:
    - Single-word query: matches if the word appears as the main noun in result_category
    - Multi-word query: matches if all query words appear consecutively at the end of result_category
    """
    if not query_category or not result_category:
        return False

    # Clean and tokenize
    qc_tokens = re.sub(r'[^a-z0-9 ]', '', query_category.lower()).split()
    rc_tokens = re.sub(r'[^a-z0-9 ]', '', result_category.lower()).split()

    # Remove modifiers from result category
    main_tokens = [t for t in rc_tokens if t not in IGNORE_MODIFIERS]

    # Single-word query
    if len(qc_tokens) == 1:
        return qc_tokens[0] in main_tokens[-len(qc_tokens):]

    # Multi-word query
    else:
        query_slice = qc_tokens  # all words in the query
        # Check if query slice matches last words in main_tokens
        if main_tokens[-len(query_slice):] == query_slice:
            return True
        # Fallback: query slice appears anywhere consecutively in main_tokens
        for i in range(len(main_tokens) - len(query_slice) + 1):
            if main_tokens[i:i + len(query_slice)] == query_slice:
                return True

    return False

def publix_search_limited(product, brand=""):

    results = publix_search_json(product, brand)

    if not results:
        return []

    # determine category of the user's query
    query_category = extract_category(product)

    # if fewer than 10 results, filter by category match
    if len(results) > 5:
        filtered = [
            r for r in results
            if category_matches(query_category, r.get("category"))
        ]
        # fallback if filtering removed everything
        if len(filtered) > 5:
            return sorted(filtered[:5], key=lambda x: price_to_float(x.get("price")))
        else:
            if filtered:
                return sorted(filtered, key=lambda x: price_to_float(x.get("price")))
            return sorted(results[:5], key=lambda x: price_to_float(x.get("price"))) if len(results) > 5 else sorted(results, key=lambda x: price_to_float(x.get("price")))

    # otherwise return 10 cheapest
    results_sorted = sorted(results, key=lambda x: price_to_float(x.get("price")))
    return results_sorted[:5]

if __name__ == "__main__":

    user_term = input("\nEnter a product name to search: ")
    user_brand = input("Enter a brand to prioritize (optional): ")
    user_results = publix_search_limited(user_term, user_brand)

    print(f"\nResults for '{user_term}' (brand: '{user_brand}'):\n")
    for r in user_results:
        print(r)
