const fs = require("fs");
const path = require("path");
const Router = require("express").Router;

function getRoutes() {
  return getPathRoutes();
}
function getPathRoutes(routePath = "/") {
  const routesPath = path.resolve(__dirname, "../routes", "." + routePath);
  const dir = fs.readdirSync(routesPath);
  let datas = [];

  for (const f of dir) {
    const file = path.join(routesPath, f);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      datas.push(...getPathRoutes(routePath.replace(/\/$/, "") + `/${f}`));
      continue;
    }
    if (!file.match(/\.js$/)) {
      continue;
    }
    const router = require(file);
    if (Object.getPrototypeOf(router) !== Router) {
      continue;
    }

    datas.push({
      path: routePath,
      router
    });
  }
  return datas;
}

module.exports = getRoutes;
