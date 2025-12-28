const mongoose = require("mongoose");

const uri = "mongodb+srv://krishnakumar050kk:HostelBoys44@cluster0.u8s4amj.mongodb.net/mycontacts-backend?retryWrites=true&w=majority";

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => { console.error(err); process.exit(1); });

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model("User", userSchema);

(async () => {
  try {
    const result = await User.updateMany({}, { $unset: { lootboxesClaimed: "" } });
    console.log("✅ lootboxesClaimed removed from all users. Modified:", result.modifiedCount);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error updating users:", err);
    process.exit(1);
  }
})();
