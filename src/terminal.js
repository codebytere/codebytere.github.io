export class Terminal {
  constructor(containerEl, commands) {
    this.container = containerEl;
    this.commands = commands;
    this.hiddenInput = document.getElementById('terminal-input');
    this.history = [];
    this.historyIndex = -1;
    this.browsingHistory = false;
    this.directory = 'root';

    this.setupListeners();
    this.focusInput();
  }

  setupListeners() {
    // Click anywhere in terminal → focus input
    this.container.addEventListener('click', () => this.focusInput());

    this.hiddenInput.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          this.handleEnter();
          break;

        case 'ArrowUp':
          e.preventDefault();
          this.navigateHistory(-1);
          break;

        case 'ArrowDown':
          e.preventDefault();
          this.navigateHistory(1);
          break;

        case 'Tab':
          e.preventDefault();
          this.handleTab();
          break;

        case 'Escape':
          e.preventDefault();
          const win = document.querySelector('.terminal-window');
          win.classList.remove('minimized');
          win.classList.toggle('fullscreen');
          break;
      }
    });

    // Mirror hidden input to visible prompt
    this.hiddenInput.addEventListener('input', () => {
      this.updateVisibleInput();
      this.browsingHistory = false;
    });
  }

  focusInput() {
    this.hiddenInput.focus();
  }

  updateVisibleInput() {
    const el = this.container.querySelector('.active-input');
    if (el) {
      el.textContent = this.hiddenInput.value;
    }
  }

  handleEnter() {
    const raw = this.hiddenInput.value.trim();
    const activeLine = this.container.querySelector('.active-prompt');

    // Freeze the current prompt line
    if (activeLine) {
      const inputSpan = activeLine.querySelector('.active-input');
      if (inputSpan) {
        inputSpan.textContent = raw;
        inputSpan.classList.remove('active-input');
      }
      const cursor = activeLine.querySelector('.cursor');
      if (cursor) cursor.remove();
      activeLine.classList.remove('active-prompt');
    }

    if (!raw) {
      this.createPrompt();
      return;
    }

    // Parse command
    const parts = raw.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    // Add to history
    this.history.push(raw);
    this.historyIndex = this.history.length;
    this.browsingHistory = false;

    if (cmd === 'clear') {
      this.clearConsole();
      return;
    }

    if (cmd in this.commands) {
      const output = this.commands[cmd](args, this);
      if (output) {
        this.printHTML(output);
      }
    } else {
      const suggestion = this.findSimilar(cmd);
      let msg = `<span class="error">command not found: ${this.escapeHTML(cmd)}</span>`;
      if (suggestion) {
        msg += `<span class="muted"> — did you mean </span><span class="command">${suggestion}</span><span class="muted">?</span>`;
      } else {
        msg += `<span class="muted"> — type </span><span class="command">help</span><span class="muted"> for available commands</span>`;
      }
      this.printHTML(msg);
    }

    this.createPrompt();
  }

  navigateHistory(direction) {
    if (this.history.length === 0) return;

    if (!this.browsingHistory) {
      this.browsingHistory = true;
      this.historyIndex = this.history.length;
    }

    const newIndex = this.historyIndex + direction;

    if (newIndex < 0 || newIndex > this.history.length) return;

    this.historyIndex = newIndex;

    if (newIndex === this.history.length) {
      this.hiddenInput.value = '';
    } else {
      this.hiddenInput.value = this.history[newIndex];
    }

    this.updateVisibleInput();
  }

  handleTab() {
    const raw = this.hiddenInput.value;
    const hasSpace = raw.includes(' ');
    const parts = raw.split(/\s+/).filter((p) => p !== '');

    let candidates = [];

    if (parts.length <= 1 && !hasSpace) {
      // Complete command name
      const prefix = parts[0].toLowerCase();
      candidates = Object.keys(this.commands).filter((c) =>
        c.startsWith(prefix),
      );

      if (candidates.length === 1) {
        this.hiddenInput.value = candidates[0] + ' ';
        this.updateVisibleInput();
      } else if (candidates.length > 1) {
        this.printHTML(
          `<span class="tab-options">${candidates.join('  ')}</span>`,
        );
        // Apply common prefix
        const common = this.commonPrefix(candidates);
        if (common.length > prefix.length) {
          this.hiddenInput.value = common;
          this.updateVisibleInput();
        }
      }
    } else {
      // Complete filename argument
      const cmd = parts[0].toLowerCase();
      const partial = (parts.slice(1).join(' ') || '').toLowerCase();

      // Check if partial contains a directory prefix like "talks/wey"
      let dirPrefix = '';
      let filePartial = partial;
      let lookupDir = null;

      if (partial.includes('/')) {
        const slashIdx = partial.lastIndexOf('/');
        dirPrefix = partial.slice(0, slashIdx + 1);
        filePartial = partial.slice(slashIdx + 1);
        lookupDir = partial.slice(0, slashIdx);
      }

      const files = this.commands.__getFilesIn
        ? this.commands.__getFilesIn(lookupDir, this)
        : this.commands.__getFiles
          ? this.commands.__getFiles(this)
          : [];

      candidates = files.filter((f) =>
        f.toLowerCase().startsWith(filePartial),
      );

      if (candidates.length === 1) {
        this.hiddenInput.value = cmd + ' ' + dirPrefix + candidates[0];
        this.updateVisibleInput();
      } else if (candidates.length > 1) {
        this.printHTML(
          `<span class="tab-options">${candidates.join('  ')}</span>`,
        );
        const common = this.commonPrefix(candidates);
        if (common.length > filePartial.length) {
          this.hiddenInput.value = cmd + ' ' + dirPrefix + common;
          this.updateVisibleInput();
        }
      }
    }
  }

  commonPrefix(strings) {
    if (strings.length === 0) return '';
    let prefix = strings[0];
    for (let i = 1; i < strings.length; i++) {
      while (!strings[i].startsWith(prefix)) {
        prefix = prefix.slice(0, -1);
      }
    }
    return prefix;
  }

  findSimilar(input) {
    const cmds = Object.keys(this.commands).filter(
      (c) => !c.startsWith('__'),
    );
    let best = null;
    let bestDist = Infinity;

    for (const cmd of cmds) {
      const dist = this.levenshtein(input.toLowerCase(), cmd.toLowerCase());
      if (dist < bestDist && dist <= 2) {
        bestDist = dist;
        best = cmd;
      }
    }
    return best;
  }

  levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  printHTML(html) {
    const div = document.createElement('div');
    div.classList.add('output-line');
    div.innerHTML = html;
    this.container.appendChild(div);
    this.scrollToBottom();
  }

  printText(text) {
    this.printHTML(this.escapeHTML(text));
  }

  createPrompt() {
    const line = document.createElement('div');
    line.classList.add('prompt-line', 'active-prompt');
    line.innerHTML = `<span class="prompt"><span class="prompt-user">${this.escapeHTML(this.directory)}</span> <span class="prompt-tick">❯</span></span><span class="prompt-input active-input"></span><span class="cursor"></span>`;
    this.container.appendChild(line);
    this.hiddenInput.value = '';
    this.scrollToBottom();
    this.focusInput();
  }

  clearConsole() {
    this.container.innerHTML = '';
    this.createPrompt();
  }

  scrollToBottom() {
    this.container.scrollTop = this.container.scrollHeight;
  }

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  async typeText(text, speed = 30) {
    const line = document.createElement('div');
    line.classList.add('output-line');
    this.container.appendChild(line);

    for (const char of text) {
      line.textContent += char;
      this.scrollToBottom();
      await new Promise((r) => setTimeout(r, speed));
    }
  }
}
