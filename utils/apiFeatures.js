const { model } = require('mongoose');

class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    let queryObj = { ...this.queryStr };
    // console.log(queryObj);
    // console.log(this.queryStr);
    const excludedFeilds = ['page', 'sort', 'limit', 'fields'];
    excludedFeilds.forEach(el => delete queryObj[el]);
    // 1B - Advanced  filtering
    queryObj = JSON.stringify(queryObj);
    //  \b      -> to ensure it is match the exact word not a piece  of other word
    queryObj = queryObj.replace(/\b(lt|lte|gt|gte)\b/g, match => `$${match}`);
    this.query = this.query.find(JSON.parse(queryObj));
    // console.log(this.queryStr);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFeilds() {
    if (this.queryStr.fields) {
      const selectedFeilds = this.queryStr.fields.split(',').join(' ');
      console.log(selectedFeilds);
      this.query = this.query.select(selectedFeilds);
    } else {
      // exclusive __v field from the output
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    // skip formula (page -1 )* limit -> to skip the documents of the previous pages
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    // check if the required page doesn't exist
    // page is not Exist -> it's not real an actual error
    // if (this.queryStr.page) {
    //   const numTours = await Tour.countDocuments();
    //   // I throwed error here to go to the catch block
    //   if (skip >= numTours) throw new Error('this page is not Exist!');
    // }
    return this;
  }
}

module.exports = APIFeatures;
