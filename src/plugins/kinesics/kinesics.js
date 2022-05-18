export const kinesics = (config) => {
  const key = 'kinesics';
  const triggerBrushes = [];
  let onTouchStart = [];
  const {element} = config;
  let initialized = false;

  function setupBrushes() {
    config?.settings?.components.forEach((c) => {
      const cc = config.component(c.key);
      if (cc.brush) {
        if (cc.brush.trigger) {
          cc.brush.trigger.forEach((brush) => {
            const cbrush = config.brush(brush.contexts[0]);
            triggerBrushes.push({cbrush, data: brush.data, style: cc.brush.consume[0].style});
          });
        }
      }
    });
    if(triggerBrushes.length > 0) {
      element.setSelectionBrushes(triggerBrushes);
    }
  }

  function setupInteractions() {
    if (config?.settings?.interactions) {
      onTouchStart = config.settings.interactions.reduce((acc, curr) => {
        if (curr.type !== 'kinesics') {
          if (curr.events.touchstart) {
            acc.push(curr.events.touchstart);
          }
        }
        return acc;
      }, []);
    }
  }

  return {
    get key() {
      return key;
    },
    set(_newSettings) {
      if (element && !initialized) {
        initialized = true;
        // element.setSelectionsListener((composites) => {
        //   triggerBrushes.forEach((brush) => {
        //     brush.cbrush.clear();
        //     const dataValues = composites.reduce((prv, curr) => {
        //       const v = curr[brush.data];
        //       if (v) {
        //         prv.push(v);
        //       }
        //       return prv;
        //     }, []);
        //     dataValues.forEach((value) => {
        //       const kv = `/qHyperCubeDef/${value.source.field}`;
        //       const dv = value.value;
        //       brush.cbrush.addValue(kv, dv);
        //     });
        //   });
        // });
        // element.setTouchesStartListener((touches) => {
        //   onTouchStart.forEach((c) => {
        //     const touchEvent = {clientX: touches[0], clientY: touches[1]};
        //     const comp = {chart: config};
        //     c.call(comp, touchEvent);
        //   });
        // });
        setupBrushes();
        setupInteractions();
      }
    },
    off() {},
    on() {},
    destroy() {
      // element.removeAllTouchListeners();
    },
  };
};
