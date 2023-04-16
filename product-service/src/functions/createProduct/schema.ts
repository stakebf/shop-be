export default {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    price: { type: "number" },
    count: { type: "number" },
    imgUrl: { type: "string" },
    shortDescription: { type: "string" }
  },
  required: ["title", "description", "price", "count"]
} as const;
