import slugify from "slugify";

export default function slugPlugin(schema) {
  schema.pre("save", async function () {
    // Only generate slug when name changes or slug missing
    if (this.isModified("name") || !this.slug) {
      this.slug = slugify(this.name, {
        lower: true,
        strict: true,
        trim: true,
      });
    }
    // ✅ NO next() here
  });
}
