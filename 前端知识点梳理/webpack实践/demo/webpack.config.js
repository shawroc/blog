const path = require('path')
// 必须是绝对路径 哦
// 配置里面
module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.merge.js'
  }
}