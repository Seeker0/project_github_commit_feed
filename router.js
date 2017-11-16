'use strict';
const gitApi = require('./API/api.js');
const http = require('http');
const fs = require('fs');
const url = require('url');
const data1 = require('./data/commits.json');
const querystring = require('querystring');

const Router = {};

Router.handle = (req, res) => {
  let method = req.method.toLowerCase();
  let path = url.parse(req.url).pathname;

  if (path != '/favicon.ico') {
    console.log(method, path);
    Router.routes[method][path](req, res);
  }
};

Router.routes = {
  get: {
    '/': (req, res) => {
      fs.readFile('./views/index.html', function(err, html) {
        if (err) {
          throw err;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });

        res.write(html.toString());

        res.end();
      });
    },
    '/commits': (req, res) => {
      fs.readFile('./views/index.html', function(err, html) {
        if (err) {
          throw err;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });

        let formData = querystring.parse(url.parse(req.url).query);

        const gh = new gitApi();

        gh.getCommits(formData.repo, formData.owner)
          .then(data => {

             let newdata = data.data.map(function(commit){
             let newObj = {sha: commit.sha, html_url: commit.html_url, author: commit.author, message: commit.message}
             return newObj;
             
             
             })
      
             newdata = JSON.stringify(newdata, null, 2);

            res.write(html.toString().replace(/{{commitfeed}}/, newdata));

            res.end();
          })
          .catch(error => console.error(error));
      });
    }
  },
  post: {
    '/': (req, res) => {
      fs.readFile('./views/index.html', function(err, html) {
        if (err) {
          throw err;
        }
        res.writeHead(200, {
          'Content-Type': 'text/html'
        });

        let data = JSON.stringify(data1, null, 2);

        res.write(html.toString().replace(/{{commitfeed}}/, data));
        res.end();
      });
    }
  }
};

module.exports = Router;
