import {Router, Request, Response, NextFunction} from 'express';
var Dishes = require('../../data/dishes');

export class CookifyRouter {
  router: Router

  constructor() {
    this.router = Router();
    this.init();
  }

  public getMultiple(req: Request, res: Response, next: NextFunction) {
    const dishHashes = req.body.dishHashes;
    if (dishHashes == null) {
      return res.status(400)
        .send({
          message: "No 'dishHashes' passed in request body.",
          status: res.status
        });
    }
    let foundDishes = [];

    for (let dishHash of dishHashes) {
      const dish = Dishes[dishHash];
      if (dish == null) {
        foundDishes.push({ dishHash: dishHash, rating: 0 });
        continue;
      }
      const [_, rating] = dish;
      foundDishes.push({ dishHash: dishHash, rating: rating });
    }

    res.status(200)
      .send({
        dishRatings: foundDishes
      });
  }

  public getOne(req: Request, res: Response, next: NextFunction) {
    const dishHash = req.params.id;
    const rating = parseInt(req.query.rating);
    if (Dishes[dishHash] == null) {
      if (isNaN(rating)) {
        return res.status(404)
          .send({
            rating: 0,
            status: res.status
          });
      } else {
        Dishes[dishHash] = ['', 0];
      }
    }

    let [ratings, average] = Dishes[dishHash];

    if (req.query.rating == null) {
      return res.status(200)
        .send({
          rating: average,
          status: res.status
        });
    } else if (!isNaN(rating) && rating >= 1 && rating <= 5) {
      ratings += String(rating);
    } else {
      return res.status(400)
        .send({
          rating: average,
          status: res.status
        });
    }

    const sum = function(lhs, rhs) { return +lhs + +rhs };
    const ratingsArray = ratings.split('');
    const newAverage = parseFloat(ratingsArray.reduce(sum)) / ratingsArray.length;

    res.status(200)
      .send({
        rating: newAverage,
        status: res.status
      });

    Dishes[dishHash] = [ratings, newAverage];
    var fs = require('fs');
    fs.writeFile('./data/dishes.json', JSON.stringify(Dishes), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log('Ratings successfully saved!');
    });
  }

  init() {
    this.router.post('/', this.getMultiple);
    this.router.get('/:id', this.getOne);
  }
}

const cookifyRoutes = new CookifyRouter();
cookifyRoutes.init();

export default cookifyRoutes.router;
