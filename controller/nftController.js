const NFT = require("./../models/nftModel");
const APIFeatures = require("../utils/APIFeatures");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.aliasTopNfts = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllNfts = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(NFT.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const Nfts = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: Nfts.length,
    data: {
      Nfts,
    },
  });
});

exports.getNft = catchAsync(async (req, res, next) => {
  const nft = await NFT.findById(req.params.id);
  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }
  res.status(200).json({
    message: "success ",
    nft,
  });
});

///////////// NFT Creation

exports.createNft = catchAsync(async (req, res, next) => {
  const nft = await NFT.create(req.body);

  res.status(200).json({
    message: "success ",
    nft,
  });
});

///////////// PUT single  nfts

exports.updateNft = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }
  res.status(200).json({
    message: "success ",
    nft,
  });
});

/////////////// delelte nft

exports.deleteNft = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndDelete(req.params.id);
  if (!nft) {
    return next(new AppError("No nft found with that ID", 404));
  }
  res.status(200).json({
    message: " delete success ",
  });
});

//// this is midlleware

// exports.checkId = (req, res next, value) => {
//   console.log(`ID : ${value}`);
//   const id = req.params.id * 1;

//   if (id > nfts.length) {
//     return res.status(404).json({
//       message: "you enter invalid id ",
//     });
//   }
//   next();
// };

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      message: "please enter pricw and name  ",
    });
  }

  next();
};

exports.getNFTStats = catchAsync(async (req, res) => {
  const stats = await NFT.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numNFT: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
  const year = req.params.year * 1; // 2021

  const plan = await NFT.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numNFTStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numNFTStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  console.log(plan);
  res.status(200).json({
    status: "success",
    data: {
      plan,
    },
  });
});
