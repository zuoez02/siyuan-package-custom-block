import type { Plugin } from 'siyuan';

declare module 'siyuan-package-custom-block' {
    export class CustomBlock {
        static el: HTMLElement;
        static type: string;
        constructor(options: { plugin: Plugin });
        onMount(el: HTMLElement, data: any, plugin: Plugin): void;
    }
    export class CustomBlockManager {
        private plugin: Plugin;

        static init(plugin: Plugin): void;
        static load(BlockConstructor: Constructor<CustomBlock>): void;
        static buildBlock(type: string, data: any): string;
        static build(type: string, data: any): { id: string, content: string };
    }
}
