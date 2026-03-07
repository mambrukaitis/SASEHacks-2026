import json
import os

# File paths
script_dir = os.path.dirname(os.path.abspath(__file__))
input_files = [
    os.path.join(script_dir, "publix_data.json"),
    os.path.join(script_dir, "publix_data2.json")
]
output_file = os.path.join(script_dir, "cleaned.json")

combined_data = []

# Load both files using the same method that worked for single file
for file_path in input_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                combined_data.extend(data)
            else:
                print(f"Warning: {file_path} does not contain a top-level list. Skipping.")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")

print(f"Loaded {len(combined_data)} total items from both files.")

# Remove duplicates based on (name, priceString)
seen = set()
unique_data = []
duplicates_count = 0

for item in combined_data:
    name = item.get("name")
    price = item.get("priceString")
    if name is None or price is None:
        continue
    key = (name, price)
    if key in seen:
        duplicates_count += 1
    else:
        seen.add(key)
        unique_data.append(item)

# Save cleaned JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(unique_data, f, indent=4, ensure_ascii=False)

print(f"Removed {duplicates_count} duplicates. Cleaned data saved to '{output_file}'.")