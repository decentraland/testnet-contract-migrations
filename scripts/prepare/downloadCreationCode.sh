#!/bin/bash

# Using an sh command instead of a normal javascript fetch because for some reason, etherscan.io does not return the creation code when using a normal fetch.
# This works... so yeah... :rocket:

curl $ETHERSCAN_URL'/address/'$CONTRACT_ADDRESS \
  -H 'authority: etherscan.io' \
  -H 'accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cache-control: max-age=0' \
  -H 'cookie: etherscan_cookieconsent=True; _ga=GA1.2.2096254222.1675263996; displaymode=d; __stripe_mid=516e9fbe-1460-42bb-bc3b-7f15e5cbe1392432d3; etherscan_pwd=4792:Qdxb:aBbgvNhVM0xFp9zRsxVzo3WKduaUz2bBxJ4Jj4iMHOgOYvMx8hcxTpgbbCh/UAEU; etherscan_userid=zavaliafernando; etherscan_autologin=True; cf_clearance=xlsN9EuZ7ympqUSo5VAZdnPDJjx_9yZL9D100tNO6F4-1687462867-0-150; __cflb=02DiuFnsSsHWYH8WqVXbZzkeTrZ6gtmGVdEUTrjeLkjvL; ASP.NET_SessionId=eixamymhk5vtjtfykccy0se0; __cuid=7b5e4096284246f78df416d8cd5636f7; amp_fef1e8=7c6ad469-5f84-4928-8c68-d80d4acb057eR...1h3ve0c1t.1h3ve2mst.u.7.15; __cf_bm=ysMOx8qS45zuZ7B3bjOmJWABzxoSCAFmiPWA5UpIzxw-1687904870-0-AeHnZNJ6TLtrZ8GgtGUUFS4QeG19RR66zNNSQw48c7wC1/UOQXVQ19wSWF6dFHzbDQ==' \
  -H 'dnt: 1' \
  -H 'referer: https://contracts.decentraland.org/' \
  -H 'sec-ch-ua: "Not.A/Brand";v="8", "Chromium";v="114"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: document' \
  -H 'sec-fetch-mode: navigate' \
  -H 'sec-fetch-site: same-origin' \
  -H 'sec-fetch-user: ?1' \
  -H 'upgrade-insecure-requests: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36' \
  --compressed
