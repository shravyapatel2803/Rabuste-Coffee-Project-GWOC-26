import slugify from "slugify";

export default function slugPlugin(schema, options = {}) {
  const sourceField = options.source || "name";

  schema.pre("validate", async function () {

    if (this[sourceField]) {
      if (!this.slug || this.isModified(sourceField)) {
        this.slug = slugify(this[sourceField], {
          lower: true,
          strict: true,
          trim: true,
        });
      }
    }
  });
}