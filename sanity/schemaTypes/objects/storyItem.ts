import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'storyItem',
  title: 'Story Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
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
      name: 'overlayLabel',
      title: 'Overlay Label',
      type: 'string',
    }),
    defineField({
      name: 'overlayHeading',
      title: 'Overlay Heading',
      type: 'string',
    }),
    defineField({
      name: 'gridSize',
      title: 'Grid Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'sm' },
          { title: 'Medium', value: 'md' },
          { title: 'Large', value: 'lg' },
          { title: 'Wide', value: 'wide' },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'label',
      media: 'image',
    },
  },
});
