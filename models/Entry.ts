import mongoose from "mongoose"

const EntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },
    date: {
      type: String,
      required: [true, "Please provide a date"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    tags: {
      type: [String],
      default: [],
    },
    mood: {
      type: String,
      required: [true, "Please provide a mood"],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Entry || mongoose.model("Entry", EntrySchema)
