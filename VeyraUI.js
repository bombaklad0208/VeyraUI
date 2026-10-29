
/* VeyraUI v1.0.0 — Multi-tab browser UI library */
(() => {
  "use strict";

  const ID = "veyra-ui";
  document.getElementById(ID)?.remove();
  document.getElementById(ID + "-css")?.remove();

  const css = document.createElement("style");
  css.id = ID + "-css";
  css.textContent = `
    #${ID}, #${ID} * { box-sizing: border-box; }
    #${ID} {
      position: fixed; left: 50%; top: 50%;
      transform: translate(-50%,-50%);
      width: 720px; height: 490px; max-width: 95vw;
      max-height: 85vh; z-index: 2147483647;
      display: flex; overflow: hidden;
      color: #f3f0ff; background: #0c0b13;
      border: 1px solid #8b5cf6; border-radius: 14px;
      box-shadow: 0 20px 90px #000b;
      font: 13px/1.5 system-ui, sans-serif;
    }
    #${ID} button, #${ID} input, #${ID} select {
      font: inherit; color: inherit;
    }
    #${ID} button { cursor: pointer; }
    #${ID} .sidebar {
      width: 180px; flex-shrink: 0; padding: 15px 10px;
      display: flex; flex-direction: column;
      background: #11101b; border-right: 1px solid #282439;
    }
    #${ID} .brand {
      font-size: 21px; font-weight: 850;
      letter-spacing: -.8px; padding: 4px 8px 15px;
      color: #c4a8ff;
    }
    #${ID} .tabs { flex: 1; overflow-y: auto; }
    #${ID} .nav, #${ID} .newtab {
      display: block; width: 100%; text-align: left;
      padding: 9px 10px; margin-bottom: 4px;
      border: 0; border-radius: 7px; background: transparent;
    }
    #${ID} .nav:hover, #${ID} .newtab:hover {
      background: #201b32;
    }
    #${ID} .nav.active {
      background: linear-gradient(100deg,#7042d9,#4824a6);
    }
    #${ID} .newtab {
      border: 1px dashed #51416e; color: #c5aaff;
      margin-top: 8px;
    }
    #${ID} .status {
      color: #9b96b2; font-size: 11px; padding: 10px 6px 0;
    }
    #${ID} .main {
      display: flex; flex-direction: column; flex: 1; min-width: 0;
    }
    #${ID} .top {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 17px; border-bottom: 1px solid #29243a;
      cursor: move; user-select: none;
    }
    #${ID} .title { font-size: 17px; font-weight: 750; }
    #${ID} .subtitle { color: #9993b3; font-size: 11px; }
    #${ID} .close {
      border: 0; background: transparent; color: #c5aaff;
      font-size: 23px; padding: 0 5px;
    }
    #${ID} .content { flex: 1; padding: 16px; overflow: auto; }
    #${ID} .element {
      padding: 13px; margin-bottom: 10px;
      border: 1px solid #2c2740; border-radius: 10px;
      background: linear-gradient(120deg,#151321,#11101a);
    }
    #${ID} .element-head {
      display: flex; align-items: center;
      justify-content: space-between; gap: 15px;
    }
    #${ID} .info { min-width: 0; flex: 1; }
    #${ID} .label { font-weight: 650; }
    #${ID} .desc { color: #9994b2; font-size: 12px; margin-top: 2px; }
    #${ID} .primary {
      background: #7545df; border: 1px solid #956bff;
      border-radius: 7px; padding: 8px 13px;
    }
    #${ID} .primary:hover { background: #8759ef; }
    #${ID} select {
      max-width: 175px; width: 45%;
      background: #1a1728; border: 1px solid #51416e;
      border-radius: 7px; padding: 8px;
    }
    #${ID} .switch {
      width: 41px; height: 23px; flex-shrink: 0;
      border: 0; border-radius: 20px; padding: 3px;
      background: #373247;
    }
    #${ID} .switch::after {
      content: ""; display: block; height: 17px; width: 17px;
      background: white; border-radius: 50%; transition: .15s;
    }
    #${ID} .switch.on { background: #8855f4; }
    #${ID} .switch.on::after { transform: translateX(18px); }
    #${ID} .range { display: flex; align-items: center; gap: 10px; }
    #${ID} input[type=range] { width: 135px; accent-color: #a783ff; }
    #${ID} .number { color: #c4a8ff; min-width: 28px; text-align: right; }
    #${ID} .empty { color: #88829f; padding: 24px 5px; }
    #${ID} .toast {
      position: absolute; right: 13px; bottom: 13px;
      max-width: 280px; background: #211a33;
      border: 1px solid #8054dc; border-radius: 9px;
      padding: 12px 16px; box-shadow: 0 5px 25px #0008;
    }
    #${ID} .toast strong { display: block; }
    @media(max-width: 520px) {
      #${ID} .sidebar { width: 125px; }
      #${ID} .content { padding: 9px; }
      #${ID} .element-head { gap: 7px; }
    }
  `;
  document.head.appendChild(css);

  const root = document.createElement("div");
  root.id = ID;
  root.innerHTML = `
    <aside class="sidebar">
      <div class="brand">✦ VeyraUI</div>
      <div class="tabs"></div>
      <button class="newtab">＋ New Tab</button>
      <div class="status">● VeyraUI loaded</div>
    </aside>
    <section class="main">
      <header class="top">
        <div>
          <div class="title">Welcome</div>
          <div class="subtitle">Your interface, your rules.</div>
        </div>
        <button class="close" title="Close UI">×</button>
      </header>
      <div class="content"></div>
    </section>`;
  document.body.appendChild(root);

  const $ = s => root.querySelector(s);
  const tabsEl = $(".tabs");
  const contentEl = $(".content");
  const titleEl = $(".title");
  const subtitleEl = $(".subtitle");
  const tabs = [];
  let active = null;
  let toastTimer;

  const node = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  function notify({ title = "VeyraUI", content = "" } = {}) {
    root.querySelector(".toast")?.remove();
    clearTimeout(toastTimer);
    const toast = node("div", "toast");
    toast.append(node("strong", "", title));
    toast.append(node("div", "", content));
    root.appendChild(toast);
    toastTimer = setTimeout(() => toast.remove(), 3000);
  }

  function createWindow(options = {}) {
    $(".brand").textContent = "✦ " + (options.name || "VeyraUI");
    subtitleEl.textContent = options.subtitle || "Your interface, your rules.";
    if (options.width) root.style.width = options.width + "px";
    if (options.height) root.style.height = options.height + "px";

    function selectTab(tab) {
      active = tab;
      titleEl.textContent = tab.name;
      tabs.forEach(t => t.nav.classList.toggle("active", t === tab));
      contentEl.replaceChildren();

      if (!tab.items.length) {
        contentEl.append(node("div", "empty", "This tab is empty. Add a control in your script."));
      } else {
        tab.items.forEach(item => contentEl.appendChild(item.element));
      }
    }

    function createTab(config = {}) {
      const tab = {
        name: config.name || "New Tab",
        icon: config.icon || "",
        items: []
      };

      tab.nav = node("button", "nav");
      tabsEl.appendChild(tab.nav);

      function updateNav() {
        tab.nav.textContent = (tab.icon ? tab.icon + "  " : "") + tab.name;
      }
      updateNav();

      tab.nav.addEventListener("click", () => selectTab(tab));
      tabs.push(tab);

      function addControl(config, build) {
        const card = node("div", "element");
        const row = node("div", "element-head");
        const info = node("div", "info");
        const label = node("div", "label", config.name || "Control");
        const desc = node("div", "desc", config.description || "");
        info.append(label, desc);
        row.appendChild(info);
        card.appendChild(row);

        const control = {
          element: card,
          setName(value) { label.textContent = value; return control; },
          setDescription(value) { desc.textContent = value; return control; },
          setVisible(value) { card.hidden = !value; return control; }
        };

        build({ row, control });
        tab.items.push(control);
        if (active === tab) contentEl.appendChild(card);
        return control;
      }

      tab.CreateButton = config => addControl(config, ({ row, control }) => {
        const button = node("button", "primary", config.buttonText || "Run");
        button.addEventListener("click", () => {
          try { config.callback?.(); }
          catch (error) {
            console.error("[VeyraUI]", error);
            notify({ title: "Action failed", content: error.message });
          }
        });
        row.appendChild(button);
        control.setButtonText = text => {
          button.textContent = text; return control;
        };
        control.setCallback = fn => {
          config.callback = fn; return control;
        };
      });

      tab.CreateToggle = config => addControl(config, ({ row, control }) => {
        let value = Boolean(config.defaultValue);
        const button = node("button", "switch" + (value ? " on" : ""));
        button.setAttribute("aria-pressed", String(value));
        button.setAttribute("aria-label", config.name || "Toggle");

        function setValue(next, fire = true) {
          value = Boolean(next);
          button.classList.toggle("on", value);
          button.setAttribute("aria-pressed", String(value));
          if (fire) config.callback?.(value);
        }

        button.addEventListener("click", () => setValue(!value));
        row.appendChild(button);
        control.getValue = () => value;
        control.setValue = v => { setValue(v); return control; };
        control.setCallback = fn => { config.callback = fn; return control; };
      });

      tab.CreateDropdown = config => addControl(config, ({ row, control }) => {
        let options = [...(config.options || [])];
        const select = node("select");
        row.appendChild(select);

        function render() {
          select.replaceChildren();
          options.forEach(value => {
            const opt = node("option", "", String(value));
            opt.value = String(value);
            select.appendChild(opt);
          });
          if (options.length) {
            select.value = String(config.defaultValue ?? options[0]);
          }
        }

        render();
        select.addEventListener("change", () => config.callback?.(select.value));
        control.getValue = () => select.value;
        control.setValue = value => { select.value = String(value); return control; };
        control.setOptions = values => {
          options = [...values];
          render();
          config.callback?.(select.value);
          return control;
        };
        control.setCallback = fn => { config.callback = fn; return control; };
      });

      tab.CreateSlider = config => addControl(config, ({ row, control }) => {
        const min = Number(config.min ?? 0);
        const max = Number(config.max ?? 100);
        const step = Number(config.step ?? 1);
        const input = document.createElement("input");
        input.type = "range";
        input.min = min;
        input.max = max;
        input.step = step;
        input.value = config.defaultValue ?? min;

        const number = node("span", "number", input.value);
        const wrap = node("div", "range");
        wrap.append(input, number);
        row.appendChild(wrap);

        function setValue(value, fire = true) {
          input.value = String(Math.max(min, Math.min(max, Number(value))));
          number.textContent = input.value;
          if (fire) config.callback?.(Number(input.value));
        }

        input.addEventListener("input", () => setValue(input.value));
        control.getValue = () => Number(input.value);
        control.setValue = value => { setValue(value); return control; };
        control.setCallback = fn => { config.callback = fn; return control; };
      });

      tab.SetName = name => {
        tab.name = name;
        updateNav();
        if (active === tab) titleEl.textContent = name;
        return tab;
      };

      tab.Select = () => selectTab(tab);
      tab.Destroy = () => {
        const index = tabs.indexOf(tab);
        if (index < 0) return;
        tabs.splice(index, 1);
        tab.nav.remove();
        tab.items.forEach(item => item.element.remove());
        if (active === tab) {
          active = null;
          if (tabs.length) selectTab(tabs[0]);
          else {
            titleEl.textContent = "Welcome";
            contentEl.replaceChildren(node("div", "empty", "Create a new tab to get started."));
          }
        }
      };

      if (!active) selectTab(tab);
      return tab;
    }

    $(".newtab").addEventListener("click", () => {
      const name = prompt("Name your new tab:");
      if (!name?.trim()) return;
      createTab({ name: name.trim() });
    });

    return {
      CreateTab: createTab,
      Notify: notify,
      GetTabs: () => [...tabs],
      Destroy() {
        clearTimeout(toastTimer);
        root.remove();
        css.remove();
      }
    };
  }

  // Drag the window by its header.
  const header = $(".top");
  header.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    const rect = root.getBoundingClientRect();
    const startX = event.clientX;
    const startY = event.clientY;
    const left = rect.left;
    const top = rect.top;

    root.style.left = left + "px";
    root.style.top = top + "px";
    root.style.transform = "none";
    header.setPointerCapture(event.pointerId);

    const move = e => {
      root.style.left = Math.max(0, Math.min(
        innerWidth - root.offsetWidth, left + e.clientX - startX
      )) + "px";
      root.style.top = Math.max(0, Math.min(
        innerHeight - root.offsetHeight, top + e.clientY - startY
      )) + "px";
    };
    const up = () => {
      header.removeEventListener("pointermove", move);
      header.removeEventListener("pointerup", up);
      header.removeEventListener("pointercancel", up);
    };
    header.addEventListener("pointermove", move);
    header.addEventListener("pointerup", up);
    header.addEventListener("pointercancel", up);
  });

  $(".close").addEventListener("click", () => {
    clearTimeout(toastTimer);
    root.remove();
    css.remove();
  });

  window.VeyraUI = {
    CreateWindow: createWindow,
    Notify: notify,
    Destroy() {
      clearTimeout(toastTimer);
      root.remove();
      css.remove();
    },
    Version: "1.0.0"
  };

  console.log("VeyraUI v1.0.0 loaded. Use VeyraUI.CreateWindow(...).");
})();
