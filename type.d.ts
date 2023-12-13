import type { Plugin, EventMenu, IProtyle } from 'siyuan';

type Constructor<T> = new (...args: any) => T

declare module 'siyuan-package-custom-block' {
    export abstract class CustomBlock {
        private plugin: Plugin;
    
        static el: HTMLElement;
        static type: string;
        onMount(el: HTMLElement, data: any, plugin: Plugin): void;
        
        onBlockMenu(e: CustomEvent<{
            menu: EventMenu,
            protyle: IProtyle,
            blockElements: HTMLElement[],
        }>): void
    }
    export class CustomBlockManager {
        private plugin: Plugin;

        static init(plugin: Plugin): void;
        static load(BlockConstructor: Constructor<CustomBlock>): void;
        static buildBlock(type: string, data: any): string;
        static build(type: string, data: any): { id: string, content: string };
    }
}
