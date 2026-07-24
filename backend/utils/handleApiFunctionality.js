class ApiFunctionality {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString
    }


    search() {

    const keyword = this.queryString.keyword
        ? {
            name: {
                $regex: this.queryString.keyword,
                $options: "i"
            }
        }
        : {};

    this.query = this.query.find({...keyword});

    return this;
}
    filter(){
        const queryCopy = ({...this.queryString})
        const removeFields = ["keyword", "page","limit"]
        removeFields.forEach (el => delete queryCopy[el]) 

        // Convert gte/gt/lte/lt → $gte/$gt/$lte/$lt
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, key => `$${key}`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1
        const skipPage = resultPerPage * (currentPage - 1 )
        this.query = this.query.limit(resultPerPage).skip(skipPage)
        return this
    }
}
export default ApiFunctionality;  