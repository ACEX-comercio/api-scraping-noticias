var express = require('express');
var router = express.Router();
const request = require("tinyreq");
const cheerio= require("cheerio");
var modelo = require("../models/noticiasModel");
var busocial=0,masocial=0;
var bueconomico=0,maeconomico=0;
var bupolitico=0, mapolitico=0;
var bunatural=0, manatural=0;
var ntpolitico=0,ntsocial=0,nteconomico=0,ntnatural=0,notibueno,notimalovar,valoracion;
var ntmal=["muertos","muerto","virus","déficit","inflación","destruir","huelgas","manifestaciones","manifestacion","terremoto","temblor","desolación","huracán","peligro","mueren","enfrentamiento","inestabilidad","devaluación","perjuicio","corupcion","desfalco","maduro","enfrentamiento","pierde","falta","pandemia","envenenado","maltrato","piratería","asesinar","incautada","advierten","movilización","violento","choca"];
var ntbuen=["crea","reduce","resuelve","deflación","dinero","capacita","comienza","remplasara","peruana","cura","salva","vivio","bien","salvado","deacuerdo","buenas","tratado","cumple","feliz","completo","celebración","permisos","gana","cumple","construccion","sube"];
var rpolitico=["corrupcion","fraude","estado","crisis","regimen","chavista","militarizo","gobierno","politico","congreso","presidente","ministerio","lucha","corupto","renuncia"];
var rsocial=["reconocimiento","desempleo","incendio","pobreza","educacion","empleo","asesinatos","torturas","joven","mascotas","renuncia"];
var reconomico=["deficit","desempleo","deuda","dinero","PBI","dolar","BCR","torturas","asesinatos","economico","contabilidad","sube","soles","millones","permisos","estado"];
var rnatural=["temblor","terremoto","suna","sequia","simun","huracan","tormenta","ventisca","tornado","forestal","inundacion","tsunami","megatsunami"];
//array de paises
var paises=['Argentina','Bolivia'];

/* URL wor*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  res.render('index', { title: 'view test' });
});

router.get('/pais/:nombre', function(req, res) {
    var informacion=[];
  var lista_bbc=[];
  var lista_bbcc=[];
  var lista_bbccc=[];//noticias de la 
  var lista_cnn=[];//noticias de CNN
  var lista_cnn_d=[];//noticias del segundo resultado de CNN

  var miObjeto = new Object();
  const url_bbc='http://www.bbc.com/mundo/search/?q=';
  var url_pais=url_bbc+req.params.nombre;
  miObjeto.pais=req.params.nombre;
  request(url_pais, function (err, body) {
      var $ = cheerio.load(body);
          $('.hard-news-unit__headline-link').each(function(i,elem){
          lista_bbc[i]=$(this).text();//esta sacado
          lista_bbc.join(',');
          //console.log(lista_bbc);
        });
        //Inicio de una nueva prueva
        const url_bbc='http://www.bbc.com/mundo/search/?q=';
        var url_pais=url_bbc+req.params.nombre+'&start=11';
        request(url_pais, function (err, body) {
            var $ = cheerio.load(body);
                $('.hard-news-unit__headline-link').each(function(i,elem){
                lista_bbcc[i]=$(this).text();//esta sacado
                lista_bbcc.join(',');
              });
              const url_bbc='http://www.bbc.com/mundo/search/?q=';
              var url_pais=url_bbc+req.params.nombre+'&start=21';
              request(url_pais, function (err, body) {
                  var $ = cheerio.load(body);
                      $('.hard-news-unit__headline-link').each(function(i,elem){
                      lista_bbccc[i]=$(this).text();//esta sacado
                      lista_bbccc.join(',');
                    });
                    const url_bbc='http://cnnespanol.cnn.com/?s=';
                    var url_pais=url_bbc+req.params.nombre;
                    request(url_pais, function (err, body) {
                        var $ = cheerio.load(body);
                            $('.clearfix>h2>a').each(function(i,elem){
                            lista_cnn[i]=$(this).text();//esta sacado
                            lista_cnn.join(',');
                          });
                          const url_bbc='http://cnnespanol.cnn.com/page/2/?s=';
                          var url_pais=url_bbc+req.params.nombre;
                          request(url_pais, function (err, body) {
                              var $ = cheerio.load(body);
                                  $('.clearfix>h2>a').each(function(i,elem){
                                  lista_cnn_d[i]=$(this).text();//esta sacado
                                  lista_cnn_d.join(',');
                                });
                                var noticias=lista_bbc+lista_bbcc+lista_bbccc+lista_cnn+lista_cnn_d;
                                //console.log(noticias);
                                //separamos las noticias en un array
                                var arrayNoticias = noticias.split(",");
                                //console.log(arrayNoticias[1]);
                                //realisamos un for para que recorra el array de noticias
                                for (let i=0; i < arrayNoticias.length; i++) {
                                  valoracion=0;
                                  ntpolitico=0;
                                  ntsocial=0;
                                  nteconomico=0;
                                  ntnatural=0;
                                  notimalo=0;
                                  notibueno=0;
                                  let noticia=arrayNoticias[i];
                                  //console.log(noticia);
                                  var notipalabra= noticia.split(" ");//la noticia la separamos por palabras
                                  //defnimos si es bueno o malo la noticia
                                  for(let j = 0; j < notipalabra.length; j++){//recorremos cada palabra
                                    //console.log(palabras[i]);
                                    switch(notipalabra[j]){//selecionamos cada palabra
                                              case "muertos":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "virus":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "déficit":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "inflación":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "destruir":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "huelgas":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "manifestaciones":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "pobreza":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "terremoto":
                                                  valoracion=valoracion-2;
                                              break;
                                              case "desolación":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "huracán":
                                                  valoracion=valoracion-2;
                                              break;
                                              case "peligro":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "mueren":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "enfrentamiento":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "instabilidad":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "ilegales":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "devaluación":
                                                  valoracion=valoracion-1;
                                              break;
                                              case "perjuicio":
                                                  valoracion=valoracion-1;
                                              break;
                                              //comiensa lo bueno
                                              case "crea":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "reduce":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "resuelve":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "deflación":
                                                  valoracion=valoracion+1;
                                              break;
                                              break;
                                              case "dinero":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "capacita":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "comienza":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "remplasara":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "peruana":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "gana":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "bien":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "cura":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "salva":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "vivio":
                                                  valoracion=valoracion+1;
                                              break;
                                              case "bien":
                                                  valoracion=valoracion+1;
                                              break;
                                          }
                                  }
                                  //bucle para definir que son politicas
                                  for (let j = 0; j < notipalabra.length; j++) {
                                    //bucle politico
                                    for (let k = 0; k < rpolitico.length; k++) {
                                        //console.log(notipalabra[j]+"=="+rpolitico[k]);
                                        if (notipalabra[j]==rpolitico[k]) {
                                          ntpolitico=1;
                                          //console.log("hay noticias politicas---------------------------------------------------------");
                                          if (valoracion>=1) {
                                            bupolitico=bupolitico+1;                                              
                                          }
                                          if(valoracion<0){
                                            mapolitico=mapolitico+1;
                                          }
                                        }
                                    }
                                    //bucle social
                                    for (let k = 0; k < rsocial.length; k++) {
                                      //console.log(notipalabra[j]+"=="+rpolitico[k]);
                                      if (notipalabra[j]==rsocial[k]) {
                                          ntsocial=1;
                                        //console.log("hay noticias politicas---------------------------------------------------------");
                                        if (valoracion>=1) {
                                            busocial=busocial+1;                                              
                                          }
                                          if(valoracion<0){
                                            masocial=masocial+1;
                                          }
                                      }
                                    }
                                    //bucle economico
                                    for (let k = 0; k < reconomico.length; k++) {
                                      //console.log(notipalabra[j]+"=="+rpolitico[k]);
                                      if (notipalabra[j]==reconomico[k]) {
                                          nteconomico=1;
                                        //console.log("hay noticias politicas---------------------------------------------------------");
                                        if (valoracion>=1) {
                                            bueconomico=bueconomico+1;                                              
                                          }
                                          if(valoracion<0){
                                            maeconomico=maeconomico+1;
                                          }
                                      }
                                    }
                                    //bucle natural
                                    for (let k = 0; k < rnatural.length; k++) {
                                      //console.log(notipalabra[j]+"=="+rpolitico[k]);
                                      if (notipalabra[j]==rnatural[k]) {
                                          ntnatural=1;
                                        //console.log("hay noticias politicas---------------------------------------------------------");
                                        if (valoracion>=1) {
                                            bunatural=bunatural+1;                                              
                                          }
                                          if(valoracion<0){
                                            manatural=manatural+1;
                                          }
                                      }
                                    }
                                    
                                  }
                                  /*console.log("valoracion : "+valoracion);
                                  console.log("politico :"+ntpolitico );
                                  console.log("social : "+ntsocial);
                                  console.log("economico : "+nteconomico);
                                  console.log("natural : "+ntnatural);*/
                                  
                                }
                                miObjeto.bueconomico=bueconomico;
                                miObjeto.maeconomico=maeconomico;
                
                                miObjeto.bupolitico=bupolitico;
                                miObjeto.mapolitico=mapolitico;
                
                                miObjeto.busocial=busocial;
                                miObjeto.masocial=masocial;
                
                                miObjeto.bunatural=bunatural;
                                miObjeto.manatural=manatural;
                                informacion.push(miObjeto);
                                console.log(informacion);

                                res.json(informacion);
                          });
                    });
              });
        });
  });
  //res.send('Escrapeando '+ req.params.nombre + '...');
});


router.get('/api', function(req, res, next) {
  //bucle que recorre tos los paises
  var lista_bbc=[];
  for(var k=0;k<paises.length;k++){
    function envio(noticias){
      console.log(noticias);
    }
    function resultado(callbackscraping){
      callbackscraping(paises[k],envio);
      
    }
    function scraping(pais,callbackenvio){
      console.log(pais);
      const url_bbc='http://www.bbc.com/mundo/search/?q=';
        var url_pais=url_bbc+pais;
        request(url_pais, function (err, body) {
            var $ = cheerio.load(body);
               $('.hard-news-unit__headline-link').each(function(i,elem){
                lista_bbc[i]=$(this).text();//esta sacado
               //console.log(lista_bbc);
              });
              //console.log(lista_bbc);
              callbackenvio(lista_bbc);   
        });
    }

    resultado(scraping);
    //noticias=modelo.scraping(paises[k]);
    //console.log(noticias);
  }
  res.render('index', { title: 'api' });
});

module.exports = router;
