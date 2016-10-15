module.exports = function (app) {

    //Bring MySQL into the app
    var mysql = require("mysql");
    
    function sortFunction(a, b) 
                            {
                              if (a[3] === b[3])
                                return 0;
                              else
                                return (a[3] < b[3]) ? -1 : 1;
                            }
    // First you need to create a connection to the db
    var con = mysql.createConnection({
      host: "localhost",
      user: "tanayv",
      password: "",
      database: "c9",
    });
    
    con.connect(function(err){
      if(err){
        console.log('Error connecting to Db');
        return;
      }
      console.log('Connection established');
    });
    
    
    app.get('/', function (req, res) {
        console.log("Application home loaded");
        res.send('sup');
    });
    
    app.post('/addSpot', function (req, res) {
        var lat = req.body.lat2;
        var lng = req.body.lng2;
        console.log(lat + "," + lng);
        var post  = { Lat: lat, Lng : lng };
        con.query("INSERT INTO spots SET ?", post, function (err, rows) {
          if(err)
          console.log(err.message);
        else
          console.log("Success!");
        res.redirect('/success.html');
    });
    });
    
    app.post('/findSpot', function (req, res) 
    { 
          var lat = req.body.lat1;
          var lng = req.body.lng1;
          var dataset = [];
          var dataset2 = [];
          var finalrray = [];
          var delta = {};
          var g_count = 0;

          con.query('SELECT Lat, Lng, Time, Id FROM spots', 
          function(err,rows) 
          {
            
            if(rows[0])
            {
              var origin = lat + "," + lng;
              
          
      //var destinations = ['Chicago, United States of America', 'Denver, United States of America', 'Vancouver, Canada', 'Michigan, United States of America'];
              var seconds = ((new Date).getTime())/1000;
              console.log(seconds);
      //var times = [(seconds-1475936281)/60, (seconds-1475936282)/60, (seconds-1475936281)/60, (seconds-1475936281)/60
              var longlats =  new Array();
              for(var i=0; i<rows.length; i++)
                {
                var something = rows[i].Lat + "," + rows[i].Lng;
                longlats.push(something);
                }
                
              var to = new Array();
              for(var i=0; i<rows.length; i++)
              { 
                var something = (seconds-(rows[i].Time/1000))/60;
                to.push(something);
              }
          
              for(var k = 0; k<rows.length; k++)
              {
                var distServ = require('google-distance');
                var x = distServ.get(
                    {
                      index : k,
                      origins : [origin],
                      destinations : [longlats[k]], 
                      mode : 'driving'
                    },
                  function(err, data)
                    { 
                      g_count++;
                      
                      if(!err)  {

                          var ind = data[0].index;
                          
                          if(ind==null)
                              ind = 0;
                              
                          var dVal = (data[0].durationValue)/60;
                          var dest = data[0].destination;
                          
                          if (dVal < 30)
                            {
                            dataset2.push([dest.substring(0,dest.length-15), Math.ceil(dVal), Math.ceil(to[ind]), 3*to[ind]+dVal, rows[ind].Id]);
                            }
                        
                        console.log("Hello");
                      }
                        
                        
                        if(g_count==rows.length)
                            { 
                            if(dataset2.length==0)
                                {
                                var errm = "No spots nearby...";
                                res.render('feed', {lat : lat, lng : lng, errm : errm});
                                }
                            else
                              {
                                  dataset2 = dataset2.sort(sortFunction); 
                                  res.render('feed', {dataset : dataset2, lat : lat, lng : lng});
                                }
                            }
                    });
              }
            }  
         }); 
      });
      
      app.get('/spot/:id/:lat/:lng/:itemzero/', function(req, res) {
     
     var rLat = req.param('lat');
     var rLng = req.param('lng');
     var rDest = req.param('itemzero');
     var rName = rDest;
     var rDest = rDest.replace(/ /g, "+");
     var rID = req.param('id');
     
     
       var originp = rLat + "," + rLng;
      var iFrameSick1 = "//www.google.com/maps/embed/v1/directions?origin="+originp+"&destination="+rDest+"&key=AIzaSyDVhUJj4uTcx4m6Moi3gmPoll_WEo6CwvQ";
      
      res.render('stop', {
       iFrameSick1 : iFrameSick1,
       rName: rName,
       rID : rID
     })
      
     });   
      
    app.get('/delSpot/:id', function(req, res) {
      var rID = req.param('id');
      con.query('DELETE FROM spots WHERE Id = ' + rID, 
          function(err,rows) 
          {
            if(err) throw err;
          });
      res.redirect('/../../success.html');
     });   
};