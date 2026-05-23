import mongoose from "mongoose";

const keywordReplySchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      trim: true,
    },

    reply: {
      type: String,
      default: "",
      trim: true,
    },

    mediaUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const botSuggestionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const adminKeywordReplySchema = new mongoose.Schema(
  {
    keyword: {
      type: String,
      required: true,
      trim: true,
    },

    reply: {
      type: String,
      default: "",
      trim: true,
    },

    mediaUrl: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const botSettingSchema = new mongoose.Schema(
  {
    botName: {
      type: String,
      default: "Otto Bot",
      trim: true,
    },

    botAvatar: {
      type: String,
      default: "",
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    delaySeconds: {
      type: Number,
      default: 0,
      min: 0,
      max: 300,
    },

    fallbackMessage: {
      type: String,
      default:
        "Cảm ơn bạn đã nhắn tin cho Otto Labs. Nhân viên hỗ trợ sẽ trả lời bạn sớm nhất có thể.",
    },

    allowCustomerMedia: {
      type: Boolean,
      default: true,
    },

    suggestions: {
      type: [botSuggestionSchema],
      default: [
        {
          label: "Báo giá in 3D",
          message: "Tôi muốn nhận báo giá in 3D.",
        },
        {
          label: "Tư vấn vật liệu",
          message: "Tôi muốn được tư vấn vật liệu in phù hợp.",
        },
        {
          label: "Gửi file in",
          message: "Tôi muốn gửi file 3D để kiểm tra.",
        },
      ],
    },

    keywordReplies: {
      type: [keywordReplySchema],
      default: [
        {
          keyword: "báo giá",
          reply:
            "Bạn vui lòng gửi file 3D, kích thước, số lượng và vật liệu mong muốn để Otto Labs báo giá chính xác hơn.",
        },
        {
          keyword: "file",
          reply:
            "Otto Labs nhận các định dạng STL, OBJ, STEP, 3MF. Bạn có thể gửi file trực tiếp trong khung chat.",
        },
        {
          keyword: "vật liệu",
          reply:
            "Otto Labs hỗ trợ PLA, PETG, TPU, ABS, Resin và một số vật liệu đặc biệt khác.",
        },
      ],
    },

    adminKeywordReplies: {
      type: [adminKeywordReplySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.BotSetting ||
  mongoose.model("BotSetting", botSettingSchema);
