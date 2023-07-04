module.exports = (mongoose) => {
  const dbModel = mongoose.model(
    "nftInfo",
    mongoose.Schema(
      {
        serialNumber: { type: Number, default: 0 },
        accountId: { type: String, default: "" },
        status: { type: Number, default: 0 },
      },
      { timestamps: true }
    )
  );
  return dbModel;
};
