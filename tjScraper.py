import requests

search = "pizza"
#input("What do you want to look up? ")
url = "https://www.traderjoes.com/api/graphql"

payload = {
    "operationName": "SearchProducts",
    "variables": {
        "storeCode": "764",
        "availability": "1",
        "published": "1",
        "search": search,
        "currentPage": 1,
        "pageSize": 15
    },
    "query": """
query SearchProducts($search: String, $pageSize: Int, $currentPage: Int, $storeCode: String = "764", $availability: String = "1", $published: String = "1") {
  products(
    search: $search
    filter: {
      store_code: {eq: $storeCode}
      published: {eq: $published}
      availability: {match: $availability}
    }
    pageSize: $pageSize
    currentPage: $currentPage
  ) {
    items {
      item_title
      retail_price
    }
  }
}
"""
}

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Content-Type": "application/json",
    "Origin": "https://www.traderjoes.com",
    "Referer": "https://www.traderjoes.com/home/search?q=" + search + "&global=yes",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Dest": "empty"
}
 
response = requests.post(url, json=payload, headers=headers)
data = response.json()

products = data["data"]["products"]["items"]


for i, product in enumerate(products):
    print(f"Product {i}: {product.get('item_title', 'Unknown')}")
    print("Keys available:", list(product.keys()))
    print()

# sortedProducts = sorted(products, key=lambda p: p["retail_price"])

# top3 = sortedProducts[:3]

# for p in top3:
#     name = p["item_title"]
#     price = p["retail_price"]
#     print(name, price)