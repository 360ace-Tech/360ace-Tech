import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer2/source-files';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import readingTime from 'reading-time';
import type { PluggableList } from 'unified';

const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'blog/**/*.md',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    categories: { type: 'list', of: { type: 'string' }, required: false },
    summary: { type: 'string', required: false },
    image: {
      type: 'nested',
      of: defineNestedType(() => ({
        name: 'PostImage',
        fields: {
          path: { type: 'string', required: false },
          alt: { type: 'string', required: false },
        },
      })),
      required: false,
    },
    draft: { type: 'boolean', required: false, default: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.flattenedPath.replace(/^blog\//, ''),
    },
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath.replace(/^blog\//, '')}`,
    },
    readingTime: {
      type: 'json',
      resolve: (post) => readingTime(post.body.raw),
    },
    formattedDate: {
      type: 'string',
      resolve: (post) => {
        const rawDate = post.date as unknown;
        const value = new Date(rawDate as string | number | Date);
        return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(value);
      },
    },
  },
}));

const rehypePlugins: PluggableList = [[rehypePrettyCode as unknown as any, { theme: 'one-dark-pro' }]];

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  markdown: {
    remarkPlugins: [remarkGfm],
    // rehype-pretty-code bundles its own vfile dependency which conflicts with Contentlayer's
    // type expectations. Cast to `unknown` before handing to Contentlayer to avoid mismatched
    // types while retaining runtime behaviour.
    rehypePlugins,
  },
});
