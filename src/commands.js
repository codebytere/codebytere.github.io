const rootPath = 'users/codebytere/root';

const struct = {
  root: ['about', 'contact', 'resume', 'talks'],
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

  talks: `<ul>
<li>WeyWeyWeb 2025</li>
<li>SquiggleConf 2025</li>
<li>CityJS Athens 2025</li>
<li>Covalence Conf 2020</li>
<li>NodeConf EU 2019</li>
<li>Nordic.js 2019</li>
<li>QueerJS Stockholm 2019</li>
<li>JSConf Budapest 2019</li>
<li>JSHeroes 2019</li>
<li>Modern JS Runtimes 2019</li>
<li>WaffleJS January 2019</li>
<li>Node Collaborator Summit 2018</li>
<li>Electron Bay Area Meetup 2018</li>
<li>Node Summit 2018</li>
<li>JSConf EU 2018</li>
<li>HackDuke 2017</li>
</ul>
<p><a href="https://github.com/codebytere/talks" target="_blank" rel="noopener">View all slides on GitHub</a></p>`,

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

  root: `<p>about.txt&nbsp;&nbsp;contact.txt&nbsp;&nbsp;resume.txt&nbsp;&nbsp;talks.txt</p>`,
};

const openLinks = {
  github: 'https://github.com/codebytere',
  bluesky: 'https://bsky.app/profile/codebyte.re',
  linkedin: 'https://www.linkedin.com/in/codebytere',
};

export function createCommands() {
  const commands = {};

  commands.help = () => content.help;

  commands.path = (_args, terminal) => {
    const dir = terminal.directory;
    return dir === 'root' ? rootPath : `${rootPath}/${dir}`;
  };

  commands.ls = (directory, terminal) => {
    if (directory === '..' || directory === '~' || !directory) {
      return content[terminal.directory] || content.root;
    }
    if (directory in struct) {
      return content[directory];
    }
    return content[terminal.directory] || content.root;
  };

  commands.cd = (newDirectory, terminal) => {
    const dirs = Object.keys(struct);
    const newDir = newDirectory ? newDirectory.trim() : '';

    if (dirs.includes(newDir) && terminal.directory !== newDir) {
      terminal.directory = newDir;
    } else if (
      newDir === '' ||
      newDir === '~' ||
      (newDir === '..' && dirs.includes(terminal.directory))
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

    const clean = filename.replace(/\.txt$/, '');

    // Check if it's a directory name
    if (clean in struct) {
      return `<span class="error">${terminal.escapeHTML(clean)} is a directory</span>`;
    }

    // Look up in current directory's files
    const currentFiles = struct[terminal.directory] || struct.root;
    if (currentFiles.includes(clean) && content[clean]) {
      return content[clean];
    }

    // Try path like "root/about"
    if (filename.includes('/')) {
      const parts = filename.split('/');
      const dir = parts[0];
      const file = parts.slice(1).join('/').replace(/\.txt$/, '');
      if (struct[dir] && struct[dir].includes(file) && content[file]) {
        return content[file];
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

  return commands;
}
