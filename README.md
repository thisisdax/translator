#### Installation
1. You may choose to fork and git clone this repo.
2. Open up your terminal and type `npm install` on the directory you have cloned this repo to.
3. Type `npm install --save nodemon`
3. Ensure that you have MongoDB installed.
  - Proceed to https://www.mongodb.com/ to download and install if you don't have it.
4. Create a default.json file under config folder
  - Proceed to https://tech.yandex.com/translate/ to claim your free API key.
  - Inside default.json type in `{ "API_KEY": "FREE_API_KEY"}`
  - Replace `FREE_API_KEY` with the key you got from Yandex.
  - Save your default.json file.
5. On your terminal, type `mongod` to run your MongoDB. Proceed with the following,
  - `npm test` for the test.
  - `npm run dev` for development environment. Accessed by typing http://localhost:3000 into your browser
  - `npm start` for production environment. Accessed by typing http://localhost:8000 into your browser
6. Once you have done the above, you may access the app through the link via your browser.

#### How to use
1. Choose under "From" dropdownlist to select the input language you are translating.
2. Choose under "To" dropdownlist to select the output language you want.
3. Type in the textbox your wanted translation text, and click on submit.
4. Click on the back button on your browser to return to the first page.

#### Dependencies
* [express](https://www.npmjs.com/package/express)
* [config](https://www.npmjs.com/package/config)
* [request](https://www.npmjs.com/package/request)
* [mocha](https://www.npmjs.com/package/mocha)
* [supertest](https://www.npmjs.com/package/supertest)
* [should](https://www.npmjs.com/package/should)

Powered by Yandex.Translate
