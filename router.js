module.exports = function (app) {

    //Bring MySQL into the app
    var mysql = require("mysql");
    
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
          var idek = 0;

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
                      origins : [origin],
                      destinations : [longlats[k]], 
                      mode : 'driving'
                    },
                  function(err, data)
                    { 
                      idek++;
                      if(data)  
                        {
                          
                          var index = dataset.push([data[0].destination, data[0].durationValue/60]);
                          
                          console.log(index);
                          if((dataset[index-1][1])<30)
                            dataset2.push([dataset[idek-1][0].substring(0,dataset[idek-1][0].length-15), Math.ceil(dataset[idek-1][1]), Math.ceil(to[idek-1]), 3*to[idek-1]+dataset[idek-1][1], rows[idek-1].Id]);
                          
                    
                          function sortFunction(a, b) 
                            {
                              if (a[3] === b[3])
                                return 0;
                              else
                                return (a[3] < b[3]) ? -1 : 1;
                            }
                            
          
              
                          if(idek==rows.length)
                            {
                            dataset2 = dataset2.sort(sortFunction); 
                            res.render('feed', {dataset : dataset2, lat : lat, lng : lng});
                            }
                          
            
                        }
                    });
                }
                

            }  
            
            else
              {
                
                var errm = "No spots nearby...";
                res.render('feed', {lat : lat, lng : lng, errm : errm});
              }
            

              //res.render('index', { msg1: '' + dataset2, msg2: ''+to});
         }); 
      });
               /*  function sortFunction(a, b)
              {
                if (a[2] === b[2]) 
                  return 0;
                else
                  return (a[2] < b[2]) ? -1 : 1;
              }
              var sorted_dataset = dataset.sort(sortFunction);
               */
     
     
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