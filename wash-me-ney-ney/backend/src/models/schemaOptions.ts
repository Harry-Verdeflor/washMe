export const schemaOptions = {
  versionKey: false as const,
  toJSON: {
    virtuals: true,
    transform: (_doc: unknown, ret: any) => {
      delete ret._id;
      return ret;
    },
  },
};
