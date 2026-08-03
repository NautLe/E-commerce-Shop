class ApiFunctionality {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        if (this.queryString.keyword) {
            const keyword = {
                $or: [
                    { name: { $regex: this.queryString.keyword, $options: "i" } },
                    { description: { $regex: this.queryString.keyword, $options: "i" } },
                    { category: { $regex: this.queryString.keyword, $options: "i" } },
                    { subcategory: { $regex: this.queryString.keyword, $options: "i" } }

                ]
            };
            const numberRating = Number(this.queryString.keyword)
            if(!NaN(numberRating)){
                keyword.$or.push({ ratings: numberRating })
            }
            this.query = this.query.find(keyword);
        }
        return this;
    }
    
    filter() {
        const queryCopy = { ...this.queryString };
        const removeFields = ["keyword", "page", "limit", "sort"];
        removeFields.forEach((el) => delete queryCopy[el]);

        if (queryCopy.inStock === 'true' || queryCopy.inStock === true) {
            queryCopy.stock = { gt: 0 };
            delete queryCopy.inStock;
        }

        // Convert gte/gt/lte/lt → $gte/$gt/$lte/$lt
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (key) => `$${key}`);
        let filterObj = JSON.parse(queryStr);

        if (filterObj.category) {
            const cat = filterObj.category.toString().toLowerCase();
            if (cat === 'all' || !filterObj.category) {
                delete filterObj.category;
            } else if (typeof filterObj.category === 'string') {
                filterObj.category = { $regex: `^${filterObj.category}$`, $options: "i" };
            }
        }
        if (filterObj.subcategory) {
            if (filterObj.subcategory.toString().toLowerCase() === 'all' || !filterObj.subcategory) {
                delete filterObj.subcategory;
            } else if (typeof filterObj.subcategory === 'string') {
                filterObj.subcategory = { $regex: `^${filterObj.subcategory}$`, $options: "i" };
            }
        }

        this.query = this.query.find(filterObj);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortOption = this.queryString.sort;
            if (sortOption === 'price_asc') {
                this.query = this.query.sort({ price: 1 });
            } else if (sortOption === 'price_desc') {
                this.query = this.query.sort({ price: -1 });
            } else if (sortOption === 'ratings') {
                this.query = this.query.sort({ ratings: -1 });
            } else if (sortOption === 'newest') {
                this.query = this.query.sort({ createdAt: -1 });
            }
        } else {
            this.query = this.query.sort({ createdAt: -1 });
        }
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1;
        const skipPage = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skipPage);
        return this;
    }
}

export default ApiFunctionality;