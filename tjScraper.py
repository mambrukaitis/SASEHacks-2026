import requests

def tjSearch(search: str):
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
        category_hierarchy {
          id
          name
        }
        sales_size
        sales_uom_description
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

  r = requests.post(url, json=payload, headers=headers)
  data = r.json()

  products = data["data"]["products"]["items"]

  if not products:
    return
  
  category = products[0]["category_hierarchy"][-1]["name"]

  products = [p for p in products if not (search.lower() in ["pizza", "pasta"] and "sauce" in p["item_title"].lower())]
  products = [p for p in products if p["category_hierarchy"][-1]["name"] == category]

  sortedProducts = sorted(
    products,
    key=lambda p: (p["retail_price"], p["item_title"].lower())
  )

  result = []

  for p in sortedProducts[:5]:
    result.append({
      "name": p["item_title"] + " " + str(p["sales_size"]) + " " + p["sales_uom_description"],
      "price": float(p["retail_price"]),
      "store": "Trader Joe's",
      "brand": "Trader Joe's"
    })

  return result
  