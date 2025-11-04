import Callout from './Callout';
import Figure from './Figure';
import CodeBlock from './CodeBlock';

const MDXComponents = {
  Callout,
  Figure,
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => <CodeBlock {...props} />,
};

export default MDXComponents;

