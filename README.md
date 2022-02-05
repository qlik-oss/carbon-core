# carbon (WIP)

## A React Native Nebula Engine

> _The atoms of carbon can bond together in diverse ways, resulting in various allotropes of carbon. Well-known allotropes include graphite, diamond, amorphous carbon, fullerenes, and React Native Supernovae._

This project renders nebula supernovae in the React Native context.  It renders Picasso Charts natively on the device without a need of the webview.

## Installing

### This is a WIP

`yarn add ssh://git@github.com:qlik-trial/carbon.git#workspace=sn-treemap`

### Limitations

- Since data has to be passed over to the native bridge, and React Native does not fully support JSI, at time of this writing, input(interactions) data is throttled to every 30ms
- When remote debugging, performance will be extremly slow, since it is literally running the javascript on the desktop and data has to be transfered from the desktop to the device.
- Android does not have the best JavaScript engine for React Native.  As a result, the custom carbon renderer, uses its own scene and uses a Quadtree for the broad-phase collision detection.  There is still some work left to be done.  The only narrow-phase support at this momoment is Axis-Aligned-Rects.  However, it imports the code from picasso.js to accomplish the narrow-phase.

## Kinesics

> _The study of the way in which certain body movements and gestures serve as a form of nonverbal communication._

This project uses a custom interaction manager named kinesics.  It is backward compatible with the hammer plugin.   Currently only "Pan" is supported.

### Example usage

```javascript
 const interactionType = env.carbon ? 'kinesics' : 'hammer';
 const interactions = [
    {
      type: interactionType,
      gestures: [
        {
          type: 'Pan',
          events: {
            panstart: function onPanStart(e) {
              this.chart.component('lassoComp').emit('lassoStart', e);
            },
            pan: function onPan(e) {
              this.chart.component('lassoComp').emit('lassoMove', e);
            },
            panend: function onPanEnd(e) {
              this.chart.component('lassoComp').emit('lassoEnd', e);
            },
          },
        },
      ],
    },
  ];

```
