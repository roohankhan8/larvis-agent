import React from 'react';

type FormattedContentProps = {
    text: string;
};

// Helper that splits and parses bold (**text**) and italics (*text*)
function parseMarkdownInline(text: string): React.ReactNode[] {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    
    return boldParts.flatMap((boldPart, boldIndex) => {
        if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
            const innerText = boldPart.slice(2, -2);
            return (
                <strong key={`b-${boldIndex}`} className="font-bold text-[#1a2620] dark:text-[#e5eae6]">
                    {parseItalics(innerText, `b-in-${boldIndex}`)}
                </strong>
            );
        }
        return parseItalics(boldPart, `p-${boldIndex}`);
    });
}

function parseItalics(text: string, baseKey: string): React.ReactNode[] {
    const italicParts = text.split(/(\*.*?\*)/g);
    return italicParts.map((part, index) => {
        if (part.startsWith('*') && part.endsWith('*')) {
            return (
                <em key={`${baseKey}-i-${index}`} className="italic font-serif">
                    {part.slice(1, -1)}
                </em>
            );
        }
        return part;
    });
}

export default function FormattedContent({ text }: FormattedContentProps) {
    if (!text) {
        return <p className="italic text-[#607267] dark:text-[#7fa08d]">No content available.</p>;
    }

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    let currentListItems: string[] = [];
    let currentParagraphLines: string[] = [];

    const flushList = (key: string | number) => {
        if (currentListItems.length > 0) {
            elements.push(
                <ul key={`list-${key}`} className="list-disc pl-5 my-3 space-y-2">
                    {currentListItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
                            {parseMarkdownInline(item)}
                        </li>
                    ))}
                </ul>
            );
            currentListItems = [];
        }
    };

    const flushParagraph = (key: string | number) => {
        if (currentParagraphLines.length > 0) {
            const content = currentParagraphLines.join(' ');
            elements.push(
                <p key={`p-${key}`} className="my-3 text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6] whitespace-pre-line">
                    {parseMarkdownInline(content)}
                </p>
            );
            currentParagraphLines = [];
        }
    };

    const flushAll = (key: string | number) => {
        flushList(key);
        flushParagraph(key);
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // 1. Empty Line
        if (trimmed === '') {
            flushAll(i);
            continue;
        }

        // 2. Horizontal Rule
        if (/^---+$/.test(trimmed)) {
            flushAll(i);
            elements.push(<hr key={`hr-${i}`} className="my-6 border-[#d5dbd7] dark:border-[#222b27]" />);
            continue;
        }

        // 3. Headings
        const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
        if (headingMatch) {
            flushAll(i);
            const level = headingMatch[1].length;
            const headingContent = headingMatch[2];
            const parsedHeading = parseMarkdownInline(headingContent);

            if (level === 1) {
                elements.push(<h1 key={`h1-${i}`} className="font-serif text-3xl font-light mt-6 mb-3 text-[#1a2620] dark:text-[#e5eae6]">{parsedHeading}</h1>);
            } else if (level === 2) {
                elements.push(<h2 key={`h2-${i}`} className="font-serif text-2xl font-light mt-5 mb-3 text-[#1a2620] dark:text-[#e5eae6]">{parsedHeading}</h2>);
            } else {
                elements.push(<h3 key={`h3-${i}`} className="font-serif text-xl font-medium mt-4 mb-2 text-[#1a2620] dark:text-[#e5eae6]">{parsedHeading}</h3>);
            }
            continue;
        }

        // 4. List Items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('+ ')) {
            flushParagraph(i);
            const itemText = trimmed.replace(/^[-*+]\s+/, '').trim();
            currentListItems.push(itemText);
            continue;
        }

        // 5. Normal Line (Part of paragraph)
        flushList(i);
        currentParagraphLines.push(trimmed);
    }

    // Flush any remaining elements at the end
    flushAll('final');

    return (
        <div className="space-y-1 font-sans text-sm leading-relaxed text-[#1a2620] dark:text-[#e5eae6]">
            {elements}
        </div>
    );
}
