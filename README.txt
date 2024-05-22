
---22/05/2024-18:34--
package.json file contains information about your project's dependencies and their versions
package-lock.json" provides a detailed, version-specific dependency tree.

-------------------------------------------------------------------------------------------------

npm init -y
npm i express mysql dotenv hbs
sudo npm i --save nodemon

add
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
  },
in package.json

