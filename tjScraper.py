import requests
from google.cloud import aiplatform

client = OpenAI(api_key="AIzaSyASojgtoURViBqokvWHEbjS5tcAsVbSKP4")

def tjSearch():
  search = input("What do you want to look up? ")
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
  
  response = client.responses.create(
        model="gemini-1.5",
        input=f"""
    You are given a list of grocery products with titles and prices. 
    Only return products that are relevant to "{search}", ignoring ingredients, sauces, or unrelated items. 
    Keep the original price and sales size.

    Products: {products}
    Return the filtered list in valid JSON format.
    """
    )

  try:
        filtered_products = json.loads(response.output_text)
  except json.JSONDecodeError:
        print("Error parsing Gemini output. Using unfiltered products.")
        filtered_products = products

  if not filtered_products:
        print("No relevant products found after filtering.")
        return

    # Sort by price then name
  sorted_products = sorted(
        filtered_products,
        key=lambda p: (p["retail_price"], p["item_title"].lower())
    )

    # Print cheapest relevant product
  product = sorted_products[0]
  name = product["item_title"]
  size = f'{product["sales_size"]} {product["sales_uom_description"]}'
  price = product["retail_price"]

  print(f"{name}, {size}, ${price}")
  
  # category = products[0]["category_hierarchy"][-1]["name"]

  # products = [p for p in products if p["category_hierarchy"][-1]["name"] == category]
  # products = [p for p in products if not (search in ["pizza", "pasta"] and "sauce" in p["item_title"].lower())]

  # sortedProducts = sorted(
  #   products,
  #   key=lambda p: (p["retail_price"], p["item_title"].lower())
  # )

  # name = sortedProducts[0]["item_title"]
  # size = str(sortedProducts[0]["sales_size"]) + " " + sortedProducts[0]["sales_uom_description"]
  # price = sortedProducts[0]["retail_price"]
  
  # print(name + ", " + size + " , $" + str(price))


tjSearch()