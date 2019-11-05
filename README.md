# Backend

REST API that recieves a JSON payload as POST, then returns the requested information that will be scapped from an external site via pupeteer

## Instructions

### Setup

Just run a `npm i` or `yarn`

### Development

**Most commands can be run appending `:watch` to watch for changes**

To start a the dev server just run (You can use npm too)

```
yarn start
```

You can lint the file running

```
yarn lint
```

And run the tests with

```
yarn test
```

### Development guide

This application is multi-tenant, you can create a new parser inside the parsers file, it'll be automatically loaded if the request payload has a "source" propriety with the same name as the parser folder.

To enable more verbose logs you can copy the `.env.example` file, removing the `.example`, this will run the application in the development mode by default.

### Manual test

**You must change the checkin and checkout date, and the server url, if this isn't working**

You can quickly try it with postwoman

https://bit.ly/2qrAKti (Sorry for the shortened link, you have to trust me in this one)

You can manually test via curl with

```bash
curl -X POST \
  https://leroy-hotel-scrapper.herokuapp.com/buscar \
  -H 'Accept: */*' \
  -H 'Accept-Encoding: gzip, deflate' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Length: 57' \
  -H 'Content-Type: application/json' \
  -H 'Host: leroy-hotel-scrapper.herokuapp.com' \
  -H 'Postman-Token: fb1f1999-61aa-4a90-81cb-996eae8266a0,33c1208d-74f7-4a98-bea3-4c67ee112492' \
  -H 'User-Agent: PostmanRuntime/7.19.0' \
  -H 'cache-control: no-cache' \
  -d '{
  "checkin": "29/11/2019",
  "checkout": "02/12/2019"
}'
```

or running it in a browser console with

```javascript
var data = JSON.stringify({
  checkin: '29/11/2019',
  checkout: '02/12/2019',
})

var xhr = new XMLHttpRequest()
xhr.withCredentials = true

xhr.addEventListener('readystatechange', function() {
  if (this.readyState === 4) {
    console.log(this.responseText)
  }
})

xhr.open('POST', 'https://leroy-hotel-scrapper.herokuapp.com/buscar')
xhr.setRequestHeader('Content-Type', 'application/json')
xhr.setRequestHeader('User-Agent', 'PostmanRuntime/7.19.0')
xhr.setRequestHeader('Accept', '*/*')
xhr.setRequestHeader('Cache-Control', 'no-cache')
xhr.setRequestHeader(
  'Postman-Token',
  'fb1f1999-61aa-4a90-81cb-996eae8266a0,838cf32e-87cc-4991-89b3-ed7055bd5bdb',
)
xhr.setRequestHeader('Host', 'leroy-hotel-scrapper.herokuapp.com')
xhr.setRequestHeader('Accept-Encoding', 'gzip, deflate')
xhr.setRequestHeader('Content-Length', '57')
xhr.setRequestHeader('Connection', 'keep-alive')
xhr.setRequestHeader('cache-control', 'no-cache')

xhr.send(data)
```
