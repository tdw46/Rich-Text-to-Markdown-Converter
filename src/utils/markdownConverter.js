export function convertToDiscordMarkdown(richText) {
  console.log("Starting conversion with input:", richText);
  
  let markdown = richText;

  // Convert headers based on HTML tags
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h[4-6][^>]*>(.*?)<\/h[4-6]>/gi, '#### $1\n\n');

  // Convert headers based on font size and bold
  markdown = markdown.replace(/<(p|div|span)[^>]*style="[^"]*font-size:\s*(\d+)pt;[^"]*font-weight:\s*(?:bold|700)[^"]*"[^>]*>(.*?)<\/\1>/gi, (match, tag, fontSize, content) => {
    const trimmedContent = content.trim();
    if (parseInt(fontSize) > 16) {
      return `# ${trimmedContent}\n\n`;
    } else if (parseInt(fontSize) === 16) {
      return `## ${trimmedContent}\n\n`;
    }
    return `**${trimmedContent}**\n\n`;
  });

  // Convert list items with proper nesting
  let listStack = [];
  markdown = markdown.replace(/<(ul|ol|li)[^>]*>|<\/(ul|ol|li)>/gi, (match, openTag, closeTag) => {
    if (openTag === 'ul' || openTag === 'ol') {
      listStack.push(openTag);
      return '';
    } else if (closeTag === 'ul' || closeTag === 'ol') {
      listStack.pop();
      return '';
    } else if (openTag === 'li') {
      const indent = ' '.repeat(Math.max(0, listStack.length - 1) * 2);
      const nestedSpace = listStack.length > 1 ? '' : ''; // Add space for nested items
      return `${indent}${nestedSpace}- `;
    } else if (closeTag === 'li') {
      return '';
    }
    return '';
  });

  // Convert remaining paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n');

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]+>/g, '');

  // Replace &nbsp; with a single space
  markdown = markdown.replace(/&nbsp;/g, ' ');

  // Preserve all linebreaks
  markdown = markdown.replace(/\r\n|\r|\n/g, '\n');

  // Ensure no extra newlines are added between list items
  markdown = markdown.replace(/\n+(-\s)/g, '\n$1');

  // Add newline after labels followed by a list
  markdown = markdown.replace(/^(.+:)\s*\n(- )/gm, '$1\n$2');

  // Trim extra whitespace and newlines, but keep double newlines
  markdown = markdown.replace(/\n{3,}/g, '\n').trim();

  console.log("Final conversion output:", markdown);
  return markdown;
}