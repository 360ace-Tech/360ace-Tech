import Callout from './Callout';
import Figure from './Figure';
import CodeBlock from './CodeBlock';

const MDXComponents = {
  Callout,
  Figure,
  pre: (props: any) => <CodeBlock {...props} />,
};

export default MDXComponents;

