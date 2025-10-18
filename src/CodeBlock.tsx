import * as React from "react";
import { Copy, Check } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { BuildCode } from "./buildCodes";


import './styling.css';

const CodeBlock: React.FC<BuildCode> = ({ code = '', type: language = "typescript" }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    window?.navigator?.clipboard && window.navigator.clipboard.writeText(code)
    .then(() => setCopied(true))
    .then(() => setTimeout(() => setCopied(false), 2000))
    .catch(err => console.error("Failed to copy code:", err));
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl hover:shadow-2xl transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {language}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all duration-200 text-xs font-medium border border-slate-600 hover:border-slate-500"
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          customStyle={{
            margin: 0,
            padding: "1rem 1.25rem",
            background: "transparent",
            fontSize: "0.29rem",
            lineHeight: "1.6",
          }}
          showLineNumbers={true}
          lineNumberStyle={{
            color: "#64748b",
            marginRight: "1rem",
            minWidth: "2.5rem",
            textAlign: "right",
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeBlock;