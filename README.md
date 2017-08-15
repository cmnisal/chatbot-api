Chatbot API 
=========

The chatbot API is built on node.js using Express with MongoDB as the database. 

Creating a new Service
----------------------

### Create Controller ###

* Controllers go in the `api/controllers` folder. Use the `HelloController.js` file as a template when creating new controllers.
* You will have to perform dependency injection to inject the dependencies you need.

### Create Data Access Services ###

* The VTour API uses Mongoose to manage the MongoDB Schema.
* Data Access Services will contain functions that return the various data needed by controllers, and also handle schema manipulation. *DO NOT* do schema manipulation inside controllers. 
* A weird caveat of Mongoose seems to be that it adds an 's' to the end of the collection names you give during schema definition. 
* You will need to add your Data Access Service to `ConfigIoc.js` so you can inject it as a dependency to controllers.


### Modify swagger file ###

* The swagger.yaml file is contained in `api/swagger`. The `RouteManager` will look at this swagger file to initialize controllers and routes for the API.
* You will need to add endpoint specs as per normal swagger definition.