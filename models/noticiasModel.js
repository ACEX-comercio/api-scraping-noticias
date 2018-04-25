var express = require('express');
var router = express.Router();
const request = require("tinyreq");
const cheerio= require("cheerio");
//var model = require("../controllers/seleccionarController");
module.exports = {
    scraping: function(pais) {
        const url_bbc='http://www.bbc.com/mundo/search/?q=';
        var url_pais=url_bbc+pais;
        var lista_bbc=[];
        var res = [];
        request(url_pais, function (err, body) {
            var $ = cheerio.load(body);
               $('.hard-news-unit__headline-link').each(function(i,elem){
                lista_bbc[i]=$(this).text();//esta sacado
               console.log(lista_bbc);
              });
        });
    }
  }
  