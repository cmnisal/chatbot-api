module.exports = function HotelDataAccessService(config,
                                                q,
                                                db,
                                                helpersUtil,
                                                exceptionFac) {
    "use strict";
    var self = this;

    // Bind injected dependencies
    this.config = config;
    this.q = q.module;
    this.db = db.module;
    this.helpersUtil = helpersUtil;
    this.exceptionFac = exceptionFac;
    this.schema = self.db.Schema;

    this.getHotels = function () {
        var getHotels = self.q.nbind(self.Hotel.find, self.Hotel);

        return getHotels({})
            .then(function(hotels) {
                if(hotels) {
                    return self.q.when(hotels);
                } else {
                    return self.q.when(null);
                }
            });

    };
    this.getHotelById = function(id) {
        var getHotel = self.q.nbind(self.Hotel.findOne, self.Hotel);

        return getHotel({
            _id: id
        }).then(function(hotel) {
            if(hotel) {
                hotel = hotel.toObject();
                hotel.id = hotel._id.toString();
                delete hotel._id;
                return self.q.when(hotel);
            } else {
                return self.q.when(null);
            }
        });
    };

    this.addHotel = function(hotel) {
      var storedHotel = new self.Hotel(hotel);
      var saveHotel = self.q.nbind(storedHotel.save, storedHotel);

      return saveHotel()
          .then(function(success) {
              if(success) {
                  return self.q.when(hotel);
              } else {
                  throw self.exceptionFac.createInstance('E0010', 500);
              }
          })
    };

    this.Hotel = self.db.model('vt_hotel', new self.schema({
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: String,
        intro: String,
        url: String

    }));

};

module.exports.$inject = [
    'config',
    'q',
    'db',
    'helpersUtil',
    'exceptionFac'
];