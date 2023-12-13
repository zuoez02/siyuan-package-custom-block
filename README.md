# Siyuan Package Custom Block

> SiYuan Custom Block helper based on HTML block.

## Core logic

Add a root node in HTML block as a root of morden app. Storage initial data in the `data-custom-bloc k-data` attribute of element, `data-type` for block type identifier of current plugin, `data-plugin` for different plugin.

## Generate Content Example
```kramdown
<div><div data-custom-block-id="20230817220934-xfjsliu" data-custom-block-data="%7B%7D" data-type="DataviewBlock" data-plugin="siyuan-plugin-dataview"></div></div>
{: id="20230817220934-xfjsliu" updated="20237422934"}
```

## Plugin Code Example 
```javascript
const siyuan = require("siyuan");
const { CustomBlock, CustomBlockManager } = require('siyuan-package-custom-block');

class CarouselBlock extends CustomBlock {
  static type = "CarouselBlock";
  static css = ".hello { color: red; }";

  onMount(el, data, plugin) {
    console.log("hello world");
    el.insertAdjacentHTML(
      "afterbegin",
      `<div class="hello">hello ${data.name}</div>`
    );
  }
}

module.exports = class P extends siyuan.Plugin {
  onload() {
    CustomBlockManager.init(this);
    CustomBlockManager.load(CarouselBlock);
    const content = CustomBlockManager.buildBlock(CarouselBlock.type, {
      name: "123",
    });
    console.log(content);
  }
};
```