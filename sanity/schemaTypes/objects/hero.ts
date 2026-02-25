import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'headingLines',
      title: 'Heading Lines',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'object',
      fields: [
        defineField({
          name: 'latitude',
          title: 'Latitude',
          type: 'number',
        }),
        defineField({
          name: 'longitude',
          title: 'Longitude',
          type: 'number',
        }),
        defineField({
          name: 'altitude',
          title: 'Altitude',
          type: 'string',
        }),
        defineField({
          name: 'locationLabel',
          title: 'Location Label',
          type: 'string',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'subtitle',
    },
  },
});
