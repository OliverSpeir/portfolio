import React from "react";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import styles from './CodeBlock.module.css';
interface CodeCopyBtnProps {
  children: React.ReactNode;
}

function CodeCopyBtn({ children }: CodeCopyBtnProps) {
  const [copyOk, setCopyOk] = React.useState(false);

  const iconColor = copyOk ? '#0af20a' : '#ddd';
  const icon = copyOk ? 'fa-check-square' : 'fa-copy';

  const handleClick = () => {
    navigator.clipboard.writeText(children?.toString() || "");
    console.log(children);

    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 500);
  };

  return (
    <div className={styles['code-copy-btn']}>
      <i
        className={`fas ${icon}`}
        onClick={handleClick}
        style={{ color: iconColor }}
      />
    </div>
  );
}

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const Pre = ({ children }: { children: React.ReactNode }) => (
    <pre className="blog-pre">
      <CodeCopyBtn>{children}</CodeCopyBtn>
      {children}
    </pre>
  );

  return (
    <ReactMarkdown
      className="post-markdown"
      linkTarget="_blank"
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        pre: Pre,
        code({ node, inline, className = "blog-code", children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={a11yDark as any}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {`\`\`\`${language}\n${code}\n\`\`\``}
    </ReactMarkdown>
  );
}
