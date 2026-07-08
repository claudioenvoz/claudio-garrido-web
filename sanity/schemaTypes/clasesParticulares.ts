import { defineField, defineType } from "sanity";

export default defineType({
  name: "clasesParticulares",
  title: "Clases Particulares",
  type: "document",
  fields: [
    defineField({
      name: "tipo",
      title: "Tipo de clase",
      type: "string",
      options: {
        list: [
          { title: "Piano Funcional", value: "piano" },
          { title: "Canto", value: "canto" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
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
      name: "descripcion",
      title: "Descripción",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "duracionMinutos",
      title: "Duración (minutos)",
      type: "number",
    }),
    defineField({
      name: "precio",
      title: "Precio por sesión",
      type: "number",
    }),
    defineField({
      name: "modalidad",
      title: "Modalidad",
      type: "string",
      options: {
        list: [
          { title: "Online", value: "online" },
          { title: "Presencial", value: "presencial" },
          { title: "Híbrida", value: "hibrida" },
        ],
      },
    }),
  ],
});
