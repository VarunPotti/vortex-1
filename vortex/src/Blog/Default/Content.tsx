import { BlogProps } from "../../types/Blog";
import ReactMarkdown from "react-markdown";
import { NormalComponents } from "react-markdown/lib/complex-types";
import { SpecialComponents } from "react-markdown/lib/ast-to-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import * as themes from "react-syntax-highlighter/dist/esm/styles/hljs";
// import rehypeRaw from "rehype-raw";
import "github-markdown-css/github-markdown.css";
import TweetEmbed from "react-tweet-embed";
import rehypeRaw from "rehype-raw";
import React from "react";
import Reaction from "./Reaction";
import ReactEmbedGist from "react-embed-gist";
// @ts-expect-error
import Codepen from "react-codepen-embed";

const Content: React.FC<BlogProps> = (props) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  let rootRef = React.createRef<HTMLDivElement>();
  const components: Partial<
    Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents
  > = {
    h1: ({ children }) => (
      <h1
        style={{ color: props.theme?.textHeaderColor }}
        className="text-3xl font-extrabold xl:text-[2.75rem] 2xl:text-[2.75rem] md:text-4xl mt-4 mb-7"
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        style={{ color: props.theme?.textHeaderColor }}
        className="text-xl font-bold xl:text-3xl md:text-3xl 2xl:text-3xl mt-5 mb-3"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        style={{ color: props.theme?.textHeaderColor }}
        className="text-lg font-bold xl:text-xl md:text-2xl 2xl:text-2xl mt-2 mb-3"
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        style={{ color: props.theme?.textHeaderColor }}
        className="text-base font-bold xl:text-lg md:text-xl 2xl:text-xl"
      >
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5
        style={{ color: props.theme?.textHeaderColor }}
        className="text-sm font-bold xl:text-base md:text-lg 2xl:text-lg"
      >
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6
        style={{ color: props.theme?.textHeaderColor }}
        className="text-xs font-bold xl:text-sm md:text-base 2xl:text-lgx"
      >
        {children}
      </h6>
    ),
    p: ({ children }) => (
      <p
        style={{ color: props.theme?.inlineTextColor }}
        className="mt-2 mb-5 text-xl leading-normal "
      >
        {children}
      </p>
    ),
    link: ({ children, ...rest }) => {
      if (rest.href?.startsWith("https://twitter.com")) {
        let id =
          rest.href?.match(/twitter.com\/.*\/([0-9]+).*/) ??
          "1468899596730441730";
        return (
          <TweetEmbed
            id={id[1]}
            options={{ theme: props.theme?.twitter?.theme ?? "dark" }}
          />
        );
      } else if (rest.href?.startsWith("https://gist.github.com")) {
        let id = rest.href?.match(
          /gist.github.com\/(.*\/[(\w)+].*)(#[(\w)+].*)/
        ) ?? ["", "c332ab20f5b721a0828759d70a52b986", "#file-discord-ex"];
        return (
          <ReactEmbedGist
            gist={id[1] as any}
            wrapperClass="gist__bash"
            loadingClass="loading__screen"
            titleClass="gist__title"
            errorClass="gist__error"
            contentClass="gist__content"
            file={id[2]}
          />
        );
      } else if (rest.href?.startsWith("https://codepen.io/")) {
        let id = rest.href?.match(
          /codepen.io\/([(\w)+]*.)\/pen\/([(\w)+]*.)/
        ) ?? ["", "alvaromontoro", "vYexLGV"];
        return <Codepen hash={id[2]} user={id[1]} />;
      } else {
        return (
          <a
            href={rest.href}
            className="no-underline hover:underline mt-4 mb-4 text-blue-500"
            style={{ textDecorationColor: props.theme?.inlineBgColor }}
          >
            {children}
          </a>
        );
      }
    },
    a: ({ children, ...rest }) => {
      if (rest.href?.startsWith("https://twitter.com")) {
        let id =
          rest.href?.match(/twitter.com\/.*\/([0-9]+).*/) ??
          "1468899596730441730";
        return (
          <TweetEmbed
            id={id[1]}
            options={{ theme: props.theme?.twitter?.theme ?? "dark" }}
          />
        );
      } else if (rest.href?.startsWith("https://gist.github.com")) {
        let id = rest.href?.match(
          /gist.github.com\/(.*\/[(\w)+].*)(#[(\w)+].*)/
        ) ?? ["", "c332ab20f5b721a0828759d70a52b986", "#file-discord-ex"];
        return (
          <ReactEmbedGist
            gist={id[1] as any}
            wrapperClass="gist__bash"
            loadingClass="loading__screen"
            titleClass="gist__title"
            errorClass="gist__error"
            contentClass="gist__content"
            file={id[2]}
          />
        );
      } else if (rest.href?.startsWith("https://codepen.io/")) {
        let id = rest.href?.match(
          /codepen.io\/([(\w)+]*.)\/pen\/([(\w)+]*.)/
        ) ?? ["", "alvaromontoro", "vYexLGV"];
        return (
          <div className="mb-5">
            <Codepen hash={id[2]} user={id[1]} />
          </div>
        );
      } else {
        return (
          <a
            href={rest.href}
            className="no-underline hover:underline mt-4 mb-4"
            style={{ textDecorationColor: props.theme?.linkColor }}
          >
            {children}
          </a>
        );
      }
    },
    code({ node, inline, className, children, ...propso2 }) {
      const match = /language-(\w+)/.exec(className || "") ?? "default";
      const theme: string = props.codeblock?.theme as any;
      return !inline && match ? (
        // @ts-expect-error
        <SyntaxHighlighter
          children={String(children).replace("\\", "\\\\")}
          customStyle={{
            borderRadius: "5px",
            width: "auto",
            overflow: "auto",
            margin: "0px 5px 0px 5px",
          }}
          // @ts-expect-error
          style={{ ...themes[theme] }}
          showLineNumbers={true}
          language={match[1]}
          PreTag="div"
          {...propso2}
        />
      ) : (
        <code
          style={{
            margin: "0px 5px 0px 5px",
            backgroundColor: props.theme?.inlineBgColor,
            padding: "3px 5px 3px 5px",
            fontSize: "12px",
            color: props.theme?.inlineTextColor,
            borderRadius: "5px",
          }}
          className={className}
          {...propso2}
        >
          {children}
        </code>
      );
    },
  };
  return (
    <div
      ref={rootRef}
      className="mt-16 sm:mt-20 md:mt-72 lg:mt-96  xl:mt-40 2xl:mt-40 flex items-start justify-center w-[98%] sm:w-[90%] 2xl:w-[60%] flex-col"
    >
      <a
        href={props.header?.category.url}
        style={{ color: props.theme?.linkColor }}
        className="uppercase font-bold text-lg no-underline"
      >
        {props.header?.category.title}
      </a>
      <div className="flex items-start flex-col justify-center mt-0 mb-8">
        <h1 style={{ fontSize: "3rem" }} className="font-extrabold mb-0">
          {props.header?.title}
        </h1>
        <h5 className="mt-0 text-2xl font-normal">{props.header?.subtitle}</h5>
      </div>
      <div className="mt-8 sm:mt-10 md:mt-20 xl:mt-20 2xl:mt-20">
        <div className="flex grid-cols-12  md:grid justify-start flex-col">
          <div className="col-span-2 flex items-start justify-start flex-col">
            <img
              width="72px"
              className="rounded-full"
              src={props.author.avatar}
              alt=""
            />
            <h1
              className="font-medium text-xl mt-3"
              style={{ color: props.theme?.dateColor }}
            >
              {props.author.name}
            </h1>
            <h6
              className="text-sm"
              style={{ color: props.theme?.inlineBgColor }}
            >
              {new Date(props.date ?? "").toLocaleDateString(
                "en-US",
                options as any
              )}
            </h6>
          </div>
          <div className="col-span-7 w-[40%] sm:w-[50%] md:w-[95%] lg:w-[100%]">
            <ReactMarkdown rehypePlugins={[rehypeRaw]} components={components}>
              {props.content}
            </ReactMarkdown>
          </div>
          <Reaction {...props} />
        </div>
      </div>
    </div>
  );
};

export default Content;
