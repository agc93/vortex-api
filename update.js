const fs = require('fs-extra');
const path = require('path');
const request = require('request');
const yaml = require('js-yaml');

async function req(url, headers) {
  return new Promise((resolve, reject) => {
    request.get(
      url,
      { headers: { 'User-Agent': 'node-cli', ...(headers || {}) } },
      (err, response, body) => {
        if (err !== null) {
          return reject(err);
        }
        return resolve(JSON.parse(body));
      });
  });
}

function state(article) {
  return article.state === 'open'
    ? ' (WIP)'
    : '';
}

function time(datetime) {
  return new Date(datetime).toGMTString();
}

function makeIndex(articles) {
  const groups = articles.reduce((prev, article) => {
    const categories = article.labels.filter(label => label.name !== 'Article');
    categories.forEach(cat => {
      if (prev[cat.name] === undefined) {
        prev[cat.name] = [];
      }
      prev[cat.name].push(article);
    });
    return prev;
  }, {});

  let res = `---\nlayout: default\ntitle: Articles\n---\n` + '# Articles\n';

  Object.keys(groups).forEach(group => {
    res += `## ${group}\n`
        + groups[group].map(article =>
          `[${article.title}](articles/${article.title}.md)${state(article)} by ${article.user.login} (Last update: ${time(article.updated_at)})`)
          .join('\n\n')
        + '\n\n'
    ;
  });
  res += '[API Reference](api.html)'
       + '\n\n';

  return res;
}

function makeNav(articles) {
  return '<nav>'
    + articles.map(article => `<a href="articles/${article.title}.md">${article.title}</a>`).join('<br/>')
    + '</nav>';
}

function articleFrame(article, order) {
  const tags = article.labels.map(label => label.name).filter(label => label !== 'Article');
  let pos = order.indexOf(article.title);
  if (pos === -1) {
    pos = 1000;
  }

  const frontMatter = [
    '---',
    'layout: article',
    `author: ${article.user.login}`,
    `created: ${time(article.created_at)}`,
    `updated: ${time(article.updated_at)}`,
    `wip: ${article.state === 'open'}`,
    `title: ${article.title}`,
    `order: ${pos}`,
    `tags:\n${tags.map(tag => `  - ${tag}`).join('\n')}`,
    `comments: ${article.comments}`,
    `issue_url: ${article.html_url}`,
    '---',
  ];
  return frontMatter.join('\n') + '\n'
    + article.body
    + '\n\n'
    + `[Discuss this article](${article.html_url})`;
}

const INVALID_RE = new RegExp('[\\/?*:|"<>]', 'g');

function sanitize(input) {
  return input.replace(INVALID_RE, '_');
}

function articleFileName(article) {
  const date = new Date(article['created_at']);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${sanitize(article.title)}`;
}

// prepend frontmatter tag to the api index file
async function updateApiIndex() {
  const fm = '---\n---\n';
  const dat = await fs.readFile(path.join('docs', 'api', 'README.md'), { encoding: 'utf8' });
  if (!dat.startsWith('---')) {
    await fs.writeFile(path.join('docs', 'api', 'README.md'), fm + dat, { encoding: 'utf8' });
  }
}

async function main() {
  const articles = await req('https://api.github.com/repos/Nexus-Mods/vortex-api/issues?labels=Article&state=all', {
    labels: 'Article',
  });
  // await fs.writeFile(path.join('docs', 'index.md'), makeIndex(articles));
  // await fs.writeFile(path.join('docs', '_includes/navigation.html'), makeNav(articles));
  await updateApiIndex();
  const order = yaml.safeLoad(await fs.readFile(path.join('docs', 'postorder.yml'), { encoding: 'utf8' })).order;
  for (const article of articles) {
    await fs.writeFile(path.join('docs', '_posts', articleFileName(article) + '.md'), articleFrame(article, order));
  }
  console.log(articles);
}

main();

