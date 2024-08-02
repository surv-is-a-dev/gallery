(function (Scratch) {
    'use strict';
    
    class extension {
        constructor() {
            this.blocks = [{
                opcode: 'block',
                blockType: Scratch.BlockType.COMMAND,
                text: 'test block',
            }, {
                opcode: 'reporter',
                blockType: Scratch.BlockType.REPORTER,
                text: 'test reporter',
            }];

            // vvv you need to run this you want to use it
            this.setupColours();
        }
        
        

        // vvv the actual patch
        // @ts-ignore Custom + Not typed yet.
        /* prettier-ignore */setupColours(){/**! https://scratch.mit.edu/users/0znzw/ */this.registerColours=this.registerColours??(()=>{}),this.$cuPatch_createColourMappings=function(r,t,o,c){return{primary:r,color1:r,secondary:t??r,color2:t??r,tertiary:o??r,color3:o??r,quaternary:c??r,color4:c??r}},this.$cuPatch_createExtensionColours=function(r,t){if(!r)return;if(t=t??{},!t?.primary&&!t?.color1)throw new Error('"${extensionId}" colours must have "primary" or "color1" set.');t.primary=t.color1??t.primary,t.secondary=t.color2??t.secondary??t.primary,t.tertiary=t.color3??t.tertiary??t.secondary,t.quaternary=t.color4??t.quaternary??t.tertiary;const o=`colours_${r}`;if(!ScratchBlocks.Extensions.ALL_[o])return ScratchBlocks.Extensions.register(o,(function(){this.setColourFromRawValues_(t.primary,t.secondary,t.tertiary,t.quaternary)})),o},this.$cuPatch_tryScratchBlocks=function(r){window.ScratchBlocks&&(vm.removeListener("EXTENSION_ADDED",this.$cuPatch_tryScratchBlocks),vm.removeListener("BLOCKSINFO_UPDATE",this.$cuPatch_tryScratchBlocks),this?.registerColours?.call(this,this.$cuPatch_createExtensionColours,this.$cuPatch_createColourMappings))}.bind(this);let r=!1;ReduxStore?.subscribe((()=>{const t=ReduxStore.getState();r!==t.scratchGui.mode.hasEverEnteredEditor&&(r=!0,this.$cuPatch_tryScratchBlocks(this.registerColours))})),vm.on("EXTENSION_ADDED",(()=>{this.$cuPatch_tryScratchBlocks(this.registerColours)})),vm.on("BLOCKSINFO_UPDATE",(()=>{this.$cuPatch_tryScratchBlocks(this.registerColours)})),this.$cuPatch_tryScratchBlocks(this.registerColours)}
        
        // vvv this is called when you run setupColours
        registerColours(registerColors, colorMappings) {
            const myInfo = this.getInfo();

            // vvv this will make the color object you need, this also create the color1-4 variable to. (takes 4 arguments in the form of hex code strings)
            const colors = colorMappings(myInfo.color1);
            // vvv this registers the color and returns the "extension id" so that you can use it (just put it in the extensions array on all your blocks)
            const colorExtensionId = registerColors(myInfo.id, colors);

            // vvv this is optional, it just maps all the blocks and adds the extension id to them
            this.blocks = this.blocks.map(/** @argument {Object} block */block => (typeof block !== 'object' ? block : {
                ...block,
                extensions: [...(block?.extensions ?? []), colorExtensionId]
            }));
        }
        
        getInfo() {
            return {
                id: '0znzwColourPatch',
                name: 'Colour Patch',
                color1: '#000000',
                blocks: this.blocks
            };
        }
        block() { return; }
        reporter() { return; }
    }
    
    Scratch.extensions.register(new extension);
})(Scratch);