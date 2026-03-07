import json
<<<<<<< HEAD
=======
import aldiScraper, tjScraper
>>>>>>> 9c04cf8ffafab93ffa10027b9c1c5338450324a0
import re
import nltk
from nltk import pos_tag, word_tokenize

# Ensure NLTK can find its data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Load Publix data
try:
    with open("publix_data.json", "r", encoding="utf-8") as f:
        PUBLIX_PRODUCTS = json.load(f)
except Exception as e:
    print("Error loading JSON:", e)
    raise

def product_to_data(product):
    return publix_search_json(product)

<<<<<<< HEAD
def clean_token(token):
    """Normalize token: lowercase, strip punctuation/apostrophes."""
    return re.sub(r'[^A-Za-z0-9]', '', token).lower()

def extract_main_noun(text, brand_words=None):
    """
    Extract the main noun(s) from product title, skipping brand tokens and modifiers.
    Returns compound noun if consecutive nouns found.
    """
    tokens = word_tokenize(text)
    pos_tags = pos_tag(tokens)

    brand_words_lower = [clean_token(w) for w in brand_words] if brand_words else []

    # Common adjectives/modifiers to skip
    modifiers = {
        'large', 'small', 'medium', 'fat', 'lowfat', 'reduced', 'free',
        'min', 'minimum', 'low', 'active', 'whole', 'skim', 'nonfat'
    }

    main_nouns = []
    for word, pos in pos_tags:
        token_clean = clean_token(word)
        if token_clean in brand_words_lower or token_clean in modifiers or pos in ('CD',):
            continue
        if pos.startswith('NN'):
            main_nouns.append(word)
        elif main_nouns:  # stop if we already started a noun phrase
            break
=======
def aldi_search(search: str):
    aldiScraper.aldiSearch()
    
def TJ_search(search: str) -> dict:
    tjScraper.tjSearch()
>>>>>>> 9c04cf8ffafab93ffa10027b9c1c5338450324a0

    if main_nouns:
        return ' '.join(main_nouns)  # combine consecutive nouns
    else:
        # fallback: last noun in title
        fallback_nouns = [word for word, pos in reversed(pos_tags)
                          if pos.startswith('NN') and clean_token(word) not in brand_words_lower]
        return ' '.join(fallback_nouns[:2]) if fallback_nouns else None

def publix_search_json(product, brand=""):
    product_phrase = re.sub(r'[^a-z0-9 ]', '', product.lower()).split()
    brand_lower = brand.lower()

    brand_matches = []
    other_matches = []

    for item in PUBLIX_PRODUCTS:
        name_words = re.sub(r'[^a-z0-9 ]', '', item.get("name", "").lower()).split()
        item_brand = item.get("brandName", "")
        item_brand_lower = item_brand.lower() if item_brand else ""

        # Detect main noun(s), skipping brand words
        brand_tokens = item_brand.split() if item_brand else []
        main_noun = extract_main_noun(item.get("name", ""), brand_words=brand_tokens)

        # Check for consecutive-word match
        for i in range(len(name_words) - len(product_phrase) + 1):
            if name_words[i:i + len(product_phrase)] == product_phrase:
                result = {
                    "name": item.get("name"),
                    "price": item.get("priceString"),
                    "store": "Publix",
                    "brand": item_brand,
                    "noun": main_noun
                }
                if brand_lower and brand_lower in item_brand_lower:
                    brand_matches.append(result)
                else:
                    other_matches.append(result)
                break

    return brand_matches + other_matches

if __name__ == "__main__":
    search_term = "cottage cheese"
    brand = ""
    results = publix_search_json(search_term, brand)
    print(f"Results for '{search_term}':\n")
    for r in results:
        print(r)

    user_term = input("\nEnter a product name to search: ")
    user_brand = input("Enter a brand to prioritize (optional): ")
    user_results = publix_search_json(user_term, user_brand)
    print(f"\nResults for '{user_term}' (brand: '{user_brand}'):\n")
    for r in user_results:
        print(r)