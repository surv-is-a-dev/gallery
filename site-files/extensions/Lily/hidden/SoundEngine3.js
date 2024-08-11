(function (Scratch) {
  "use strict";

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const soundCategory = runtime.ext_scratch3_sound;

  var contextGroups = {};
  var loadedSounds = {};

  const label = (name, hidden) => ({
    blockType: Scratch.BlockType.LABEL,
    text: name,
    hideFromPalette: hidden,
  });

  class SoundEngine {
    getInfo() {
      return {
        id: "lmsSoundEngine",
        name: "Sound Engine V2",
        color1: "#ba3bba",
        blocks: [
          {
            opcode: "createContext",
            blockType: Scratch.BlockType.COMMAND,
            text: "create context named [CTX]",
            arguments: {
              CTX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my context",
              },
            },
          },

          "---",

          {
            opcode: "loadSoundFromProject",
            blockType: Scratch.BlockType.COMMAND,
            text: "load sound [SOUND] as [NAME]",
            arguments: {
              SOUND: {
                type: Scratch.ArgumentType.SOUND,
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my sound",
              },
            },
          },

          "---",

          {
            opcode: "startSoundInContext",
            blockType: Scratch.BlockType.COMMAND,
            text: "start sound [NAME] in context [CTX]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my sound",
              },
              CTX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my context",
              },
            },
          },

          "---",

          {
            opcode: "stopSound",
            blockType: Scratch.BlockType.COMMAND,
            text: "stop sound [NAME] in context [CTX]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my sound",
              },
              CTX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "my context",
              },
            },
          },
        ],
        menus: {
          loopStartEnd: {
            acceptReporters: true,
            items: ["start", "end"],
          },
          toggle: {
            acceptReporters: true,
            items: ["enabled", "disabled"],
          },
        },
      };
    }

    createContext(args, util) {
      this._createNewContext(args.CTX);
    }

    async loadSoundFromProject(args, util) {
      const index = this._getSoundIndexByName(args.SOUND, util);
      if (index < 0) return;
      const sprite = util.target.sprite;

      const uri = sprite.sounds[index].asset.encodeDataURI();
      const name = args.NAME;
      await this._createNewSound(uri, name);
    }

    startSoundInContext(args) {
      this._createNewContext(args.CTX);
      const contextGroup = contextGroups[args.CTX];

      const binds = contextGroup.binds;
      const bindedSound = binds[args.NAME];
      if (!bindedSound) binds[args.NAME] = loadedSounds[args.NAME];

      const sound = contextGroup.binds[args.NAME];
      const context = contextGroup.ctx;
      if (!sound) return;

      if (sound.node) sound.node.stop();
      sound.node = context.createBufferSource();
      sound.node.buffer = sound.buffer;
      sound.node.connect(context.destination);
      sound.node.start(0);

      console.log(contextGroups);
    }

    stopSound(args) {
      const contextGroup = contextGroups[args.CTX];
      if (!contextGroup) return;

      const sound = contextGroup.binds[args.NAME];
      if (!sound || !sound.node) return;

      sound.node.stop();
    }

    /* Utility Functions */

    _getSoundIndexByName(soundName, util) {
      const sounds = util.target.sprite.sounds;
      for (let i = 0; i < sounds.length; i++) {
        if (sounds[i].name === soundName) {
          return i;
        }
      }
      return -1;
    }

    _createNewContext(name) {
      const ctx = name;
      if (contextGroups[ctx]) return;
      const newcontext = new AudioContext();
      contextGroups[ctx] = {
        ctx: newcontext,
        binds: {},
      };
      console.log(contextGroups);
    }

    async _createNewSound(url, name) {
      if (loadedSounds[name]) return;

      // This might be a problem later, check on this
      const context = new AudioContext();

      let arrayBuffer = Object.create(null);
      const response = await Scratch.fetch(url);
      arrayBuffer = await response.arrayBuffer();

      await context.decodeAudioData(arrayBuffer, (buffer) => {
        loadedSounds[name] = {
          buffer,
          node: null,
        };
      });
    }
  }

  Scratch.extensions.register(new SoundEngine());
})(Scratch);
