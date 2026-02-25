import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'mapPOI',
  title: 'Map Point of Interest',
  type: 'object',
  fields: [
    defineField({
      name: 'poiId',
      title: 'POI ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
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
      name: 'xCoord',
      title: 'X Coordinate',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'yCoord',
      title: 'Y Coordinate',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colorType',
      title: 'Color Type',
      type: 'string',
      options: {
        list: [
          { title: 'Gold', value: 'gold' },
          { title: 'Water', value: 'water' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'label',
    },
  },
});
