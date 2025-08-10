module.exports = {
  apps:[{
    name: "EXTREAME-XMD",
    script: "index.js",
    watch: false,
    autorestart: true,
    env: {
      NODE_ENV: "production"
    }
  }]
}
