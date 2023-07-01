# Instructions for building API client

1) Delete the src/libs/api-client folder
2) Run the application, open https://localhost:44442/swagger/v1/swagger.json, and save in src/libs
3) Run the following on the command line: `npm run generate-client-sdk`

Note that it is not currently possible to run the generator without saving the Swagger definition
first, due to the fact that the Swagger definition is served with a self-signed certificate which
is not supported by openapi-generator-cli