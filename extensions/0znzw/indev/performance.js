(function(Scratch) {

    // todo:
    //   allow: setting the desired size of the browser's resource timing buffer
    //   add: PerformanceMark / performance.measure
    //   add: performace.memory

    class extension {
        getInfo() {
            return {
                id: '0znzwPerformance',
                name: 'Performance',
                blocks: [{
                    opcode: 'toJSON',
                    text: 'performance json',
                    blockType: 'reporter'
                }, {
                    opcode: 'baselineTimestamp',
                    text: 'baseline monotonic clock',
                    blockType: 'reporter'
                }, {
                    opcode: 'timeSinceBaseline',
                    text: 'timestamp since baseline',
                    blockType: 'reporter'
                }, {
                    opcode: 'markInTimeline',
                    text: 'mark performance in timeline, name: [MARK_NAME]',
                    blockType: 'command'
                },
                {
                    blockType: 'label',
                    text: '/!\\ EXPERIMENTAL /!\\'
                },
                {
                    opcode: 'measureUsage',
                    text: 'measure web app usage',
                    blockType: 'reporter'
                }]
            }
        }
        toJSON() {
            return JSON.stringify(performance.toJSON());
        }
        baselineTimestamp() {
            // https://w3c.github.io/hr-time/#dfn-monotonic-clock
            return performance.timeOrigin;
        }
        timeSinceBaseline() {
            return performance.now();
        }
        markInTimeline({ MARK_NAME }) {
            MARK_NAME = Scratch.Cast.toString(MARK_NAME);
            performance.mark(MARK_NAME);
        }
        async measureUsage() {
            // https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory#browser_compatibility
            // @ts-expect-error its experimental, ignore this error
            const sample = await performance.measureUserAgentSpecificMemory();
            return sample;
        }
    }

    // @ts-ignore This happens sometimes
    Scratch.extensions.register(new extension());
})(Scratch);