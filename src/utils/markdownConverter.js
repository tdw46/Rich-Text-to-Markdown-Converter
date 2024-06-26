export function convertToDiscordMarkdown(richText) {
  
  let markdown = richText;

  // Convert headers based on HTML tags
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h[4-6][^>]*>(.*?)<\/h[4-6]>/gi, '#### $1\n\n');

  // Convert headers based on font size and bold
  markdown = markdown.replace(/<(p|div|span)[^>]*style="[^"]*font-size:\s*(\d+)pt;[^"]*font-weight:\s*(?:bold|700)[^"]*"[^>]*>(.*?)<\/\1>/gi, (match, tag, fontSize, content) => {
    const trimmedContent = content;
    if (parseInt(fontSize) > 16) {
      return `# ${trimmedContent}\n\n`;
    } else if (parseInt(fontSize) === 16) {
      return `## ${trimmedContent}\n\n`;
    }
    return `**${trimmedContent}**`;
  });

  // Convert links
  markdown = markdown.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, (match, url, text) => {
    // Remove any HTML tags from the link text
    const cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
    return `[${cleanText}](${url})`;
  });

  // Convert list items with proper nesting
  let listStack = [];
  let listCounter = [0];
  markdown = markdown.replace(/<(ul|ol|li)[^>]*>|<\/(ul|ol|li)>/gi, (match, openTag, closeTag) => {
    if (openTag === 'ul' || openTag === 'ol') {
      listStack.push(openTag);
      listCounter.push(0);
      return '\n';
    } else if (closeTag === 'ul' || closeTag === 'ol') {
      listStack.pop();
      listCounter.pop();
      return '\n';
    } else if (openTag === 'li') {
      const indent = ' '.repeat(Math.max(0, listStack.length - 1) * 3);
      const listType = listStack[listStack.length - 1];
      let marker;
      if (listType === 'ul') {
        marker = '-';
      } else {
        listCounter[listCounter.length - 1]++;
        const count = listCounter[listCounter.length - 1];
        marker = listStack.length > 1 ? String.fromCharCode(96 + count) + '.' : count + '.';
      }
      return `\n${indent}${marker} `;
    } else if (closeTag === 'li') {
      return '\n';
    }
    return '';
  });

  // Convert remaining paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Replace &nbsp; with a single space
  markdown = markdown.replace(/&nbsp;/g, ' ');

  // Preserve all linebreaks
  markdown = markdown.replace(/\r\n|\r|\n/g, '\n');

  // Remove extra spaces at the beginning of lines, but preserve indentation
  markdown = markdown.replace(/^( {3,}| (?!-))/gm, match => match.length >= 3 ? match : '');

  // Ensure no extra newlines are added between list items
  markdown = markdown.replace(/\n+([0-9]+\.|[a-z]\.|[-])/g, '\n$1');

  // Trim extra whitespace and newlines
  markdown = markdown.replace(/\n{3,}/g, '\n')

  return markdown;
}