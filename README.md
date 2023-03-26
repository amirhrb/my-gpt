## Setup

1. If you don’t have Node.js installed, [install it from here](https://nodejs.org/en/) (Node.js version >= 14.6.0 required)

2. Clone this repository

3. Navigate into the project directory

   ```bash
   $ cd my-gpt
   ```

4. Install the requirements

   ```bash
   $ npm install
   ```

5. Make a copy of the example environment variables file

6. Add your [API key](https://platform.openai.com/account/api-keys), secret for encryption and secretKey as password to the newly created `.env` file,
   like this:

   ```bash
   # Do not share your OpenAI API key with anyone! It should remain a secret.
   OPENAI_API_KEY= #your openAi api key
   ACCESS_KEY= #your password
   SECRET_KEY= #encryption secret(better to be at least 15 letter nonsense string)

   ```

7. Run the app

   ```bash
   $ npm run dev
   ```

You should now be able to access the app at [http://localhost:3000](http://localhost:3000).
