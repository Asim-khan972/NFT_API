const express = require("express");
const router = express.Router();
const nftController = require("./../controller/nftController");
const authController = require("./../controller/authController");

//// this middleware only works when Id is called in api
// router.param("id", nftController.checkId);
router
  .route("/top-5-nfts")
  .get(nftController.aliasTopNfts, nftController.getAllNfts);

router.route("/nft-stats").get(nftController.getNFTStats);

router.route("/monthly-plan/:year").get(nftController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, nftController.getAllNfts)
  .post(nftController.checkBody, nftController.createNft);
router
  .route("/:id")
  .get(nftController.getNft)
  .put(nftController.updateNft)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "guide"),
    nftController.deleteNft
  );

module.exports = router;
