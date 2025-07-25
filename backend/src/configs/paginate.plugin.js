const paginate = (schema) => {
  schema.statics.paginate = async function (filter, options) {
    let sort = {};
    if (options.sortBy) {
      options.sortBy.split(",").forEach((sortOption) => {
        console.log("OPTIONS:", sortOption);
        const [key, order] = sortOption.split(":");
        if (order == "desc") {
          sort[key] = -1;
        } else {
          sort[key] = 1;
        }
      });
    } else {
      sort = { createdAt: -1 };
    }

    const limit =
      options.limit && parseInt(options.limit, 10) > 0
        ? parseInt(options.limit, 10)
        : 10;
    const page =
      options.page && parseInt(options.page, 10) > 0
        ? parseInt(options.page, 10)
        : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.find(filter).count().exec();

    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(",").forEach((populateOption) => {
        docsPromise = docsPromise.populate(
          populateOption
            .split(".")
            .reverse()
            .reduce((a, b) => ({ path: b, populate: a }))
        );
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = {
  paginate
};