## Parkcore : About

An android web-view application built on top of Node.JS to simplify the parking situation for Detroit residents by crowdsourcing available parking locations to ease huge wait times - a known problem.
Built in partnership with the [Data Driven Detroit](http://datadrivendetroit.org/) initiative.

### Usage

* Parkcore is essentially a web application built using Node.Js - served using Express, Pug and MySQL - and eventually transformed into an Android application by using Android WebView.

* Parkcore leverages the Google Maps API (Distance Matrix Services API for Node.Js,  Geolocation API for Javascript) to provide real time location; reverse geolocation and best routes to available parking spots.

* Parkcore lets users :

  - mark places they vacate as **available** parking spots

  - look for vacant parking spots in the users' vicinity

* Parkcore ranks unoccupied parking spots on the basis of

  - time elapsed since it was **marked vacated**

  - time required for **shortest route** to it