# What is this?

This is a simple thing that proxies the discord client replacing the
`GLOBAL_ENV` to the one defined in the `builds/builds.json` file

# How to use it?

Add your server's endpoints to builds/builds.json
([See example here](./builds/builds.example.json)) then launch the proxy using
`deno task dev [environment name]` and go to `http://localhost:3000/app`
