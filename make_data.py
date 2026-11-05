"""Creates data/sales.json (sample data) for the chart on the portfolio.
Run:  python make_data.py
Edit the numbers below to use your own data."""
import json

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
sales = [42, 38, 55, 61, 58, 74]

rows = [{"month": m, "sales": s} for m, s in zip(months, sales)]
with open("data/sales.json", "w") as f:
    json.dump(rows, f, indent=2)
print("Saved data/sales.json with", len(rows), "rows; total =", sum(sales))
