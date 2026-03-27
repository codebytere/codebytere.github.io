const rootPath = 'users/codebytere/root';

const struct = {
  root: ['about', 'contact', 'resume', 'talks'],
  talks: [
    'weyweyweb-2025',
    'squiggleconf-2025',
    'cityjs-athens-2025',
    'covalence-2020',
    'nodeconf-eu-2019',
    'nordicjs-2019',
    'jsconf-budapest-2019',
    'queerjs-stockholm-2019',
    'jsheroes-2019',
    'modern-js-runtimes-2019',
    'wafflejs-2019',
    'node-collaborator-summit-2018',
    'electron-meetup-2018',
    'node-summit-2018',
    'jsconf-eu-2018',
    'hackduke-2017',
  ],
};

const content = {
  about: `<p>
I'm a primarily backend software engineer based in Berlin, Germany!
<br>
Passionate about clean code, running, exploring, morning crosswords,
and learning any and everything that happens to come my way.
<br>
I work as a core engineer on the Electron JavaScript framework team at Microsoft.
</p>`,

  contact: `<ul>
<li><a href="https://github.com/codebytere" target="_blank" rel="noopener">GitHub</a></li>
<li><a href="https://bsky.app/profile/codebyte.re" target="_blank" rel="noopener">Bluesky</a></li>
<li><a href="https://www.linkedin.com/in/codebytere" target="_blank" rel="noopener">LinkedIn</a></li>
</ul>`,

  resume: `<p><a href="data/csv-resume.pdf" target="_blank" rel="noopener">View My Resume</a></p>`,

  talks: null, // generated dynamically by formatLs

  'weyweyweb-2025': `<p><span class="cyan">WeyWeyWeb 2025</span><br>Exploring Node.js memory management with V8, covering garbage collection types and how to identify and fix memory issues in JavaScript.</p>`,

  'squiggleconf-2025': `<p><span class="cyan">SquiggleConf 2025</span><br>A deep dive into the Electron team's automation approach — guiding principles for deciding what to automate, and real-world examples of productivity improvements.</p>`,

  'cityjs-athens-2025': `<p><span class="cyan">CityJS Athens 2025</span><br>Demystifying V8 garbage collection and memory management in Node.js through real-world examples and practical strategies for writing efficient code.</p>`,

  'covalence-2020': `<p><span class="cyan">Covalence Conf 2020</span><br>Exploring Node.js memory management with V8, garbage collection types, memory issues, and practical tips to avoid common pitfalls.</p>`,

  'nodeconf-eu-2019': `<p><span class="cyan">NodeConf EU 2019</span><br>The journey of a native Electron function to top-level JavaScript — a deep dive through Node.js, Chromium, and V8.</p>`,

  'nordicjs-2019': `<p><span class="cyan">Nordic.js 2019</span><br>Modernizing JavaScript APIs in Electron — from asynchronous JS to getters/setters, balancing innovation with maintenance.</p>`,

  'jsconf-budapest-2019': `<p><span class="cyan">JSConf Budapest 2019</span><br>Modern APIs in Electron — asynchronous JS, getters/setters, and balancing platform-dependent functionality with developer experience.</p>`,

  'queerjs-stockholm-2019': `<p><span class="cyan">QueerJS Stockholm 2019</span><br>The tension between human and bot mediated tasks — Electron's automation work and considerations for choosing what to automate.</p>`,

  'jsheroes-2019': `<p><span class="cyan">JSHeroes 2019</span><br>How event loops in Node.js and Chromium must be reconciled in Electron to enable cross-platform desktop development.</p>`,

  'modern-js-runtimes-2019': `<p><span class="cyan">Modern JS Runtimes 2019</span><br>How features written in C++ or Objective-C get to JavaScript — combining V8, Chromium components, and Node to deliver module APIs.</p>`,

  'wafflejs-2019': `<p><span class="cyan">WaffleJS 2019</span><br>Crossword puzzles as a lens for considering different approaches to software engineering and personal development.</p>`,

  'node-collaborator-summit-2018': `<p><span class="cyan">Node Collaborator Summit 2018</span><br>Requirements and pain points around embedding Node, and how to improve the embedding experience.</p>`,

  'electron-meetup-2018': `<p><span class="cyan">Electron Bay Area Meetup 2018</span><br>How a small team managed a large ecosystem with bots and automation.</p>`,

  'node-summit-2018': `<p><span class="cyan">Node Summit 2018</span><br>The evolution of Electron from atom-shell beginnings to 2018, its role in the JS ecosystem, and the future of desktop runtimes.</p>`,

  'jsconf-eu-2018': `<p><span class="cyan">JSConf EU 2018</span><br>Exploring the conceptual underpinnings of asynchronous programming options available to modern JavaScript developers.</p>`,

  'hackduke-2017': `<p><span class="cyan">HackDuke 2017</span><br>Hackathon talk at Duke University.</p>`,

  help: `<ul>
<li><span class="command">path</span> — display current directory</li>
<li><span class="command">cat</span> <span class="muted">FILENAME</span> — display file contents</li>
<li><span class="command">cd</span> <span class="muted">DIRECTORY</span> — move into directory (cd to return to root)</li>
<li><span class="command">ls</span> — show files in current directory</li>
<li><span class="command">open</span> <span class="muted">LINK</span> — open a contact link (github, bluesky, linkedin)</li>
<li><span class="command">whoami</span> — who am i?</li>
<li><span class="command">history</span> — see your command history</li>
<li><span class="command">clear</span> — clear the terminal</li>
</ul>`,

  root: null, // generated dynamically by formatLs
};

const openLinks = {
  github: 'https://github.com/codebytere',
  bluesky: 'https://bsky.app/profile/codebyte.re',
  linkedin: 'https://www.linkedin.com/in/codebytere',
};

// Format entries into aligned columns like `ls` in a real terminal
function formatLs(dir, cols = 3) {
  const entries = (struct[dir] || []).map((f) =>
    f in struct ? { name: f + '/', isDir: true } : { name: f + '.txt', isDir: false },
  );

  if (entries.length === 0) return '';

  const colWidth = Math.max(...entries.map((e) => e.name.length)) + 2;
  const rows = [];

  for (let i = 0; i < entries.length; i += cols) {
    const row = entries.slice(i, i + cols).map((e) => {
      const padded = e.name.padEnd(colWidth);
      return e.isDir ? `<span class="dir">${padded}</span>` : padded;
    });
    rows.push(row.join(''));
  }

  let html = `<pre style="margin:0">${rows.join('\n')}</pre>`;

  // Add GitHub link for talks directory
  if (dir === 'talks') {
    html += `<p><a href="https://github.com/codebytere/talks" target="_blank" rel="noopener">View all slides on GitHub</a></p>`;
  }

  return html;
}

export function createCommands() {
  const commands = {};

  commands.help = () => content.help;

  commands.path = (_args, terminal) => {
    const dir = terminal.directory;
    return dir === 'root' ? rootPath : `${rootPath}/${dir}`;
  };

  // Normalize input: strip trailing slashes, trim whitespace
  const clean = (str) => (str || '').trim().replace(/\/+$/, '');

  commands.ls = (directory, terminal) => {
    const dir = clean(directory);
    if (!dir || dir === '..' || dir === '~') {
      return formatLs(terminal.directory);
    }
    if (dir in struct) {
      return formatLs(dir);
    }
    // Not a directory — check if it's a file
    const name = dir.replace(/\.txt$/, '');
    // Check current directory
    const currentFiles = struct[terminal.directory] || struct.root;
    if (currentFiles.includes(name)) {
      return name + '.txt';
    }
    // Check path like talks/weyweyweb-2025.txt
    if (dir.includes('/')) {
      const parts = dir.split('/');
      const parentDir = parts[0];
      const file = parts.slice(1).join('/').replace(/\.txt$/, '');
      if (struct[parentDir] && struct[parentDir].includes(file)) {
        return file + '.txt';
      }
    }
    return `<span class="error">no such file or directory: ${directory}</span>`;
  };

  commands.cd = (newDirectory, terminal) => {
    const dirs = Object.keys(struct);
    const newDir = clean(newDirectory);

    if (dirs.includes(newDir) && terminal.directory !== newDir) {
      terminal.directory = newDir;
    } else if (
      newDir === '' ||
      newDir === '~' ||
      newDir === '..' ||
      newDir === '/'
    ) {
      terminal.directory = 'root';
    } else {
      return `<span class="error">not a valid directory: ${terminal.escapeHTML(newDir)}</span>`;
    }
    return null;
  };

  commands.cat = (filename, terminal) => {
    if (!filename) {
      return '<span class="error">usage: cat FILENAME</span>';
    }

    const name = clean(filename).replace(/\.txt$/, '');

    // Check if it's a directory name
    if (name in struct) {
      return `<span class="error">${terminal.escapeHTML(name)} is a directory</span>`;
    }

    // Handle paths like "talks/squiggleconf-2025.txt"
    if (name.includes('/')) {
      const parts = name.split('/');
      const dir = parts[0];
      const file = parts.slice(1).join('/');
      if (struct[dir] && struct[dir].includes(file) && content[file]) {
        return content[file];
      }
      return `<span class="error">file not found: ${terminal.escapeHTML(filename)}</span>`;
    }

    // Look up in current directory's files
    const currentFiles = struct[terminal.directory] || struct.root;
    if (currentFiles.includes(name) && content[name]) {
      return content[name];
    }

    // Also check all directories (so `cat about.txt` works from anywhere)
    for (const dir of Object.keys(struct)) {
      if (struct[dir].includes(name) && content[name]) {
        return content[name];
      }
    }

    return `<span class="error">file not found: ${terminal.escapeHTML(filename)}</span>`;
  };

  commands.history = (_args, terminal) => {
    if (terminal.history.length === 0) {
      return '<span class="muted">no history yet</span>';
    }
    return `<p>${terminal.history.map((cmd, i) => `<span class="muted">${String(i + 1).padStart(3)}</span>  ${terminal.escapeHTML(cmd)}`).join('<br>')}</p>`;
  };

  commands.whoami = () => {
    return '<span class="green">codebytere</span> <span class="muted">—</span> electron maintainer, open source engineer';
  };

  commands.open = (link, terminal) => {
    if (!link) {
      const available = Object.keys(openLinks).join(', ');
      return `<span class="error">usage: open LINK</span><br><span class="muted">available: ${available}</span>`;
    }

    const key = link.toLowerCase().trim();
    if (key in openLinks) {
      window.open(openLinks[key], '_blank', 'noopener');
      return `<span class="muted">opening ${key}...</span>`;
    }

    const available = Object.keys(openLinks).join(', ');
    return `<span class="error">unknown link: ${terminal.escapeHTML(link)}</span><br><span class="muted">available: ${available}</span>`;
  };

  // Write-denied commands
  commands.mkdir = () =>
    '<span class="error">permission denied: no write access</span>';
  commands.touch = () =>
    '<span class="error">permission denied: no write access</span>';
  commands.rm = () =>
    '<span class="error">permission denied: no write access</span>';

  // Helper for tab completion — returns files available in current directory
  commands.__getFiles = (terminal) => {
    const dir = terminal.directory;
    const files = struct[dir] || struct.root;
    return files.map((f) => (f in struct ? f + '/' : f + '.txt'));
  };

  // Helper for tab completion with explicit directory lookup
  commands.__getFilesIn = (dir, terminal) => {
    const lookupDir = dir && dir in struct ? dir : terminal.directory;
    const files = struct[lookupDir] || struct.root;
    return files.map((f) => (f in struct ? f + '/' : f + '.txt'));
  };

  return commands;
}
