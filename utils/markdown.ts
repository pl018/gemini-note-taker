export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function parseMarkdown(src: string): string {
  let text = escapeHtml(src);

  // code blocks
  text = text.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`);

  // inline code
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // headings
  text = text.replace(/^### (.*)$/gm, '<h3>$1</h3>');
  text = text.replace(/^## (.*)$/gm, '<h2>$1</h2>');
  text = text.replace(/^# (.*)$/gm, '<h1>$1</h1>');

  // bold and italics
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // unordered lists
  text = text.replace(/(^|\n)(?:- |\* )(.*(?:\n(?:- |\* ).+)*)/g, (_m, lead, block) => {
    const items = block.split(/\n/).map(line => line.replace(/^[-*] /, ''));
    return `${lead}<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  });

  // paragraphs
  const parts = text.split(/\n{2,}/).filter(p => p.trim() !== '');
  return parts.map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');
}
