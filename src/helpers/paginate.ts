import * as _ from 'lodash';
const specKeys = ["sort", "page", "limit"];

const queryPagingOptions = (page, limit) => {
    return [
        {
            $facet: {
                "count":
                    [
                        {
                            $count: "status"
                        }
                    ],
                "docs": [
                    {
                        $skip: (page - 1) * limit
                    },
                    {
                        $limit: limit
                    }
                ]
            }
        },
        {
            $project: {
                docs: 1,
                count: { "$arrayElemAt": ["$count", 0] }
            }
        },
        {
            $project: {
                docs: 1,
                totalDocs: { $toInt: "$count.status" }
            }
        },
        {
            $addFields: {
                totalPages: { $ceil: { $divide: ["$totalDocs", limit] } },
                page,
                limit
            }
        },
        {
            $addFields: {
                hasPrevPage: { $cond: [{ $gt: ["$page", 1] }, true, false] },
                hasNextPage: { $cond: [{ $lt: ["$page", "$totalPages"] }, true, false] },
                //                pagingCounter: 1,
                prevPage: {
                    $cond: [
                        { $lte: [page - 1, 0] }, //page -1
                        null,
                        page - 1]//page -1
                },
                nextPage: {
                    $cond: [
                        { $gt: [page + 1, "$totalPages"] }, //page +1
                        null,
                        page + 1]//page +1
                },
            }
        }
    ];
}
const queryPagingOptionsSample = (page, limit) => {
    return [
        {
            $facet: {
                "count":
                    [
                        {
                            $count: "status"
                        }
                    ],
                "docs": [
                    {
                        $skip: (page - 1) * limit
                    },
                    {
                        $sample: { size: limit }
                    }
                ]
            }
        },
        {
            $project: {
                docs: 1,
                count: { "$arrayElemAt": ["$count", 0] }
            }
        },
        {
            $project: {
                docs: 1,
                totalDocs: { $toInt: "$count.status" }
            }
        },
        {
            $addFields: {
                totalPages: { $ceil: { $divide: ["$totalDocs", limit] } },
                page,
                limit
            }
        },
        {
            $addFields: {
                hasPrevPage: { $cond: [{ $gt: ["$page", 1] }, true, false] },
                hasNextPage: { $cond: [{ $lt: ["$page", "$totalPages"] }, true, false] },
                //                pagingCounter: 1,
                prevPage: {
                    $cond: [
                        { $lte: [page - 1, 0] }, //page -1
                        null,
                        page - 1]//page -1
                },
                nextPage: {
                    $cond: [
                        { $gt: [page + 1, "$totalPages"] }, //page +1
                        null,
                        page + 1]//page +1
                },
            }
        }
    ];
}
const paginateAggregate = (query: any[], page: number, limit: number) => query.concat([{
    $facet: {
        "count":
            [
                {
                    $count: "status"
                }
            ],
        "docs": [
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]
    }
},
{
    $project: {
        docs: 1,
        count: { "$arrayElemAt": ["$count", 0] }
    }
},
{
    $project: {
        docs: 1,
        totalDocs: { $toInt: "$count.status" }
    }
},
{
    $addFields: {
        totalPages: { $ceil: { $divide: ["$totalDocs", limit] } },
        page,
        limit
    }
},
{
    $addFields: {
        hasPrevPage: { $cond: [{ $gt: ["$page", 1] }, true, false] },
        hasNextPage: { $cond: [{ $lt: ["$page", "$totalPages"] }, true, false] },
        //                pagingCounter: 1,
        prevPage: {
            $cond: [
                { $lte: [page - 1, 0] }, //page -1
                null,
                page - 1]//page -1
        },
        nextPage: {
            $cond: [
                { $gt: [page + 1, "$totalPages"] }, //page +1
                null,
                page + 1]//page +1
        },
    }
}])
const querySelect = (project) => {
    return {
        $project: project
    }
}
const queryPopulateAge = (populate) => {
    let query = []
    //Add Match Lookup
    let match_lookup = (element) => element.match
        ? [element.in ? { $in: [element.foreignField, "$$value"] } : { $eq: [element.foreignField, "$$value"] }, ...element.match]
        : [element.in ? { $in: [element.foreignField, "$$value"] } : { $eq: [element.foreignField, "$$value"] }]

    populate.forEach(element => {
        query.push({
            $lookup: {
                let: { value: element.removeObjectId ? element.localField : { $toObjectId: element.localField } }
                , from: element.ref
                , pipeline: element.pipeline
                    ? element.pipeline
                    : [
                        {
                            $match: {
                                $expr: { $and: [...match_lookup(element)] }
                            }
                        }
                        , ...element.facet ? element.facet : []
                        , {
                            $project: element.project ? element.project : { __v: 0 }
                        }]
                , as: element.virtualName
            }

        })
        if (element.unwind) {
            query.push(element.preserve
                ? { $unwind: { path: '$' + element.virtualName, preserveNullAndEmptyArrays: true } }
                : { $unwind: '$' + element.virtualName })

        }
    });
    return query;
}
const querySearchAge = (search, containKeys) => {
    let query = [];
    search.map(element => {
        const temp = element.split(":");
        if (containKeys.includes(temp[0])) {
            query.push(
                {
                    $eq: [
                        {
                            $regexMatch:
                                { input: '$' + temp[0], regex: new RegExp(temp[1]), options: "i" }
                        }
                        , true
                    ]
                }
            );
        }
    })
    return !isEmptyObject(query)
        ? {
            $match: {
                $expr:
                {
                    $or: [...query]
                }
            }
        }
        : null
}
const querySearchAllAge = (search, containKeys) => {
    let query = []
        , or = [];
    search.map(element => {
        const temp = element.split(":");
        let findAll = {};
        if (containKeys.includes(temp[0])) {
            findAll[temp[0]] = { $regex: new RegExp(temp[1]), $options: 'i' };
            or.push(findAll);
        }
    })

    query = [{ $match: { $or: or } }]
    return query.length
        ? query
        : null
}
const queryMatchAge = (query) => {
    return {
        "$match": query
    }
}
const queryGroupAge = (group) => {
    return {
        $group: {
            _id: "$_id",
            like: { $first: "$like" },
            share: { $first: "$share" },
            numArticle: { $first: "$numArticle" },
            createdAt: { $first: "$createdAt" },
            title: { $first: "$title" },
            image: { $first: "$image" },
            list_article: {
                $push: {
                    _id: "$article_detail._id",
                    bookmark: "$bookmark",
                    topic: "$article_detail.topic",
                    createdAt: "$article_detail.createdAt",
                    image: "$article_detail.image",
                    title: "$article_detail.title",
                    excerpt: "$article_detail.excerpt"
                },
            }
        }
    }
}
const isEmptyObject = function (OBJ) {
    for (var key in OBJ) {
        if (OBJ.hasOwnProperty(key))
            return false;
    }
    return true;
}

export {
    queryPagingOptions
    , querySelect
    , queryPopulateAge
    , querySearchAge
    , querySearchAllAge
    , queryMatchAge
    , queryGroupAge
    , queryPagingOptionsSample
    , isEmptyObject
    , paginateAggregate
}
