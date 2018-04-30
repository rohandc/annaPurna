let express = require('express');
let request = require('request-promise');
let cheerio = require('cheerio');
let app     = express();
let fbModel = require('../_models/foodbasics');
let nfModel = require('../_models/nofrills');
let geo = require('geojson');

//Item View
/*app.get('/nfScrape', function(req, res){

  const milliseconds = (new Date).getTime();
  const url1=`https://www.nofrills.ca/deals/flyer/${milliseconds}/~item/a/~sort/recommended/~selected/true/~filters/deals-for-pickup-time:true?_=`+(new Date).getTime();
  const url2=`https://www.nofrills.ca/deals/flyer/${milliseconds}/~item/a/~sort/recommended/~selected/true/~filters/deals-for-pickup-time:true?json=true&page=0&itemsLoadedonPage=60`;
  const url3=`https://www.nofrills.ca/deals/flyer/${milliseconds}/~item/a/~sort/recommended/~selected/true/~filters/deals-for-pickup-time:true?json=true&page=0&itemsLoadedonPage=120`;
  const  url4=`https://www.nofrills.ca/deals/flyer/${milliseconds}/~item/a/~sort/recommended/~selected/true/~filters/deals-for-pickup-time:true?json=true&page=0&itemsLoadedonPage=180`;
  const url5=`https://www.nofrills.ca/deals/flyer/${milliseconds}/~item/a/~sort/recommended/~selected/true/~filters/deals-for-pickup-time:true?json=true&page=0&itemsLoadedonPage=240`;
  const url6=`https://www.nofrills.ca/deals/flyer/${milliseconds}/~item/a/~sort/recommended/~selected/true/~filters/deals-for-pickup-time:true?json=true&page=0&itemsLoadedonPage=300`;
  const url7=`https://www.nofrills.ca/deals/flyer/${milliseconds}/~item/a/~sort/recommended/~selected/true/~filters/deals-for-pickup-time:true?json=true&page=0&itemsLoadedonPage=360`;

  products=[];
  request(url1)
    .then( function(html){
      let $ = cheerio.load(html);
      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
        product={};
        product.image=$(element).find('img').attr('src');
        let prod_text =[];
        $(element).find('a > span').each(function(i,obj){
          prod_text.push($(obj).text());
        });
        product.title= prod_text.join(' ');
        products.push(product);

      });
      console.log("url 1",products.length);

  })
    .catch(function (err) {
               console.log(err);
              })
    .finally(function(){
      request(url2)
        .then( function(html){
          let $ = cheerio.load(html);
          $('div.item').find('div.product-page-hotspot').each(function (index, element) {
            product={};
            product.image=$(element).find('img').attr('src');
            let prod_text =[];
            $(element).find('a > span').each(function(i,obj){
              prod_text.push($(obj).text());
            });
            product.title= prod_text.join(' ');
            products.push(product);

          });

        })
        .catch(function (err) {
          console.log(err);
        })
        .finally(function(){
          //url 3
          console.log("url 2",products.length);
          request(url3)
            .then( function(html){
              let $ = cheerio.load(html);
              $('div.item').find('div.product-page-hotspot').each(function (index, element) {
                product={};
                product.image=$(element).find('img').attr('src');
                let prod_text =[];
                $(element).find('a > span').each(function(i,obj){
                  prod_text.push($(obj).text());
                });
                product.title= prod_text.join(' ');
                products.push(product);

              });

            })
            .catch(function (err) {
              console.log(err);
            })
            .finally(function(){
              //url 4
              console.log("url 3",products.length);
              request(url4)
                .then( function(html){
                  let $ = cheerio.load(html);
                  $('div.item').find('div.product-page-hotspot').each(function (index, element) {
                    product={};
                    product.image=$(element).find('img').attr('src');
                    let prod_text =[];
                    $(element).find('a > span').each(function(i,obj){
                      prod_text.push($(obj).text());
                    });
                    product.title= prod_text.join(' ');
                    products.push(product);

                  });

                })
                .catch(function (err) {
                  console.log(err);
                })
                .finally(function(){
                  //url 5
                  console.log("url 4",products.length);
                  request(url5)
                    .then( function(html){
                      let $ = cheerio.load(html);
                      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
                        product={};
                        product.image=$(element).find('img').attr('src');
                        let prod_text =[];
                        $(element).find('a > span').each(function(i,obj){
                          prod_text.push($(obj).text());
                        });
                        product.title= prod_text.join(' ');
                        products.push(product);

                      });

                    })
                    .catch(function (err) {
                      console.log(err);
                    })
                    .finally(function () {
                      //url 6
                      console.log("url 5",products.length);
                      request(url6)
                        .then( function(html){
                          let $ = cheerio.load(html);
                          $('div.item').find('div.product-page-hotspot').each(function (index, element) {
                            product={};
                            product.image=$(element).find('img').attr('src');
                            let prod_text =[];
                            $(element).find('a > span').each(function(i,obj){
                              prod_text.push($(obj).text());
                            });
                            product.title= prod_text.join(' ');
                            products.push(product);

                          });

                        })
                        .catch(function (err) {
                          console.log(err);
                        }).finally(function () {
                        //url 7
                        console.log("url 6",products.length);
                        request(url7)
                          .then( function(html){
                            let $ = cheerio.load(html);
                            $('div.item').find('div.product-page-hotspot').each(function (index, element) {
                              product={};
                              product.image=$(element).find('img').attr('src');
                              let prod_text =[];
                              $(element).find('a > span').each(function(i,obj){
                                prod_text.push($(obj).text());
                              });
                              product.title= prod_text.join(' ');
                              products.push(product);
                              debugger;
                            });
                          })
                          .catch(function (err) {
                            console.log(err);
                          })
                          .finally(function () {
                            console.log(products.length);
                            res.send(products);
                          });
                      });
                    } );
                });
            });
        });

    });



 /!* request(url2, function(error, response, html){
    if(!error){
      let $ = cheerio.load(html);
      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
        product={};
        product.image=$(element).find('img').attr('src');
        let prod_text =[];
        $(element).find('a > span').each(function(i,obj){
          prod_text.push($(obj).text());
        });
        product.title= prod_text.join(' ');
        products.push(product);

      });

    }

  });
  request(url3, function(error, response, html){
    if(!error){
      let $ = cheerio.load(html);
      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
        product={};
        product.image=$(element).find('img').attr('src');
        let prod_text =[];
        $(element).find('a > span').each(function(i,obj){
          prod_text.push($(obj).text());
        });
        product.title= prod_text.join(' ');
        products.push(product);

      });

    }

  });
  request(url4, function(error, response, html){
    if(!error){
      let $ = cheerio.load(html);
      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
        product={};
        product.image=$(element).find('img').attr('src');
        let prod_text =[];
        $(element).find('a > span').each(function(i,obj){
          prod_text.push($(obj).text());
        });
        product.title= prod_text.join(' ');
        products.push(product);

      });

    }

  });
  request(url5, function(error, response, html){
    if(!error){
      let $ = cheerio.load(html);
      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
        product={};
        product.image=$(element).find('img').attr('src');
        let prod_text =[];
        $(element).find('a > span').each(function(i,obj){
          prod_text.push($(obj).text());
        });
        product.title= prod_text.join(' ');
        products.push(product);

      });

    }

  });
  request(url6, function(error, response, html){
    if(!error){
      let $ = cheerio.load(html);
      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
        product={};
        product.image=$(element).find('img').attr('src');
        let prod_text =[];
        $(element).find('a > span').each(function(i,obj){
          prod_text.push($(obj).text());
        });
        product.title= prod_text.join(' ');
        products.push(product);

      });

    }

  });
  request(url7, function(error, response, html){
    if(!error){
      let $ = cheerio.load(html);
      $('div.item').find('div.product-page-hotspot').each(function (index, element) {
        product={};
        product.image=$(element).find('img').attr('src');
        let prod_text =[];
        $(element).find('a > span').each(function(i,obj){
          prod_text.push($(obj).text());
        });
        product.title= prod_text.join(' ');
        products.push(product);

      });

    }

  });*!/


});*/

app.get('/nfScrape',function (req,res) {
  const milliseconds = (new Date).getTime();
  request({
    uri:`https://www.nofrills.ca/store-locator/selector-overlay?_=${milliseconds}`,
    json:true
  })
    .then(function (response) {
      request('https://www.nofrills.ca/print-flyer').then(function (html) {
        let $ = cheerio.load(html);
       // const CSRFToken = $('input[name=CSRFToken]').val();
        let storeId = null;
        let isocode = null;
        response.filter(function (element) {
          if(element.name === 'Ontario'){
            storeId= element.defaultStoreId;
            isocode= element.isocode;
          }

        });
        storeId= storeId.substring(1);
        request({
          method: 'POST',
          uri:  `https://flyers.nofrills.ca/flyers/nofrills?locale=en&store_code=${storeId}&type=2`,
          body: {},
          json: true
        }).then(function (inres) {
          inres.items.map(function (itemObj) {
            //Save food basics Flyer to DB
            nfModel.findOneAndUpdate({flyer_item_id: itemObj.flyer_item_id}, itemObj,{upsert:true} ,function (err, fb_instance) {
              if (err) res.status(500).json({error:err.message});

            });
          });
          res.status(200).json({message:"Success",status:200,fb_instance:inres.items});
        });

      })


    })
});

app.get('/nfOffers/:id',function (req,res) {
  let nameArr =null;
  let matchedResult = [];
  if(req.params.id) {
    nameArr= req.params.id.split(',');
    nameArr.map(function (singleName, index, array) {
      nfModel.find({$text: {$search: singleName}}).lean().select('flyer_item_id  flyer_id display_name brand display_name name current_price large_image_url x_large_image_url valid_from valid_to').exec((err, doc) => {
        if(err) console.log(err);
        doc.map(obj => matchedResult.push(obj));
        if (array.length === index+1){
          res.send(matchedResult);
          console.log(matchedResult);
        }
      });
    });
  }});


app.get('/fbScrape',function (req,res) {

  request( {
    uri: 'https://ecirculaire.foodbasics.ca/shopping_lists/available_flyers?merchant_id=2265&store_code=&postal_code=M9R',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  } )
    .then( function(response) {
      const flyer_id=response[0].flyer_id;
      request({
        uri: `https://ecirculaire.foodbasics.ca/flyer_data/${flyer_id}?locale=en`,
        json:true
      })
        .then(function (resp) {

          const itemArr= resp.items.filter(function (element)
          {
            return element.display_type!==5;
          });
          itemArr.map(function (itemObj) {
            //Save food basics Flyer to DB
            fbModel.findOneAndUpdate({flyer_item_id: itemObj.flyer_item_id}, itemObj,{upsert:true} ,function (err, fb_instance) {
              if (err) res.status(500).json({error:err.message});

            });
          });
          res.status(200).json({message:"Success",status:200,fb_instance:itemArr});
        })

    });
});

app.get('/fbOffers/:id',function (req,res) {
  let nameArr =null;
  let matchedResult = [];
  if(req.params.id) {
    nameArr= req.params.id.split(',');
      nameArr.map(function (singleName, index, array) {
      fbModel.find({$text: {$search: singleName}}).lean().select('flyer_item_id  flyer_id display_name brand display_name name current_price large_image_url x_large_image_url valid_from valid_to').exec((err, doc) => {
        if(err) console.log(err);
        doc.map(obj => matchedResult.push(obj));
        if (array.length === index+1){
            res.send(matchedResult);
            console.log(matchedResult);
          }
      });
    });
  }});

app.get('/nfAllLocations', function (req,res) {
  const milliseconds = (new Date).getTime();
  request({
    method: 'GET',
    uri:  `https://www.nofrills.ca/store-locator/locations/all?showNonShoppable=true&_=${milliseconds}`,
    body: {},
    json: true
  }).then(function (inres) {
    if(inres)
    {
      const data = geo.parse(inres.searchResult, {Point: ['lat', 'lng']});
      res.send(data);
    }
  });


});

module.exports= app;
