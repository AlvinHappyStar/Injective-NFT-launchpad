module.exports = (mongoose) => {
  const dbModel = mongoose.model(
    "minterInfo",
    mongoose.Schema(
      {
        accountId: { type: String, default: "" },
        mintedCount: { type: Number, default: 0 },
      },
      { timestamps: true }
    )
  );
  return dbModel;
};
