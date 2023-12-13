/* 
    Copyright: zuoez02@outlook.com
*/
class CustomBlockManager {
    static blocks = new Map();
    static protyles = new Map();
    static blockConstructors = new Map();
  
    static init(plugin) {
      if (!plugin) {
        throw new Error("block manager must init with plugin parameter");
      }
      this.plugin = plugin;
      plugin.eventBus.on("loaded-protyle-static", () => this.handleChange());
      plugin.eventBus.on("ws-main", () => this.handleChange());
    }
  
    static load(BlockConstructor) {
      this.blockConstructors.set(BlockConstructor.type, BlockConstructor);

      this.plugin.eventBus.on('click-blockicon', (e) => {
        if (e.detail.blockElements[0].getAttribute('custom-plugin-id') === this.plugin.name) {
          BlockConstructor.onBlockMenu && BlockConstructor.onBlockMenu(e);
        }
      })
    }
  
    static build(type, data) {
      const constructor = this.blockConstructors.get(type);
      if (!constructor) {
        throw new Error(
          `Block type ${type} is not loaded by custom block manager`
        );
      }
      const block = new constructor({ plugin: this.plugin });
      const { id, content } = block._onBuild(type, data);
      const ial = `{: custom-plugin-id="${plugin.name}" id="${content.id}"}`;
      const result = content + '\n' + ial;
      return { id, content, dom: content, ial, result };
    }
  
    static buildBlock(type, data) {
      const { result } = this.build(type, data);
      return result;
    }
  
    static handleChange() {
      const doms = document.querySelectorAll("protyle-html");
      doms.forEach((protyle) => {
        if (this.protyles.has(protyle)) {
          return;
        }
        const content = protyle.getAttribute("data-content");
        const hasPlugin =
          content.indexOf(`data-plugin="${this.plugin.name}"`) >= 0;
        if (!hasPlugin) {
          return;
        }
        const shadowRoot = protyle.shadowRoot;
        const blockEl = shadowRoot.querySelector(
          `div[data-plugin="${this.plugin.name}"]`
        );
        if (blockEl) {
          const id = blockEl.getAttribute("data-custom-block-id");
          this.protyles.set(protyle, id);
          let block = this.blocks.get(id);
          if (block) {
            return;
          }
          const type = blockEl.getAttribute("data-type");
          const constructor = this.blockConstructors.get(type);
          if (!type) {
            return;
          }
          let data = blockEl.getAttribute("data-custom-block-data");
          data = data ? JSON.parse(decodeURI(data)) : {};
          block = new constructor({ plugin: this.plugin });
          this.blocks.set(id, block);
          block.onMount && block.onMount(blockEl, data, this.plugin);
          blockEl.setAttribute("style", "cursor: initial;");
          if (constructor.css) {
            blockEl.insertAdjacentHTML(
              "afterbegin",
              `<style>${constructor.css}</style>`
            );
          }
  
          blockEl.addEventListener("DOMNodeRemoved", () => {
            this.blocks.delete(id);
            this.protyles.delete(protyle);
            this.blocks.delete(id);
            block.onDestroyed();
          });
        }
      });
    }
  }
  
  class CustomBlock {
    el = null;
  
    constructor(options) {
      this.plugin = options.plugin;
    }
  
    _onBuild(type, data) {
      const randomId = window.Lute.NewNodeID();
      const d = data ? JSON.stringify(data) : "{}";
      const content = `<div><div data-custom-block-id="${randomId}" data-custom-block-data="${encodeURI(
        d
      )}" data-type="${type}" data-plugin="${this.plugin.name}"></div></div>`;
      return { id: randomId, content };
    }
  }

  module.exports = {
    CustomBlockManager,
    CustomBlock,
  };
