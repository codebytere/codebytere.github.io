import { Terminal } from './terminal.js';
import { createCommands } from './commands.js';

document.addEventListener('DOMContentLoaded', async () => {
  const terminalEl = document.getElementById('terminal');
  const terminalWindow = document.querySelector('.terminal-window');
  const reopenPrompt = document.querySelector('.reopen-prompt');
  const commands = createCommands();
  const terminal = new Terminal(terminalEl, commands);

  // Window buttons
  document.querySelector('.btn.fullscreen').addEventListener('click', () => {
    terminalWindow.classList.toggle('fullscreen');
  });

  document.querySelector('.btn.minimize').addEventListener('click', () => {
    terminalWindow.classList.toggle('minimized');
  });

  document.querySelector('.btn.close').addEventListener('click', () => {
    terminalWindow.classList.add('closed');
    reopenPrompt.classList.add('visible');
  });

  reopenPrompt.addEventListener('click', () => {
    terminalWindow.classList.remove('closed');
    reopenPrompt.classList.remove('visible');
    terminal.focusInput();
  });

  // Greeting with typing animation
  await terminal.typeText('\\[._.]/  welcome to codebyte.re', 25);
  terminal.printHTML(
    '<span class="muted">type <span class="command">help</span> to get started</span>',
  );
  terminal.createPrompt();
});
