import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'restorationAction',
  title: 'Restoration Action',
  type: 'object',
  fields: [
    defineField({
      name: 'actionNumber',
      title: 'Action Number',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'technicalDetail',
      title: 'Technical Detail',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'gridSpan',
      title: 'Grid Span',
      type: 'number',
      description: 'Columns to span out of 12',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'actionNumber',
      media: 'image',
    },
  },
});
