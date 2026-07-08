import { defineField, defineType } from "sanity";

export default defineType({
  name: "masterclass",
  title: "Masterclass",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titulo" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fecha",
      title: "Fecha y hora",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "cupos",
      title: "Cupos disponibles",
      type: "number",
    }),
    defineField({
      name: "precio",
      title: "Precio de inscripción",
      type: "number",
    }),
    defineField({
      name: "imagenPortada",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "abierta",
      title: "Inscripciones abiertas",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
