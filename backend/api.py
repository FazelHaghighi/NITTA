import requests

def check_and_buy(good_price):
    response = requests.get("https://api.coinbase.com/v2/prices/buy?currency=USD")
    price = float(response.json()['data']['amount'])
    
    if price < good_price:
        print("Buy!")
    else:
        print("Price is too high to buy.")

    print(price)

my_good_price = 25000
check_and_buy(my_good_price)
