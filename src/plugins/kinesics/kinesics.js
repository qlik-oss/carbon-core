export const kinesics = (config) => {
  const key = 'kinesics';
  const triggerBrushes = [];
  let onTouchStart = [];
  const {element} = config;
  let initialized = false;
  let initializedBrushes = false;

  function _setupBrushes(brush, chartInstance) {
    initializedBrushes = true;
   
    if (brush.trigger) {
      brush.trigger.forEach((b) => {
        const cbrush = chartInstance.brush(b.contexts[0]);
        triggerBrushes.push({cbrush, data: b.data, style: brush.consume[0].style});
      });
    }
 
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
        element.setTouchesStartListener((touches) => {
          onTouchStart.forEach((c) => {
            const touchEvent = {clientX: touches[0], clientY: touches[1]};
            const comp = {chart: config};
            c.call(comp, touchEvent);
          });
        });
        setupInteractions();
      }
    },
    off() {},
    on() {},
    destroy() {},
    setupBrushes(brush, chartInstance) {
      if(!initializedBrushes) {
        _setupBrushes(brush, chartInstance);
      }
    }
  };
};
