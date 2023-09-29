# What is this?

This is a simple thing that proxies the discord client replacing the
`GLOBAL_ENV` to the one defined in the `environments.json` file

# How to use it?

Add your server's endpoints to environments.json
([See example here](./environments.example.json)) then launch the proxy using
`deno task dev [environment name]` and go to `http://localhost:3000/app`
