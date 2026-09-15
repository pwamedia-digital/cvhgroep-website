(function () {
  'use strict';

  var lastEditor = null;

  function isEditable(element) {
    return element && (element.matches('input:not([type="hidden"]), textarea, [contenteditable="true"]'));
  }

  document.addEventListener('focusin', function (event) {
    if (isEditable(event.target)) lastEditor = event.target;
  });

  function run(command) {
    if (!lastEditor || !document.contains(lastEditor)) return;
    lastEditor.focus();
    document.execCommand(command, false, null);
    lastEditor.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function makeButton(label, title, command, shortcut) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'cvh-editor-control';
    button.setAttribute('aria-label', title);
    button.title = title + ' (' + shortcut + ')';
    button.innerHTML = '<span aria-hidden="true">' + label + '</span>';
    button.addEventListener('mousedown', function (event) { event.preventDefault(); });
    button.addEventListener('click', function () { run(command); });
    return button;
  }

  function mount() {
    if (document.getElementById('cvh-editor-controls')) return;
    var controls = document.createElement('div');
    controls.id = 'cvh-editor-controls';
    controls.setAttribute('aria-label', 'Bewerkingsgeschiedenis');
    controls.appendChild(makeButton('↶', 'Laatste wijziging ongedaan maken', 'undo', 'Cmd/Ctrl + Z'));
    controls.appendChild(makeButton('↷', 'Wijziging opnieuw uitvoeren', 'redo', 'Cmd/Ctrl + Shift + Z'));
    document.body.appendChild(controls);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
