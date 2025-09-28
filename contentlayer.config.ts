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

// Fix relative image paths in MD/MDX to use absolute public paths
function remarkFixImagePaths() {
  return (tree: any) => {
    const visit = (node: any) => {
      if (!node || typeof node !== 'object') return;
      // Fix image nodes: ../../blogs/img/foo.png -> /blogs/img/foo.png
      if (node.type === 'image' && typeof node.url === 'string') {
        if (node.url.startsWith('../../blogs/')) {
          node.url = node.url.replace(/^\.\.\/\.\.\//, '/');
        } else if (node.url.startsWith('../blogs/')) {
          node.url = node.url.replace(/^\.\.\//, '/');
        }
      }
      // Recurse into children
      if (Array.isArray((node as any).children)) {
        for (const child of (node as any).children) visit(child);
      }
    };
    visit(tree);
  };
}

const rehypePlugins: PluggableList = [
  [
    rehypePrettyCode as unknown as any,
    {
      theme: {
        dark: 'one-dark-pro',
        light: 'github-light',
      },
    },
  ],
];

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  markdown: {
    remarkPlugins: [remarkFixImagePaths as unknown as any, remarkGfm],
    // rehype-pretty-code bundles its own vfile dependency which conflicts with Contentlayer's
    // type expectations. Cast to `unknown` before handing to Contentlayer to avoid mismatched
    // types while retaining runtime behaviour.
    rehypePlugins,
  },
});
