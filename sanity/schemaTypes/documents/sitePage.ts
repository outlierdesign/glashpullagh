import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sitePage',
  title: 'Site Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'hero',
    }),
    defineField({
      name: 'storyItems',
      title: 'Story Items',
      type: 'array',
      of: [{ type: 'storyItem' }],
    }),
    defineField({
      name: 'stats',
      title: 'Statistics',
      type: 'array',
      of: [{ type: 'statItem' }],
    }),
    defineField({
      name: 'quote1',
      title: 'First Quote Block',
      type: 'quoteBlock',
    }),
    defineField({
      name: 'about',
      title: 'About Section',
      type: 'aboutSection',
    }),
    defineField({
      name: 'mapPOIs',
      title: 'Map Points of Interest',
      type: 'array',
      of: [{ type: 'mapPOI' }],
    }),
    defineField({
      name: 'restorationHeading',
      title: 'Restoration Heading',
      type: 'string',
    }),
    defineField({
      name: 'restorationDescription',
      title: 'Restoration Description',
      type: 'text',
    }),
    defineField({
      name: 'restorationActions',
      title: 'Restoration Actions',
      type: 'array',
      of: [{ type: 'restorationAction' }],
    }),
    defineField({
      name: 'monitoring',
      title: 'Monitoring Section',
      type: 'monitoringSection',
    }),
    defineField({
      name: 'video',
      title: 'Video Section',
      type: 'videoSection',
    }),
    defineField({
      name: 'quote2',
      title: 'Second Quote Block',
      type: 'quoteBlock',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [
        {
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
        },
      ],
    }),
    defineField({
      name: 'footerClosingHeading',
      title: 'Footer Closing Heading',
      type: 'string',
    }),
    defineField({
      name: 'footerClosingText',
      title: 'Footer Closing Text',
      type: 'text',
    }),
  ],
});
