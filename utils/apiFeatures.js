class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // get the query
    const queryObj = { ...this.queryString };
    // fields to be excluded
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // convert the query obj to string & convert it from for example {duration: { gte: 4 }, diffuculty: easy, ...} to {duration: { $gte: 4 }, diffuculty: easy, ...} using regular expression
    // http:IP:PORT/url?duration[gtr]=4&difficulty=easy&...
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // http:IP:PORT/url?sort=price sort by price in an ascending order
    // http:IP:PORT/url?sort=-price sort by price in an descending order
    // http:IP:PORT/url?sort=-price,rating,... sort by price in an descending order and rating
    if (this.queryString.sort) {
      // change queryString from { sort: '-price,rating' }  to { sort: '-price rating' } basically from '-price,rating' to '-price rating'
      const sortBy = this.queryString.sort.split(',').join('');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // http:IP:PORT/url?fields=name,duration,rating, ... meaning that limited fiels to be displayed will be name, duration, rating ...
    // http:IP:PORT/url?fields=-name,-duration,-rating, ... meaning that the selected fields that are -name,-duration,-rating will be excluded then not being displayed.
    if (this.queryString.fields) {
      // change queryString from { fields: 'name,duration,rating' }  to { fields: 'name duration rating' } basically from 'name,duration,rating' to 'name duration rating'
      const fields = this.queryString.fields.split(',').join('');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    // http:IP:PORT/url?page=2&limit=50 let's we have 1000 documents, page=2&limit=50 will limit each page with 50 documents and them we will have 10 pages and currently we are at page 2 out of the 10 pages
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
