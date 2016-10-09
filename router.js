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
        var lat = req.body.lat;
        var lng = req.body.lng;
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
          var lat = req.body.lat;
          var lng = req.body.lng;
          var dataset = [];
          var dataset2 = [];
          var finalrray = [];
          var delta = {};
          con.query('SELECT Lat, Lng, Time, Id FROM spots', 
          function(err,rows) 
          {
            if(err) throw err;
            console.log('Data received from Db:\n');
            console.log(rows.length);
            
            var origin = lat + "," + lng;

      //var destinations = ['Chicago, United States of America', 'Denver, United States of America', 'Vancouver, Canada', 'Michigan, United States of America'];
            var seconds = ((new Date).getTime())/1000;
      //var times = [(seconds-1475936281)/60, (seconds-1475936282)/60, (seconds-1475936281)/60, (seconds-1475936281)/60
            var longlats =  new Array();
            console.log(rows);
            console.log(rows.length);
            for(var i=0; i<rows.length; i++)
            {
              var something = rows[i].Lat + "," + rows[i].Lng;
              longlats.push(something);
            }
            var data;
            var to = new Array();
            for(var i=0; i<rows.length; i++)
            { 
              var something = (seconds-(rows[i].Time/1000))/60;
              to.push(something);
            }
            for(var k = 0; k<rows.length; k++){
              var distServ = require('google-distance');
            var x = distServ.get(
              {
                origins : [origin],
                destinations : [longlats[k]], 
                mode : 'driving'
              },
            function(err, data)
              { 
                if(err)
                  console.log("Error");
              dataset.push([data[0].destination, data[0].durationValue/60]);
              if(dataset.length==rows.length){
              for(var bo = 0; bo<rows.length; bo++){
                dataset2.push([dataset[bo][0].substring(0,dataset[bo][0].length-15), Math.ceil(dataset[bo][1]), Math.ceil(to[bo]), 3*to[bo]+dataset[bo][1], rows[bo].Id]);
              }
               function sortFunction(a, b) {
              if (a[3] === b[3]) {
               return 0;
                }
                else {
                 return (a[3] < b[3]) ? -1 : 1;
                  }}
              var sorted_dataset = dataset2.sort(sortFunction);            
              //res.send(sorted_dataset);
              res.render('feed', {dataset: sorted_dataset, lat : lat, lng : lng});
              //res.render('index', { msg1: '' + dataset2, msg2: ''+to});
              }
              }); 
            }
               /*  function sortFunction(a, b)
              {
                if (a[2] === b[2]) 
                  return 0;
                else
                  return (a[2] < b[2]) ? -1 : 1;
              }
              var sorted_dataset = dataset.sort(sortFunction);
               */
            });
     });
     
     
      app.get('/spot/:id/:lat/:lng/:itemzero/', function(req, res) {
     
     rLat = req.param('lat');
     rLng = req.param('lng');
     rDest = req.param('itemzero');
     rName = rDest;
     rDest = rDest.replace(/ /g, "+");
     rID = req.param('id');
     
     
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