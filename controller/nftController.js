const fs = require("fs");

console.log(`${__dirname}/data/nft-simple.json`);
const nfts = JSON.parse(
  fs.readFileSync(`${__dirname}/../nft-data/data/nft-simple.json`)
);

///////////// get single  nfts

exports.getAll = (req, res) => {
  res.status(200).json({
    message: "Hello get req , Express!",
    reqTime: req.requestTime,
    result: nfts.length,
    data: {
      "NFT DATA": nfts,
    },
  });
};

exports.getNft = (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;

  if (id > nfts.length) {
    res.status(404).json({
      message: "you enter invalid id ",
    });
  }

  const nft = nfts.find((el) => el.id === id);
  res.status(200).json({
    message: "get a single Nft by its id !",

    data: {
      "NFT DATA": nft,
    },
  });
};

///////////// NFT Creation

exports.createNft = (req, res) => {
  const newId = nfts[nfts.length - 1].id + 1;
  //   console.log(nfts[nfts.length - 1].id + 1);
  const newNft = Object.assign({ id: newId }, req.body);

  nfts.push(newNft);

  fs.writeFile(
    `${__dirname}/data/nft-simple.json`,
    JSON.stringify(nfts),
    (err) => {
      res.status(201).json({
        message: "Success ",
        nft: newNft,
      });
    }
  );

  //   console.log(req.body);
  res.status(200).json({
    message: "Hello post req , Express!",

    data: {
      "NFT DATA": newNft,
    },
  });
};

///////////// PUT single  nfts

exports.updateNft = (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;

  if (id > nfts.length) {
    res.status(404).json({
      message: "you enter invalid id ",
    });
  }

  const nft = nfts.find((el) => el.id === id);

  res.status(200).json({
    message: "UPDATE A   single Nft by its id !",

    data: {
      "NFT DATA": nft,
    },
  });
};

///////////// delete single  nfts

exports.deleteNft = (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;

  if (id > nfts.length) {
    res.status(404).json({
      message: "you enter invalid id ",
    });
  }

  const nft = nfts.find((el) => el.id === id);

  res.status(200).json({
    message: "Delete a single Nft by its id !",

    data: {
      "NFT DATA": nft,
    },
  });
};

//// this is midlleware

exports.checkId = (req, res, next, value) => {
  console.log(`ID : ${value}`);
  const id = req.params.id * 1;

  if (id > nfts.length) {
    return res.status(404).json({
      message: "you enter invalid id ",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(404).json({
      message: "please enter pricw and name  ",
    });
  }

  next();
};
