import { historyCollection } from "./data.js";
import { IDS, API_KEY, API_URL } from "./constants.js";

export function setPlayerHandlers() {
  // handle interaction with audioplayer
  const audioElem = $$(IDS.audio).getNode().querySelector("audio");
  ["play", "pause", "ended"].forEach((ev) =>
    audioElem.addEventListener(ev, handleAudioEvent)
  );
}

// Handler for audio events
export function handleAudioEvent(event) {
  const currentRowId = $$(IDS.audio).getValues()?.id;
  if (!currentRowId) return;

  switch (event.type) {
    case "play":
      updatePlayButtonState(currentRowId, true);
      break;
    case "pause":
      updatePlayButtonState(currentRowId, false);
      break;
    case "ended":
      updatePlayButtonState(currentRowId, false);
      break;
  }
}

export async function convertTextToSpeech() {
  const { text, voice, instructions } = $$(IDS.form).getValues();

  $$(IDS.status).setHTML("Converting...");
  $$(IDS.convertBtn).disable();

  try {
    let audioUrl;

    // If API key is missing, fall back to test mode
    if (!API_KEY || API_KEY === "YOUR_OPENAI_API_KEY") {
      webix.message("Using test mode: no API key provided.", "debug");
      audioUrl =
        "https://docs.webix.com/filemanager-backend/direct?id=%2FMusic%2Fbensound-betterdays.mp3";
    } else {
      // Real API call
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-tts",
          input: text,
          voice: voice,
          response_format: "mp3",
          speed: 1.0,
          ...(instructions && { prompt: instructions }),
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);
      const audioBlob = await response.blob();
      audioUrl = URL.createObjectURL(audioBlob);
    }

    // Update history and player
    const id = webix.uid();
    historyCollection.add({
      id,
      timestamp: new Date(),
      preview: text.slice(0, 50) + (text.length > 50 ? "..." : ""),
      voice,
      audioUrl,
    });

    $$(IDS.audio).setValues({ id, audioUrl });

    $$(IDS.status).setHTML("Conversion successful!");
  } catch (err) {
    console.error(err);
    webix.message({
      type: "error",
      text: "Conversion failed. See console for details.",
    });
    $$(IDS.status).setHTML("Conversion failed.");
  } finally {
    $$(IDS.convertBtn).enable();
  }
}

// Play/pause logic for the datatable and the player
export function playAudio(id) {
  const item = historyCollection.getItem(id);
  if (item && item.audioUrl) {
    const audioTemplate = $$(IDS.audio);
    const values = audioTemplate.getValues();

    if (values?.audioUrl !== item.audioUrl) {
      audioTemplate.setValues({
        audioUrl: item.audioUrl,
        id: item.id, // track active row
      });
    }
    const audioElem = audioTemplate.getNode().querySelector("audio");

    if (audioElem.paused) {
      audioElem.play();
      updatePlayButtonState(id, true);
    } else {
      audioElem.pause();
      updatePlayButtonState(id, false);
    }
  } else {
    webix.message({ type: "error", text: "Audio not found." });
  }
}

// Helper to update play button state (text is defined in datatable template)
function updatePlayButtonState(rowId, state) {
  historyCollection.updateItem(rowId, { playing: state });
}
