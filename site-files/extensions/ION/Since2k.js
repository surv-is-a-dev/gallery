(function(Scratch){
//Made by ION, Based on improving scratches days since 2000 block.
class Since2000 {
    constructor() {}
  
    getInfo() {
      return {
        id: 'since2000',
        name: 'Since 2000',
        color1: '#15b9a4',
        color2: '#13a895',
        blocks: [
          /* Old blocks */
          {
            hideFromPalette: true,
            opcode: 'millisecondsSince2000',
            blockType: 'reporter',
            text: 'milliseconds since 2000',
          },
          /* "Removed" cause it was broken */
          {
            hideFromPalette: true,
            opcode: 'microsecondsSince2000',
            blockType: 'reporter',
            text: 'microseconds since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'secondsSince2000',
            blockType: 'reporter',
            text: 'seconds since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'minutesSince2000',
            blockType: 'reporter',
            text: 'minutes since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'hoursSince2000',
            blockType: 'reporter',
            text: 'hours since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'daysSince2000',
            blockType: 'reporter',
            text: 'days since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'weeksSince2000',
            blockType: 'reporter',
            text: 'weeks since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'monthsSince2000',
            blockType: 'reporter',
            text: 'months since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'yearsSince2000',
            blockType: 'reporter',
            text: 'years since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'decadesSince2000',
            blockType: 'reporter',
            text: 'decades since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'centuriesSince2000',
            blockType: 'reporter',
            text: 'centuries since 2000',
          },
          {
            hideFromPalette: true,
            opcode: 'millenniumsSince2000',
            blockType: 'reporter',
            text: 'millenniums since 2000',
          },
          /* New block */
          {
            opcode: 'Since2000',
            blockType: 'reporter',
            text: '[menu] since 2000',
            arguments: {
              menu: {
                type: Scratch.ArgumentType.STRING,
                menu: 'since2k',
                defaultValue: 'seconds'
              }
            }
          },
        ], menus: {
          since2k: {
            acceptReporters: true,
            items: ['milliseconds', 'seconds',
                    'minutes', 'hours', 'days',
                    'weeks', 'months', 'years',
                    'decades', 'centuries',
                    'millenniums']
          }
        }
      };
    }
  
    millisecondsSince2000() {
      const now = new Date();
      //@ts-ignore
      const since2000 = now - new Date('2000-01-01');
      return since2000;
    }
  
    microsecondsSince2000() {
      return this.millisecondsSince2000() * 1000;
    }
  
    secondsSince2000() {
      return this.millisecondsSince2000() / 1000;
    }
  
    minutesSince2000() {
      return this.secondsSince2000() / 60;
    }
  
    hoursSince2000() {
      return this.minutesSince2000() / 60;
    }
  
    daysSince2000() {
      const now = new Date();
      const startDate = new Date('2000-01-01');
      //@ts-ignore
      const days = (now - startDate) / (1000 * 60 * 60 * 24);
      return days;
    }
  
    weeksSince2000() {
      return this.daysSince2000() / 7;
    }
  
    monthsSince2000() {
      const now = new Date();
      const startDate = new Date('2000-01-01');
      let months = 0;
  
      while (startDate < now) {
        months++;
        startDate.setMonth(startDate.getMonth() + 1);
      }
  
      return months - 1;
    }
  
    yearsSince2000() {
      return this.monthsSince2000() / 12;
    }
  
    decadesSince2000() {
      return this.yearsSince2000() / 10;
    }
  
    centuriesSince2000() {
      return this.yearsSince2000() / 100;
    }
  
    millenniumsSince2000() {
      return this.yearsSince2000() / 1000;
    }

    Since2000({ menu }) {
      switch (menu) {
        case 'milliseconds':
          return this.millisecondsSince2000();
        case 'microseconds':
          /* this not "available", but still */
          return this.microsecondsSince2000();
        case 'seconds':
          return this.secondsSince2000();
        case 'minutes':
          return this.minutesSince2000();
        case 'hours':
          return this.hoursSince2000();
        case 'days':
          return this.daysSince2000();
        case 'weeks':
          return this.weeksSince2000();
        case 'months':
          return this.monthsSince2000();
        case 'years':
          return this.yearsSince2000();
        case 'decades':
          return this.decadesSince2000();
        case 'millenniums':
          return this.millenniumsSince2000();
        default:
          return -1;
      }
    }
  }
  //@ts-ignore
  Scratch.extensions.register(new Since2000());
})(Scratch);