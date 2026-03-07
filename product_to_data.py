import json

with open("publix_products.json", "r", encoding="utf-8") as f:
    PUBLIX_PRODUCTS = json.load(f)


def product_to_data(product):
    return publix_search_json(product)


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
