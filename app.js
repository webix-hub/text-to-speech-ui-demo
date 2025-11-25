import { historyCollection } from "./data.js";
import { IDS } from "./constants.js";
import {
  convertTextToSpeech,
  playAudio,
  setPlayerHandlers,
} from "./helpers.js";

// Init UI; attach audio event listeners after UI is built
webix.ready(() => {
  webix.ui({
    view: "layout",
    type: "wide",
    padding: 20,
    rows: [
      {
        cols: [
          {
            view: "form",
            id: IDS.form,
            width: 400,
            autoheight: false,
            elementsConfig: {
              labelWidth: 140,
              labelPosition: "top",
              bottomPadding: 20,
            },
            elements: [
              {
                view: "textarea",
                id: "textInput",
                label: "Text to Convert",
                height: 100,
                name: "text",
                invalidMessage: "Please enter the text to convert",
              },
              {
                view: "select",
                id: "voiceSelect",
                label: "Voice",
                name: "voice",
                invalidMessage: "Please select a voice option",
                options: [
                  { id: "coral", value: "Coral (Female)" },
                  { id: "alloy", value: "Alloy (Neutral)" },
                  { id: "echo", value: "Echo (Male)" },
                  { id: "sage", value: "Sage (Neutral)" },
                  { id: "verse", value: "Verse (Male)" },
                ],
              },
              {
                view: "textarea",
                id: "instructionInput",
                label: "Conversion Instructions",
                placeholder: "e.g., Speak slowly, Sound enthusiastic",
                height: 80,
                name: "instructions",
              },
              {
                cols: [
                  {
                    view: "button",
                    id: "convertBtn",
                    value: "Convert",
                    css: "webix_primary",
                    click: function () {
                      if ($$(IDS.form).validate()) {
                        convertTextToSpeech();
                      }
                    },
                  },
                  {
                    view: "button",
                    id: "clearBtn",
                    value: "Clear",
                    click: function () {
                      $$(IDS.form).clear();
                      $$(IDS.form).clearValidation();
                    },
                  },
                ],
              },
              {
                rows: [
                  {
                    view: "template",
                    id: IDS.audio,
                    autoheight: true,
                    borderless: true,
                    template: (values) => {
                      // after rendering, set handlers to the audio element
                      setTimeout(() => setPlayerHandlers());

                      return `<audio controls style="width:100%;" src="${
                        values?.audioUrl || ""
                      }"></audio>`;
                    },
                  },
                ],
              },
            ],
            rules: {
              text: webix.rules.isNotEmpty,
              voice: webix.rules.isNotEmpty,
            },
          },
          {
            view: "datatable",
            id: "historyTable",
            autoConfig: false,
            columns: [
              {
                id: "timestamp",
                header: "Timestamp",
                width: 150,
                format: webix.Date.dateToStr("%M %d, %H:%i"),
                resize: true,
              },
              {
                id: "preview",
                header: "Text Preview",
                fillspace: true,
                resize: true,
              },
              { id: "voice", header: "Voice", width: 100, resize: true },
              {
                id: "play",
                header: "Play",
                width: 80,
                template: (obj) =>
                  `<button class='playBtn webix_button' style="height:80%; margin:2px">${
                    obj.playing ? "Pause" : "Play"
                  }</button>`,
              },
            ],
            data: historyCollection,
            onClick: {
              playBtn: function (e, id) {
                playAudio(id);
              },
            },
          },
        ],
      },
      {
        view: "template",
        id: "statusBar",
        template: "",
        height: 30,
        css: "status_bar",
      },
    ],
  });

  // sync datatable with data source
  $$(IDS.datatable).sync(historyCollection);
});
