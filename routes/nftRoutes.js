const express = require("express");
const router = express.Router();
const nftController = require("./../controller/nftController");

//// this middleware only works when Id is called in api
router.param("id", nftController.checkId);

router
  .route("/")
  .get(nftController.getAll)
  .post(nftController.checkBody, nftController.createNft);
router
  .route("/:id")
  .get(nftController.getNft)
  .put(nftController.updateNft)
  .delete(nftController.deleteNft);

module.exports = router;
