import requests

def aldiSearch():

    search = input("What do you want to look up? ")
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
    products = [p for p in products if not (search.lower() in ["pizza", "pasta"] and "sauce" in p["name"].lower())]

    sortedProducts = sorted(
        products, 
        key=lambda p: (p["price"]["amount"], p["name"].lower())
    )   

    result = []

    for p in sortedProducts[:5]:
        result.append({
        "name": p["name"] ,
        "price": p["price"]["amount"] / 100,
        "store": "Aldi's",
        "brand": p["brandName"]
        })

    return result

