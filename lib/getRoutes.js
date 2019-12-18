const fs = require('fs');
const path = require('path');
const { Router } = require('express');

function getPathRoutes(routePath = '/') {
  const routesPath = path.resolve(__dirname, '../routes', `.${routePath}`);
  const dir = fs.readdirSync(routesPath);
  const datas = [];

  for (const f of dir) {
    const file = path.join(routesPath, f);
    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      datas.push(...getPathRoutes(`${routePath.replace(/\/$/, '')}/${f}`));
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
      path: file.match(/index\.js$/)
        ? routePath
        : path
            .join(routePath, path.basename(file).replace(/\.js$/, ''))
            .replace(/\\/g, '/'),
      router
    });
  }
  return datas;
}
function getRoutes() {
  return getPathRoutes();
}

module.exports = getRoutes;
