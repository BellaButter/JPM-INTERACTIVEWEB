# MediaPipe hand tracking (vendored)

Used by Shape Hunt hand mode (`shape-hunt.js`). Loaded only when a player chooses "Play with your hand".

- `tasks-vision-0.10.14/`: `@mediapipe/tasks-vision` 0.10.14 from npm (via cdn.jsdelivr.net), files unchanged except the source-map comment removed from `vision_bundle.mjs`.
- `hand_landmarker.task`: Hand Landmarker model, float16 v1, from storage.googleapis.com/mediapipe-models.
- Licence: Apache License 2.0 (`LICENSE`, from github.com/google-ai-edge/mediapipe).

To update, download a newer version into a new `tasks-vision-<version>/` folder and change `VISION` in `shape-hunt.js`.
