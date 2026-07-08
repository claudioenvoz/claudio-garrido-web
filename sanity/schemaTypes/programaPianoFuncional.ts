import { defineField, defineType } from "sanity";

export default defineType({
  name: "programaPianoFuncional",
  title: "Programa Piano Funcional",
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
      name: "descripcionCorta",
      title: "Descripción corta",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "contenido",
      title: "Contenido / temario",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "precio",
      title: "Precio",
      type: "number",
    }),
    defineField({
      name: "imagenPortada",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "modulos",
      title: "Módulos del programa",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "nombre", title: "Nombre del módulo", type: "string" },
            { name: "descripcion", title: "Descripción", type: "text" },
          ],
        },
      ],
    }),
  ],
});
